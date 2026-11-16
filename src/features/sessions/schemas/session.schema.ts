import { z } from "zod";
import { isValidISO } from "@/lib/dates";
import { optionalText } from "@/lib/zod";

const optionalId = z
  .string()
  .optional()
  .transform((v) => v || undefined);

export const startSessionSchema = z.object({
  subjectId: z.string().min(1, "Selecione a disciplina"),
  topicId: optionalId,
  planItemId: optionalId,
});

export const finishSessionSchema = z.object({
  id: z.string().min(1),
  notes: optionalText(2000),
  difficulties: optionalText(2000),
});

export type StartSessionInput = z.infer<typeof startSessionSchema>;
export type FinishSessionInput = z.infer<typeof finishSessionSchema>;

const amount = (label: string, max: number) =>
  z.coerce
    .number({ invalid_type_error: `Informe ${label}` })
    .int("Use números inteiros")
    .min(0, "Não use valores negativos")
    .max(max, `Valor máximo para ${label}: ${max}`);

export const manualSessionSchema = z
  .object({
    id: optionalId,
    date: z.string().refine(isValidISO, "Data inválida"),
    subjectId: z.string().min(1, "Selecione a disciplina"),
    topicId: optionalId,
    hours: amount("as horas", 24),
    minutes: amount("os minutos", 59),
    notes: optionalText(2000),
  })
  .transform((d) => ({ ...d, seconds: d.hours * 3600 + d.minutes * 60 }))
  .refine((d) => d.seconds >= 60, { message: "Informe pelo menos 1 minuto de estudo", path: ["minutes"] })
  .refine((d) => d.seconds <= 86400, { message: "O tempo máximo por registro é de 24 horas", path: ["hours"] });

export type ManualSessionInput = z.infer<typeof manualSessionSchema>;

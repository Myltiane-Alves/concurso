import { z } from "zod";
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

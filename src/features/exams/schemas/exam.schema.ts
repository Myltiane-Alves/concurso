import { z } from "zod";
import { optionalText } from "@/lib/zod";

export const examSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do concurso").max(200),
  organ: optionalText(),
  board: optionalText(),
  role: optionalText(),
  examDate: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(`${v}T12:00:00.000Z`) : undefined))
    .refine((d) => !d || !Number.isNaN(d.getTime()), "Data da prova inválida"),
});

export type ExamInput = z.infer<typeof examSchema>;

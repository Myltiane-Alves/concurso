import { z } from "zod";

export const planSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do ciclo").max(120),
});

export const planItemSchema = z.object({
  planId: z.string().min(1),
  subjectId: z.string().min(1, "Selecione a disciplina"),
  minutes: z.coerce
    .number({ invalid_type_error: "Informe o tempo do bloco" })
    .int()
    .min(5, "O bloco deve ter ao menos 5 minutos")
    .max(600, "O bloco deve ter no máximo 600 minutos"),
});

export type PlanItemInput = z.infer<typeof planItemSchema>;

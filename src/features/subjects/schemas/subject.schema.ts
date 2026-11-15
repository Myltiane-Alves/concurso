import { z } from "zod";

export const subjectSchema = z.object({
  examId: z.string().min(1, "Selecione o concurso"),
  name: z.string().trim().min(2, "Informe o nome da disciplina").max(200),
  priority: z.coerce.number().int().min(1).max(5),
});

export type SubjectInput = z.infer<typeof subjectSchema>;

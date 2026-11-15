import { z } from "zod";
import { optionalText } from "@/lib/zod";

export const errorNoteSchema = z.object({
  subjectId: z.string().min(1, "Selecione a disciplina"),
  topicId: z
    .string()
    .optional()
    .transform((v) => v || undefined),
  category: z.enum(["NOT_KNOWN", "FORGOT", "CONFUSION", "CARELESS", "MISREAD"], {
    message: "Selecione a categoria do erro",
  }),
  statement: z.string().trim().min(3, "Informe o enunciado ou a referência da questão").max(3000),
  wrongAnswer: optionalText(1000),
  correctAnswer: optionalText(1000),
  explanation: optionalText(3000),
  scheduleReview: z
    .string()
    .optional()
    .transform((v) => v === "on"),
});

export type ErrorNoteInput = z.infer<typeof errorNoteSchema>;

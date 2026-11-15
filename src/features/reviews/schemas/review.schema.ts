import { z } from "zod";
import { isValidISO } from "@/lib/dates";
import { optionalText } from "@/lib/zod";

const optionalId = z
  .string()
  .optional()
  .transform((v) => v || undefined);

export const createReviewSchema = z.object({
  subjectId: optionalId,
  topicId: optionalId,
  title: optionalText(200),
  date: z.string().refine(isValidISO, "Data inválida"),
  notes: optionalText(500),
});

export const completeReviewSchema = z.object({
  id: z.string().min(1),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"], { message: "Informe como foi a revisão" }),
  nextInDays: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined))
    .refine(
      (v) => v === undefined || (Number.isInteger(v) && v >= 1 && v <= 365),
      "Informe de 1 a 365 dias para a próxima revisão"
    ),
  notes: optionalText(500),
});

export const postponeReviewSchema = z.object({
  id: z.string().min(1),
  days: z.coerce.number().int().min(1).max(30),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type CompleteReviewInput = z.infer<typeof completeReviewSchema>;

import { z } from "zod";
import { isValidISO } from "@/lib/dates";
import { optionalText } from "@/lib/zod";

export const activitySchema = z.object({
  title: optionalText(200),
  date: z.string().refine(isValidISO, "Data inválida"),
  subjectId: z
    .string()
    .optional()
    .transform((v) => v || undefined),
  minutes: z.coerce
    .number({ invalid_type_error: "Informe o tempo previsto" })
    .int()
    .min(5, "Mínimo de 5 minutos")
    .max(720, "Máximo de 720 minutos"),
});

export type ActivityInput = z.infer<typeof activitySchema>;

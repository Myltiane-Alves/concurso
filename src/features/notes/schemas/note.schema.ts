import { z } from "zod";
import { optionalText } from "@/lib/zod";

const optionalId = z
  .string()
  .optional()
  .transform((v) => v || undefined);

export const noteSchema = z
  .object({
    id: optionalId,
    title: z.string().trim().min(2, "Informe o título").max(200),
    content: z.string().trim().min(1, "Escreva o conteúdo da anotação").max(20000),
    subjectId: optionalId,
    topicId: optionalId,
    links: optionalText(2000),
  })
  .refine(
    (d) =>
      !d.links ||
      d.links
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .every((l) => /^https?:\/\/\S+$/i.test(l)),
    { message: "Cada link deve começar com http:// ou https://", path: ["links"] }
  );

export type NoteInput = z.infer<typeof noteSchema>;

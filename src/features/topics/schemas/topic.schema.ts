import { z } from "zod";
import { TopicStatus } from "@prisma/client";
import { optionalText } from "@/lib/zod";

export const topicSchema = z.object({
  subjectId: z.string().min(1),
  title: z.string().trim().min(2, "Informe o título do conteúdo").max(300),
  code: optionalText(30),
  parentId: z
    .string()
    .optional()
    .transform((v) => v || undefined),
});

export const importSchema = z.object({
  subjectId: z.string().min(1),
  text: z.string().trim().min(3, "Cole o texto do edital"),
});

export const statusSchema = z.object({
  id: z.string().min(1),
  subjectId: z.string().min(1),
  status: z.nativeEnum(TopicStatus),
});

export type TopicInput = z.infer<typeof topicSchema>;

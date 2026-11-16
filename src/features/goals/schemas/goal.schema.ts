import { z } from "zod";

const optionalId = z
  .string()
  .optional()
  .transform((v) => v || undefined);

const amount = z
  .string()
  .optional()
  .transform((v) => (v ? Number(v) : 0));

const MAX_MINUTES = { DAILY: 24 * 60, WEEKLY: 168 * 60, MONTHLY: 744 * 60 } as const;

export const goalSchema = z
  .object({
    id: optionalId,
    type: z.enum(["STUDY_TIME", "QUESTIONS"], { message: "Selecione o tipo da meta" }),
    period: z.enum(["DAILY", "WEEKLY", "MONTHLY"], { message: "Selecione o período da meta" }),
    subjectId: optionalId,
    hours: amount,
    minutes: amount,
    questions: amount,
  })
  .transform((d, ctx) => {
    const fail = (message: string, path: string) => {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message, path: [path] });
      return z.NEVER;
    };

    const values = [d.hours, d.minutes, d.questions];
    if (!values.every((v) => Number.isInteger(v) && v >= 0)) {
      return fail("Use apenas números inteiros e positivos", "hours");
    }
    if (d.minutes > 59) return fail("Os minutos devem ir de 0 a 59", "minutes");

    let target: number;
    if (d.type === "STUDY_TIME") {
      target = d.hours * 60 + d.minutes;
      if (target < 10) return fail("A meta de estudo deve ter ao menos 10 minutos", "minutes");
      if (target > MAX_MINUTES[d.period]) {
        return fail("Essa meta é maior que o tempo disponível no período", "hours");
      }
    } else {
      target = d.questions;
      if (target < 1) return fail("Informe ao menos 1 questão", "questions");
      if (target > 10000) return fail("A meta máxima é de 10.000 questões", "questions");
    }

    return { id: d.id, type: d.type, period: d.period, subjectId: d.subjectId, target };
  });

export type GoalInput = z.infer<typeof goalSchema>;

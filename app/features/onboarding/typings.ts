import { z } from "zod";

export type OnboardingQuestionType = "text" | "single_choice" | "multiple_choice";

export interface IOnboardingUserAnswer {
  answer: string | null;
  answer_options: string[] | null;
}

export interface IOnboardingQuestion {
  id: number;
  key: string;
  question: string;
  question_type: OnboardingQuestionType;
  options: string[] | null;
  order: number;
  is_active: boolean;
  user_answer: IOnboardingUserAnswer | null;
}

export interface IOnboardingQuestionsResponse {
  onboarding_completed: boolean;
  onboarding_completed_at: string | null;
  questions: IOnboardingQuestion[];
}

export const OnboardingUserAnswerSchema = z.object({
  answer: z.string().nullable().catch(null),
  answer_options: z.array(z.string()).nullable().catch(null),
});

export const OnboardingQuestionSchema = z.object({
  id: z.coerce.number().int(),
  key: z.string(),
  question: z.string(),
  question_type: z.enum(["text", "single_choice", "multiple_choice"]),
  options: z.array(z.string()).nullable().catch(null),
  order: z.number().int().catch(0),
  is_active: z.boolean().catch(true),
  user_answer: OnboardingUserAnswerSchema.nullable().catch(null),
}) satisfies z.ZodType<IOnboardingQuestion>;

export const OnboardingQuestionsResponseSchema = z.object({
  onboarding_completed: z.boolean().catch(false),
  onboarding_completed_at: z.string().nullable().catch(null),
  questions: z.array(OnboardingQuestionSchema).catch([]),
}) satisfies z.ZodType<IOnboardingQuestionsResponse>;

export interface IOnboardingAnswer {
  question_id: number;
  answer?: string | null;
  answer_options?: string[] | null;
}

export interface IOnboardingSubmitPayload {
  answers: IOnboardingAnswer[];
}

export interface IOnboardingSubmitResponse {
  onboarding_completed: boolean;
  onboarding_completed_at: string;
  total_answers_saved: number;
}

export const OnboardingAnswerSchema = z
  .object({
    question_id: z.number(),
    answer: z.string().max(1000).optional().nullable(),
    answer_options: z.array(z.string()).optional().nullable(),
  })
  .refine(
    (data) => {
      const hasAnswer = data.answer !== null && data.answer !== undefined && data.answer.trim() !== "";
      const hasOptions = Array.isArray(data.answer_options) && data.answer_options.length > 0;
      return hasAnswer || hasOptions;
    },
    { message: "É necessário fornecer uma resposta." }
  ) satisfies z.ZodType<IOnboardingAnswer>;

export const OnboardingSubmitSchema = z.object({
  answers: z
    .array(OnboardingAnswerSchema)
    .min(1, "Ao menos uma resposta é obrigatória."),
}) satisfies z.ZodType<IOnboardingSubmitPayload>;

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { useOnboardingQuestions, useSubmitOnboarding } from "../../hooks";
import type { IOnboardingQuestion, IOnboardingSubmitPayload } from "../../typings";

interface OnboardingFormProps {
  onCompleted: () => void;
}

const QUESTIONS_PER_STEP = 1;

type AnswerValue = string | string[];
type FormValues = Record<string, AnswerValue>;

function buildSchemaForQuestion(q: IOnboardingQuestion): z.ZodTypeAny {
  if (q.question_type === "text") {
    return z.string().min(1, "Resposta obrigatória.").max(1000, "Máximo de 1000 caracteres.");
  }
  if (q.question_type === "single_choice") {
    return z.string().min(1, "Selecione uma opção.");
  }
  return z.array(z.string()).min(1, "Selecione ao menos uma opção.");
}

function validateQuestion(q: IOnboardingQuestion, value: AnswerValue | undefined): string | null {
  const schema = buildSchemaForQuestion(q);
  const result = schema.safeParse(value);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? "Resposta inválida.";
}

function QuestionField({
  question,
  value,
  onChange,
  error,
}: {
  question: IOnboardingQuestion;
  value: string | string[] | undefined;
  onChange: (val: string | string[]) => void;
  error?: string;
}) {
  if (question.question_type === "text") {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-beergam-typography-primary">
          {question.question}
        </label>
        <textarea
          rows={3}
          value={Array.isArray(value) ? "" : (value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-beergam-border bg-beergam-background-secondary px-3 py-2 text-sm text-beergam-typography-primary placeholder:text-beergam-typography-tertiary focus:outline-none focus:ring-2 focus:ring-beergam-primary/50 resize-none"
          placeholder="Digite sua resposta..."
        />
        {error && <span className="text-xs text-beergam-red">{error}</span>}
      </div>
    );
  }

  if (question.question_type === "single_choice") {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-beergam-typography-primary">
          {question.question}
        </label>
        <div className="flex flex-col gap-2">
          {(question.options ?? []).map((opt) => (
            <label
              key={opt}
              className={[
                "flex items-center gap-3 cursor-pointer rounded-lg border px-4 py-3 transition-colors",
                value === opt
                  ? "border-beergam-primary bg-beergam-primary/10 text-beergam-primary"
                  : "border-beergam-border bg-beergam-background-secondary text-beergam-typography-primary hover:border-beergam-primary/50",
              ].join(" ")}
            >
              <input
                type="radio"
                className="accent-beergam-primary"
                checked={value === opt}
                onChange={() => onChange(opt)}
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
        {error && <span className="text-xs text-beergam-red">{error}</span>}
      </div>
    );
  }

  const selected = (value as string[]) ?? [];
  const toggleOption = (opt: string) => {
    const next = selected.includes(opt)
      ? selected.filter((o) => o !== opt)
      : [...selected, opt];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-beergam-typography-primary">
        {question.question}
        <span className="ml-1 text-xs text-beergam-typography-tertiary">
          (múltipla escolha)
        </span>
      </label>
      <div className="flex flex-col gap-2">
        {(question.options ?? []).map((opt) => (
          <label
            key={opt}
            className={[
              "flex items-center gap-3 cursor-pointer rounded-lg border px-4 py-3 transition-colors",
              selected.includes(opt)
                ? "border-beergam-primary bg-beergam-primary/10 text-beergam-primary"
                : "border-beergam-border bg-beergam-background-secondary text-beergam-typography-primary hover:border-beergam-primary/50",
            ].join(" ")}
          >
            <input
              type="checkbox"
              className="accent-beergam-primary"
              checked={selected.includes(opt)}
              onChange={() => toggleOption(opt)}
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>
      {error && <span className="text-xs text-beergam-red">{error}</span>}
    </div>
  );
}

export default function OnboardingForm({ onCompleted }: OnboardingFormProps) {
  const { data, isLoading } = useOnboardingQuestions();
  const submitMutation = useSubmitOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  const questions = useMemo(
    () => data?.questions?.filter((q) => q.is_active) ?? [],
    [data]
  );

  // Inicializa os valores respeitando o tipo de cada pergunta
  const initialValues = useMemo<FormValues>(() => {
    return Object.fromEntries(
      questions.map((q) => {
        const key = `q_${q.id}`;
        if (q.question_type === "multiple_choice") {
          return [key, q.user_answer?.answer_options ?? []];
        }
        if (q.question_type === "single_choice") {
          return [key, q.user_answer?.answer_options?.[0] ?? ""];
        }
        // text — só aceita string, nunca array
        return [key, typeof q.user_answer?.answer === "string" ? q.user_answer.answer : ""];
      })
    );
  }, [questions]);

  const [values, setValues] = useState<FormValues>({});

  // Sincroniza quando as perguntas chegam do servidor (query assíncrona)
  useEffect(() => {
    if (questions.length > 0) {
      setValues(initialValues);
    }
  }, [questions.length, initialValues]);

  const steps = useMemo(() => {
    const result: IOnboardingQuestion[][] = [];
    for (let i = 0; i < questions.length; i += QUESTIONS_PER_STEP) {
      result.push(questions.slice(i, i + QUESTIONS_PER_STEP));
    }
    return result;
  }, [questions]);

  const totalSteps = steps.length;
  const currentQuestions = steps[currentStep] ?? [];

  const handleChange = (questionId: number, val: AnswerValue) => {
    setValues((prev) => ({ ...prev, [`q_${questionId}`]: val }));
    setStepErrors((prev) => ({ ...prev, [`q_${questionId}`]: "" }));
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    let valid = true;
    for (const q of currentQuestions) {
      const error = validateQuestion(q, values[`q_${q.id}`]);
      if (error) {
        newErrors[`q_${q.id}`] = error;
        valid = false;
      }
    }
    setStepErrors(newErrors);
    return valid;
  };

  const handleNext = () => {
    if (validateCurrentStep()) setCurrentStep((s) => s + 1);
  };

  const handlePrev = () => setCurrentStep((s) => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    const answers: IOnboardingSubmitPayload["answers"] = questions.map((q) => {
      const val = values[`q_${q.id}`];
      if (q.question_type === "text") {
        return { question_id: q.id, answer: val as string };
      }
      if (q.question_type === "single_choice") {
        return { question_id: q.id, answer_options: [val as string] };
      }
      return { question_id: q.id, answer_options: val as string[] };
    });

    submitMutation.mutate(
      { answers },
      {
        onSuccess: (res) => {
          if (res.success || res.data?.onboarding_completed) {
            onCompleted();
          }
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 w-full animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-lg bg-beergam-border/40" />
        ))}
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="text-center text-beergam-typography-secondary py-8">
        Nenhuma pergunta disponível no momento.
      </div>
    );
  }

  const progressPercent =
    totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 100;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      {/* Stepper */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-xs text-beergam-typography-tertiary mb-1">
          <span>
            Pergunta {currentStep + 1} de {totalSteps}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-beergam-border/40 overflow-hidden">
          <div
            className="h-full rounded-full bg-beergam-primary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Pergunta da etapa atual */}
      <div className="flex flex-col gap-5">
        {currentQuestions.map((q) => (
          <QuestionField
            key={q.id}
            question={q}
            value={values[`q_${q.id}`]}
            onChange={(val) => handleChange(q.id, val)}
            error={stepErrors[`q_${q.id}`]}
          />
        ))}
      </div>

      {/* Navegação */}
      <div className="flex justify-between gap-3 pt-2">
        {currentStep > 0 ? (
          <BeergamButton
            title="Anterior"
            type="button"
            animationStyle="fade"
            onClick={handlePrev}
            className="flex-1"
            mainColor="beergam-typography-secondary"
          />
        ) : (
          <div className="flex-1" />
        )}

        {isLastStep ? (
          <BeergamButton
            title="Concluir"
            type="submit"
            animationStyle="slider"
            loading={submitMutation.isPending}
            className="flex-1"
            icon="check"
          />
        ) : (
          <BeergamButton
            title="Próximo"
            type="button"
            animationStyle="slider"
            onClick={handleNext}
            className="flex-1"
            icon="chevron"
          />
        )}
      </div>
    </form>
  );
}

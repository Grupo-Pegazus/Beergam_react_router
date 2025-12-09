import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Section from "~/src/components/ui/Section";
import Grid from "~/src/components/ui/Grid";
import { perguntasService } from "~/features/perguntas/service";
import type {
  Question,
  QuestionsFilters,
  QuestionsFiltersState,
  QuestionsInsights,
  QuestionsMetricsResponse,
} from "~/features/perguntas/typings";
import { QuestionsFilters as QuestionsFiltersBar } from "~/features/perguntas/components/QuestionsFilters";
import { QuestionsMetrics } from "~/features/perguntas/components/QuestionsMetrics";
import { QuestionsList } from "~/features/perguntas/components/QuestionsList";
import { AnswerModal } from "~/features/perguntas/components/AnswerModal";

const DEFAULT_FILTERS: QuestionsFiltersState = {
  status: "",
  item_id: "",
  text: "",
  answered: "all",
  date_from: undefined,
  date_to: undefined,
  page: 1,
  per_page: 20,
  sort_by: "date_created",
  sort_order: "desc",
};

function mapToApiFilters(filters: QuestionsFiltersState): Partial<QuestionsFilters> {
  return {
    status: filters.status || undefined,
    item_id: filters.item_id || undefined,
    text: filters.text || undefined,
    answered:
      filters.answered === "all" ? undefined : filters.answered === "answered" ? true : false,
    date_from: filters.date_from ? new Date(filters.date_from).toISOString() : undefined,
    date_to: filters.date_to ? new Date(filters.date_to).toISOString() : undefined,
    page: filters.page,
    per_page: filters.per_page,
    sort_by: filters.sort_by,
    sort_order: filters.sort_order,
  };
}

export default function PerguntasPage() {
  const [filters, setFilters] = useState<QuestionsFiltersState>(DEFAULT_FILTERS);
  const [questionToAnswer, setQuestionToAnswer] = useState<Question | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const queryClient = useQueryClient();

  const apiFilters = useMemo(() => mapToApiFilters(filters), [filters]);

  const questionsQuery = useQuery({
    queryKey: ["questions", apiFilters],
    queryFn: () => perguntasService.list(apiFilters),
    keepPreviousData: true,
  });

  const metricsQuery = useQuery({
    queryKey: ["questions_metrics"],
    queryFn: () => perguntasService.getMetrics(),
    staleTime: 1000 * 60 * 5,
  });

  const insights: QuestionsInsights | undefined =
    (questionsQuery.data?.success ? questionsQuery.data.data.insights : undefined) ??
    (metricsQuery.data?.success ? metricsQuery.data.data.insights : undefined);

  const metricsPayload: QuestionsMetricsResponse | null =
    metricsQuery.data?.success && metricsQuery.data.data
      ? metricsQuery.data.data
      : null;

  const questions = questionsQuery.data?.success ? questionsQuery.data.data.questions : [];
  const pagination = questionsQuery.data?.success ? questionsQuery.data.data.pagination : undefined;

  const answerMutation = useMutation({
    mutationFn: ({ questionId, answer }: { questionId: string; answer: string }) =>
      perguntasService.answer(questionId, answer),
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Não foi possível enviar a resposta.");
        return;
      }
      toast.success("Resposta enviada com sucesso.");
      setQuestionToAnswer(null);
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["questions_metrics"] });
    },
    onError: () => {
      toast.error("Erro ao enviar a resposta. Tente novamente.");
    },
  });

  function handleFiltersChange(next: QuestionsFiltersState) {
    setFilters(next);
  }

  function applyFilters() {
    setFilters((prev) => ({ ...prev, page: 1 }));
    queryClient.invalidateQueries({ queryKey: ["questions"] });
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
    queryClient.invalidateQueries({ queryKey: ["questions"] });
  }

  function handlePageChange(nextPage: number) {
    setFilters((prev) => ({ ...prev, page: nextPage }));
  }

  return (
    <>
      <Grid cols={{ base: 1 }} gap={4} className="mb-4">
        <Section title="Visão geral">
          <QuestionsMetrics
            insights={insights}
            metricsPayload={metricsPayload || undefined}
            loading={questionsQuery.isLoading || metricsQuery.isLoading}
          />
        </Section>

        <Section
          title="Filtrar perguntas"
        >
          <QuestionsFiltersBar
            value={filters}
            onChange={handleFiltersChange}
            onReset={resetFilters}
            onSubmit={applyFilters}
          />
        </Section>

        <Section
          title="Perguntas"
          actions={
            <span className="text-xs text-slate-500">
              {pagination ? `${pagination.total_count} encontradas` : "—"}
            </span>
          }
        >
          <QuestionsList
            questions={questions}
            pagination={pagination}
            loading={questionsQuery.isLoading}
            onPageChange={handlePageChange}
            onSelectToAnswer={(question) => setQuestionToAnswer(question)}
            onSelectDetails={(question) => setSelectedQuestion(question)}
          />
        </Section>

        {selectedQuestion ? (
          <Section title="Detalhes do anúncio/pergunta">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="font-semibold text-slate-900 mb-1">Pergunta</p>
                <p>{selectedQuestion.text}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Criada em {selectedQuestion.date_created ?? "—"}
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-3">
                <p className="font-semibold text-slate-900 mb-1">Anúncio</p>
                <p className="text-slate-800">{selectedQuestion.item_title ?? "—"}</p>
                <p className="text-xs text-slate-500">Item ID: {selectedQuestion.item_id ?? "—"}</p>
                <p className="text-xs text-slate-500">Seller ID: {selectedQuestion.seller_id ?? "—"}</p>
              </div>
            </div>
          </Section>
        ) : null}
      </Grid>

      <AnswerModal
        open={Boolean(questionToAnswer)}
        question={questionToAnswer}
        onClose={() => setQuestionToAnswer(null)}
        onSubmit={({ questionId, answer }) => answerMutation.mutate({ questionId, answer })}
        loading={answerMutation.isLoading}
      />
    </>
  );
}


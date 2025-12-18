import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Section from "~/src/components/ui/Section";
import Grid from "~/src/components/ui/Grid";
import { perguntasService } from "~/features/perguntas/service";
import type {
  QuestionsFilters,
  QuestionsFiltersState,
  QuestionsInsights,
} from "~/features/perguntas/typings";
import { QuestionsFilters as QuestionsFiltersBar } from "~/features/perguntas/components/QuestionsFilters";
import { QuestionsMetrics } from "~/features/perguntas/components/QuestionsMetrics";
import { QuestionsList } from "~/features/perguntas/components/QuestionsList";

const DEFAULT_FILTERS: QuestionsFiltersState = {
  status: "",
  item_id: "",
  text: "",
  answered: "all",
  date_from: undefined,
  date_to: undefined,
  page: 1,
  per_page: 10,
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
  const [appliedFilters, setAppliedFilters] = useState<QuestionsFiltersState>(DEFAULT_FILTERS);
  const queryClient = useQueryClient();

  const apiFilters = useMemo(() => mapToApiFilters(appliedFilters), [appliedFilters]);

  const questionsQuery = useQuery({
    queryKey: ["questions", apiFilters],
    queryFn: () => perguntasService.list(apiFilters),
  });

  const metricsQuery = useQuery({
    queryKey: ["questions_metrics"],
    queryFn: () => perguntasService.getMetrics(),
    staleTime: 1000 * 60 * 5,
  });

  const insights: QuestionsInsights | undefined =
    (questionsQuery.data?.success ? questionsQuery.data.data.insights : undefined) ??
    (metricsQuery.data?.success ? metricsQuery.data.data.insights : undefined);

  const questions = useMemo(() => {
    if (!questionsQuery.data?.success) return [];
    const qs = questionsQuery.data.data.questions;
    return Array.isArray(qs) ? qs : [];
  }, [questionsQuery.data]);

  const pagination = questionsQuery.data?.success ? questionsQuery.data.data.pagination : undefined;

  const answerMutation = useMutation({
    mutationFn: ({ questionId, answer }: { questionId: string; answer: string }) =>
      perguntasService.answer(questionId, answer),
    onSuccess: async (response) => {
      if (!response.success) {
        toast.error(response.message || "Não foi possível enviar a resposta.");
        throw new Error(response.message || "Erro ao enviar resposta");
      }
      toast.success("Resposta enviada com sucesso.");
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["questions_metrics"] });
      await questionsQuery.refetch();
      await metricsQuery.refetch();
    },
    onError: () => {
      toast.error("Erro ao enviar a resposta. Tente novamente.");
    },
  });

  async function handleAnswer(questionId: string, answer: string) {
    await answerMutation.mutateAsync({ questionId, answer });
  }

  function handleFiltersChange(next: QuestionsFiltersState) {
    setFilters(next);
  }

  function applyFilters() {
    setAppliedFilters({ ...filters, page: 1 });
    queryClient.invalidateQueries({ queryKey: ["questions"] });
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    queryClient.invalidateQueries({ queryKey: ["questions"] });
  }

  function handlePageChange(nextPage: number) {
    setFilters((prev) => ({ ...prev, page: nextPage }));
    setAppliedFilters((prev) => ({ ...prev, page: nextPage }));
  }

  return (
    <>
      <Grid cols={{ base: 1 }} gap={4} className="mb-4">
        <Section 
          title="Visão geral"
          actions={
            <span className="text-xs text-slate-500">
              Dados dos últimos 30 dias
            </span>
          }
        >
          <QuestionsMetrics
            insights={insights}
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
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-slate-500">
                {pagination ? `${pagination.total_count} encontradas` : "—"}
              </span>
              <span className="text-xs text-slate-400">
                Dados dos últimos 30 dias
              </span>
            </div>
          }
        >
          <QuestionsList
            questions={questions}
            pagination={pagination}
            loading={questionsQuery.isLoading}
            onPageChange={handlePageChange}
            onAnswer={handleAnswer}
          />
        </Section>
      </Grid>
    </>
  );
}


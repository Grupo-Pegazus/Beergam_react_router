import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router";
import { QuestionsFilters as QuestionsFiltersBar } from "~/features/perguntas/components/QuestionsFilters";
import { QuestionsList } from "~/features/perguntas/components/QuestionsList";
import { QuestionsMetrics } from "~/features/perguntas/components/QuestionsMetrics";
import { perguntasService } from "~/features/perguntas/service";
import type {
  QuestionsFilters,
  QuestionsFiltersState,
  QuestionsInsights,
} from "~/features/perguntas/typings";
import Grid from "~/src/components/ui/Grid";
import Section from "~/src/components/ui/Section";
import { usePageFromSearchParams } from "~/src/hooks/usePageFromSearchParams";
import { dateStringToISO } from "~/src/utils/date";

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

function mapToApiFilters(
  filters: QuestionsFiltersState
): Partial<QuestionsFilters> {
  return {
    status: filters.status || undefined,
    item_id: filters.item_id || undefined,
    text: filters.text || undefined,
    answered:
      filters.answered === "all"
        ? undefined
        : filters.answered === "answered"
          ? true
          : false,
    date_from: filters.date_from ? dateStringToISO(filters.date_from) : undefined,
    date_to: filters.date_to ? dateStringToISO(filters.date_to) : undefined,
    page: filters.page,
    per_page: filters.per_page,
    sort_by: filters.sort_by,
    sort_order: filters.sort_order,
  };
}

export default function PerguntasPage() {
  const [filters, setFilters] =
    useState<QuestionsFiltersState>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<QuestionsFiltersState>(DEFAULT_FILTERS);
  const queryClient = useQueryClient();
  const [, setSearchParams] = useSearchParams();
  const { page: pageFromUrl } = usePageFromSearchParams();

  const apiFilters = useMemo(() => {
    const base = mapToApiFilters(appliedFilters);
    return { ...base, page: pageFromUrl };
  }, [appliedFilters, pageFromUrl]);

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
    (questionsQuery.data?.success
      ? questionsQuery.data.data.insights
      : undefined) ??
    (metricsQuery.data?.success ? metricsQuery.data.data.insights : undefined);

  const questions = useMemo(() => {
    if (!questionsQuery.data?.success) return [];
    const qs = questionsQuery.data.data.questions;
    return Array.isArray(qs) ? qs : [];
  }, [questionsQuery.data]);

  const pagination = questionsQuery.data?.success
    ? questionsQuery.data.data.pagination
    : undefined;

  const answerMutation = useMutation({
    mutationFn: ({
      questionId,
      answer,
    }: {
      questionId: string;
      answer: string;
    }) => perguntasService.answer(questionId, answer),
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
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", "1");
        return next;
      },
      { replace: true }
    );
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
            <span className="text-xs text-beergam-typography-secondary">
              Dados dos últimos 30 dias
            </span>
          }
        >
          <QuestionsMetrics
            insights={insights}
            loading={questionsQuery.isLoading || metricsQuery.isLoading}
          />
        </Section>

        <Section title="Filtrar perguntas">
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
              <span className="text-xs text-beergam-typography-secondary">
                {pagination ? `${pagination.total_count} encontradas` : "—"}
              </span>
              <span className="text-xs text-beergam-typography-secondary">
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
            syncPageWithUrl
          />
        </Section>
      </Grid>
    </>
  );
}

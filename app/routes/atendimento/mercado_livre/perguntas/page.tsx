import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { QuestionsFilters as QuestionsFiltersBar } from "~/features/perguntas/components/QuestionsFilters";
import { QuestionsList } from "~/features/perguntas/components/QuestionsList";
import { QuestionsMetrics } from "~/features/perguntas/components/QuestionsMetrics";
import type {
  QuestionsFilters,
  QuestionsFiltersState,
  QuestionsInsights,
  QuestionsListApiResponse,
  QuestionsListResponse,
} from "~/features/perguntas/typings";
import Grid from "~/src/components/ui/Grid";
import Section from "~/src/components/ui/Section";
import mockQuestionsData from "~/src/temp/mock/mockQuestions.json";

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
    date_from: filters.date_from
      ? new Date(filters.date_from).toISOString()
      : undefined,
    date_to: filters.date_to
      ? new Date(filters.date_to).toISOString()
      : undefined,
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

  const apiFilters = useMemo(
    () => mapToApiFilters(appliedFilters),
    [appliedFilters]
  );

  // Função para simular a resposta da API usando o mock
  const getMockQuestions = async (): Promise<QuestionsListApiResponse> => {
    // Simula delay da API
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Aplica filtros básicos no mock
    let filteredQuestions = [...mockQuestionsData.questions];

    // Filtro por status
    if (apiFilters.status) {
      filteredQuestions = filteredQuestions.filter(
        (q) => q.status === apiFilters.status
      );
    }

    // Filtro por answered
    if (apiFilters.answered !== undefined) {
      filteredQuestions = filteredQuestions.filter((q) => {
        const isAnswered = q.answer !== null && q.answer !== undefined;
        return apiFilters.answered === isAnswered;
      });
    }

    // Filtro por texto
    if (apiFilters.text) {
      const searchText = apiFilters.text.toLowerCase();
      filteredQuestions = filteredQuestions.filter(
        (q) =>
          q.text.toLowerCase().includes(searchText) ||
          q.item_title?.toLowerCase().includes(searchText)
      );
    }

    // Filtro por item_id
    if (apiFilters.item_id) {
      filteredQuestions = filteredQuestions.filter(
        (q) => q.item_id === apiFilters.item_id
      );
    }

    // Ordenação
    const sortBy = apiFilters.sort_by || "date_created";
    const sortOrder = apiFilters.sort_order || "desc";
    filteredQuestions.sort((a, b) => {
      let aValue: string | number | undefined;
      let bValue: string | number | undefined;

      if (sortBy === "date_created") {
        aValue = a.date_created ? new Date(a.date_created).getTime() : 0;
        bValue = b.date_created ? new Date(b.date_created).getTime() : 0;
      } else {
        aValue = a[sortBy as keyof typeof a] as string | number | undefined;
        bValue = b[sortBy as keyof typeof b] as string | number | undefined;
      }

      if (aValue === undefined) aValue = 0;
      if (bValue === undefined) bValue = 0;

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Paginação
    const page = apiFilters.page || 1;
    const perPage = apiFilters.per_page || 10;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

    const response: QuestionsListResponse = {
      questions: paginatedQuestions,
      pagination: {
        page,
        per_page: perPage,
        total_count: filteredQuestions.length,
        total_pages: Math.ceil(filteredQuestions.length / perPage),
      },
      filters_applied: apiFilters,
      insights: mockQuestionsData.insights,
    };

    return {
      success: true,
      message: "Dados carregados com sucesso",
      data: response,
    };
  };

  const questionsQuery = useQuery({
    queryKey: ["questions", apiFilters],
    queryFn: getMockQuestions,
  });

  const metricsQuery = useQuery({
    queryKey: ["questions_metrics"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        success: true,
        message: "Métricas carregadas com sucesso",
        data: {
          metrics: {},
          needs_refresh: false,
          scheduled_refresh: false,
          insights: mockQuestionsData.insights,
        },
      };
    },
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
    mutationFn: async ({
      questionId,
      answer,
    }: {
      questionId: string;
      answer: string;
    }) => {
      // Simula delay da API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Simula resposta de sucesso
      return {
        success: true,
        message: "Resposta enviada com sucesso",
        data: { question_id: questionId, answer },
      };
    },
    onSuccess: async () => {
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
          />
        </Section>
      </Grid>
    </>
  );
}

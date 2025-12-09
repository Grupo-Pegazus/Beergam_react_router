import { useQuery } from "@tanstack/react-query";
import { perguntasService } from "../service";
import { QuestionsMetrics } from "./QuestionsMetrics";
import type { QuestionsInsights } from "../typings";

/**
 * Bloco compacto para o início, exibindo métricas de perguntas.
 * Mantém a consulta isolada para respeitar SRP e poder ser reutilizado.
 */
export default function QuestionsOverviewHome() {
  const { data, isLoading } = useQuery({
    queryKey: ["questions", "metrics", "home"],
    queryFn: () => perguntasService.getMetrics(),
    staleTime: 1000 * 60 * 5,
  });

  const insights: QuestionsInsights | undefined =
    data?.success && data.data ? data.data.insights : undefined;

  return (
    <QuestionsMetrics
      insights={insights}
      loading={isLoading}
    />
  );
}


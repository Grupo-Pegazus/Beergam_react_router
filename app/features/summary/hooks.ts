import { useQuery } from "@tanstack/react-query";
import { summaryService } from "./service";
import type { HomeSummaryFilters } from "./service";
import type { HomeSummary } from "./typings";
import type { ApiResponse } from "../apiClient/typings";

export function useHomeSummary(filters: HomeSummaryFilters) {
  const isCustomWithDates =
    filters.period !== "custom" ||
    (Boolean(filters.date_from) && Boolean(filters.date_to));

  return useQuery<ApiResponse<HomeSummary>>({
    queryKey: ["summary", "home", filters],
    enabled: isCustomWithDates,
    queryFn: async () => {
      const res = await summaryService.getHomeSummary(filters);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar resumo da home");
      }
      return res;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}


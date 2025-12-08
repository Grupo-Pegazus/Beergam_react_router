import { useQuery } from "@tanstack/react-query";
import { summaryService } from "./service";
import type { HomeSummary } from "./typings";
import type { ApiResponse } from "../apiClient/typings";

export function useHomeSummary(period: number = 1) {
  return useQuery<ApiResponse<HomeSummary>>({
    queryKey: ["summary", "home", period],
    queryFn: async () => {
      const res = await summaryService.getHomeSummary(period);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar resumo da home");
      }
      return res;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}


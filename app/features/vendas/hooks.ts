import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { vendasService } from "./service";
import type {
  OrdersFilters,
  OrdersMetrics,
  DailyRevenue,
  GeographicDistribution,
  TopCategories,
} from "./typings";
import type { ApiResponse } from "../apiClient/typings";

export function useOrders(filters?: Partial<OrdersFilters>) {
  return useQuery<ApiResponse<import("./typings").OrdersResponse>>({
    queryKey: ["orders", filters],
    queryFn: async () => {
      const res = await vendasService.getOrders(filters);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar pedidos");
      }
      return res;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useOrdersMetrics() {
  return useQuery<ApiResponse<OrdersMetrics>>({
    queryKey: ["orders", "metrics"],
    queryFn: async () => {
      const res = await vendasService.getOrdersMetrics();
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar métricas");
      }
      return res;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useDailyRevenue(params?: {
  days?: number;
  date_from?: string;
  date_to?: string;
}) {
  return useQuery<ApiResponse<DailyRevenue>>({
    queryKey: ["orders", "daily-revenue", params],
    queryFn: async () => {
      const res = await vendasService.getDailyRevenue(params);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar faturamento diário");
      }
      return res;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useGeographicDistribution(params?: {
  period?: "last_day" | "last_7_days" | "last_30_days" | "custom";
  date_from?: string;
  date_to?: string;
}) {
  // Se o período for "custom", só faz a requisição se ambas as datas estiverem preenchidas
  const isEnabled = useMemo(() => {
    if (params?.period === "custom") {
      return !!(params.date_from && params.date_to);
    }
    return true;
  }, [params?.period, params?.date_from, params?.date_to]);

  return useQuery<ApiResponse<GeographicDistribution>>({
    queryKey: ["orders", "geographic-distribution", params],
    queryFn: async () => {
      const res = await vendasService.getGeographicDistribution(params);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar distribuição geográfica");
      }
      return res;
    },
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useTopCategories(params?: {
  limit?: number;
  date_from?: string;
  date_to?: string;
}) {
  return useQuery<ApiResponse<TopCategories>>({
    queryKey: ["orders", "top-categories", params],
    queryFn: async () => {
      const res = await vendasService.getTopCategories(params);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar categorias mais vendidas");
      }
      return res;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export { useVendasFilters } from "./hooks/useVendasFilters";


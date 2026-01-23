import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import type { ApiResponse } from "../apiClient/typings";
import { vendasService } from "./service";
import type {
  DailyRevenue,
  GeographicDistribution,
  Order,
  OrderDetailsResponse,
  OrdersFilters,
  OrdersMetrics,
  OrdersResponse,
  TopCategories,
} from "./typings";

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

export function useOrdersWithPagination(defaultFilters?: Partial<OrdersFilters>) {
  return useMutation<ApiResponse<OrdersResponse>, Error, Partial<OrdersFilters> | undefined>({
    mutationFn: async (overrideFilters) => {
      // Combina os filtros default com os passados no mutate()
      const combinedFilters = { ...defaultFilters, ...overrideFilters };
      const res = await vendasService.getOrders(combinedFilters);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar pedidos");
      }
      return res;
    },
  });
}

/**
 * Hook para buscar pedidos com "Load More" (carregar mais)
 * - useQuery carrega a página 1 automaticamente
 * - loadMore() carrega páginas adicionais e acumula os dados
 */
export function useOrdersWithLoadMore(baseFilters?: Omit<Partial<OrdersFilters>, 'page'>) {
  // Estado para acumular pedidos de todas as páginas
  const [accumulatedOrders, setAccumulatedOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Query para a primeira página (carrega automaticamente)
  const initialQuery = useQuery<ApiResponse<OrdersResponse>>({
    queryKey: ["orders", "loadMore", { ...baseFilters, page: 1 }],
    queryFn: async () => {
      const res = await vendasService.getOrders({ ...baseFilters, page: 1 });
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar pedidos");
      }
      return res;
    },
    staleTime: 1000 * 60 * 5,
  });
  
  // Mutation para carregar páginas adicionais
  const loadMoreMutation = useMutation<ApiResponse<OrdersResponse>, Error, number>({
    mutationFn: async (page: number) => {
      const res = await vendasService.getOrders({ ...baseFilters, page });
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar pedidos");
      }
      return res;
    },
    onSuccess: (data) => {
      if (data.data?.orders) {
        setAccumulatedOrders(prev => [...prev, ...data.data!.orders]);
      }
    },
  });
  
  // Combina os pedidos da primeira página + acumulados
  const allOrders = useMemo(() => {
    const firstPageOrders = initialQuery.data?.data?.orders ?? [];
    return [...firstPageOrders, ...accumulatedOrders];
  }, [initialQuery.data?.data?.orders, accumulatedOrders]);
  
  // Paginação atual (usa a do mutation se disponível, senão a do query inicial)
  const pagination = useMemo(() => {
    return loadMoreMutation.data?.data?.pagination ?? initialQuery.data?.data?.pagination ?? {
      page: 1,
      per_page: 100,
      total_count: 0,
      total_pages: 0,
      has_next: false,
      has_prev: false,
    };
  }, [loadMoreMutation.data?.data?.pagination, initialQuery.data?.data?.pagination]);
  
  // Função para carregar mais
  const loadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadMoreMutation.mutate(nextPage);
  }, [currentPage, loadMoreMutation]);
  
  // Reset para voltar à página 1
  const reset = useCallback(() => {
    setAccumulatedOrders([]);
    setCurrentPage(1);
  }, []);
  
  return {
    // Dados
    orders: allOrders,
    pagination,
    
    // Estados
    isLoading: initialQuery.isLoading,
    isLoadingMore: loadMoreMutation.isPending,
    error: initialQuery.error || loadMoreMutation.error,
    
    // Ações
    loadMore,
    reset,
    
    // Info
    currentPage,
    hasMore: pagination.has_next,
  };
}

export function useOrdersMetrics(period?: 0 | 1 | 7 | 15 | 30 | 90) {
  const periodParam = useMemo(() => {
    // Converte o número para o formato esperado pelo backend
    if (period === 0) return "today";
    if (period === 1) return "yesterday";
    if (period === 7) return "7d";
    if (period === 15) return "15d";
    if (period === 30) return "30d";
    if (period === 90) return "90d";
    return undefined;
  }, [period]);

  return useQuery<ApiResponse<OrdersMetrics>>({
    queryKey: ["orders", "metrics", periodParam],
    queryFn: async () => {
      const res = await vendasService.getOrdersMetrics(periodParam);
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
  period?: "last_day" | "last_7_days" | "last_15_days" | "last_30_days" | "custom";
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

export function useOrderDetails(orderIdOrPackId: string) {
  return useQuery<ApiResponse<OrderDetailsResponse>>({
    queryKey: ["orders", "details", orderIdOrPackId],
    queryFn: async () => {
      const res = await vendasService.getOrderDetails(orderIdOrPackId);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar detalhes do pedido");
      }
      return res;
    },
    enabled: !!orderIdOrPackId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export { useVendasFilters } from "./hooks/useVendasFilters";


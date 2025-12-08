import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { anuncioService } from "./service";
import type { AdsFilters, ChangeAdStatusRequest, AdsResponse, WithoutSkuResponse, UpdateSkuRequest, AnuncioDetails } from "./typings";
import type { ApiResponse } from "../apiClient/typings";
import type { AdsMetrics, TopSoldAd } from "./service";
import type { DailyRevenue } from "../vendas/typings";

import toast from "~/src/utils/toast";

export function useAnuncios(filters?: Partial<AdsFilters>) {
  return useQuery<ApiResponse<AdsResponse>>({
    queryKey: ["anuncios", filters],
    queryFn: async () => {
      const res = await anuncioService.getAnuncios(filters);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar anúncios");
      }
      return res;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useAdsMetrics() {
  return useQuery<ApiResponse<AdsMetrics>>({
    queryKey: ["anuncios", "metrics"],
    queryFn: async () => {
      const res = await anuncioService.getAdsMetrics();
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar métricas");
      }
      return res;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useTopSoldAds(params?: { limit?: number; sort_by?: string; sort_order?: "asc" | "desc" }) {
  return useQuery<ApiResponse<{ ads: TopSoldAd[] }>>({
    queryKey: ["anuncios", "top-sold", params],
    queryFn: async () => {
      const res = await anuncioService.getTopSoldAds(params);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar top anúncios");
      }
      return res;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useChangeAdStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      adId,
      status,
    }: {
      adId: string;
      status: ChangeAdStatusRequest["status"];
    }) => {
      const res = await anuncioService.changeAdStatus(adId, status);
      if (!res.success) {
        throw new Error(res.message || "Erro ao alterar status do anúncio");
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anuncios"] });
      toast.success("Status do anúncio alterado com sucesso");
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Erro ao alterar status do anúncio";
      toast.error(message);
    },
  });
}

export function useAdsWithoutSku() {
  return useQuery<ApiResponse<WithoutSkuResponse>>({
    queryKey: ["anuncios", "without-sku"],
    queryFn: async () => {
      const res = await anuncioService.getAdsWithoutSku();
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar anúncios sem SKU");
      }
      return res;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useUpdateSku() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: UpdateSkuRequest) => {
      const res = await anuncioService.updateSku(request);
      if (!res.success) {
        throw new Error(res.message || "Erro ao atualizar SKU");
      }
      return res;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["anuncios", "without-sku"] });
      queryClient.invalidateQueries({ queryKey: ["anuncios"] });
      // Invalida também a query de detalhes do anúncio específico
      queryClient.invalidateQueries({ queryKey: ["anuncios", "details", variables.ad_id] });
      toast.success("SKU atualizado com sucesso");
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Erro ao atualizar SKU";
      toast.error(message);
    },
  });
}

export function useUpdateSkuWithMlb() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (adIds: string[]) => {
      const res = await anuncioService.updateSkuWithMlb(adIds);
      if (!res.success) {
        throw new Error(res.message || "Erro ao atualizar SKU com MLB");
      }
      return res;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["anuncios", "without-sku"] });
      queryClient.invalidateQueries({ queryKey: ["anuncios"] });
      
      // Invalida queries de detalhes para os anúncios atualizados
      response.data?.updated.forEach((adId) => {
        queryClient.invalidateQueries({ queryKey: ["anuncios", "details", adId] });
      });

      const message = response.data?.message || "SKU atualizado com sucesso";
      toast.success(message);
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Erro ao atualizar SKU com MLB";
      toast.error(message);
    },
  });
}

export function useAnuncioDetails(anuncioId: string) {
  return useQuery<ApiResponse<AnuncioDetails>>({
    queryKey: ["anuncios", "details", anuncioId],
    queryFn: async () => {
      const res = await anuncioService.getAnuncioDetails(anuncioId);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar detalhes do anúncio");
      }
      return res;
    },
    enabled: !!anuncioId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useAdOrdersChart(
  anuncioId: string,
  params?: {
    days?: number;
    date_from?: string;
    date_to?: string;
  }
) {
  return useQuery<ApiResponse<DailyRevenue>>({
    queryKey: ["anuncios", "orders-chart", anuncioId, params],
    queryFn: async () => {
      const res = await anuncioService.getAdOrdersChart(anuncioId, params);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar dados de vendas do anúncio");
      }
      return res;
    },
    enabled: !!anuncioId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export { useAnunciosFilters } from "./hooks/useAnunciosFilters";

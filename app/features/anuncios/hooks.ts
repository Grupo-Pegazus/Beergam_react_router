import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { anuncioService } from "./service";
import type { AdsFilters, ChangeAdStatusRequest, AdsResponse, WithoutSkuResponse, UpdateSkuRequest } from "./typings";
import type { ApiResponse } from "../apiClient/typings";
import type { AdsMetrics, TopSoldAd } from "./service";

import toast from "react-hot-toast";

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anuncios", "without-sku"] });
      queryClient.invalidateQueries({ queryKey: ["anuncios"] });
      toast.success("SKU atualizado com sucesso");
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Erro ao atualizar SKU";
      toast.error(message);
    },
  });
}

export { useAnunciosFilters } from "./hooks/useAnunciosFilters";

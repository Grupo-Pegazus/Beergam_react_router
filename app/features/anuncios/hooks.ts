import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { anuncioService } from "./service";
import type {
  AdsFilters,
  ChangeAdStatusRequest,
  AdsResponse,
  WithoutSkuResponse,
  UpdateSkuRequest,
  AnuncioDetails,
  Anuncio,
  ReprocessAdsResponse,
  ReprocessQuota,
} from "./typings";
import type { ApiResponse } from "../apiClient/typings";
import type { AdsMetrics, TopSoldAd } from "./service";
import type { DailyRevenue } from "../vendas/typings";

import toast from "~/src/utils/toast";
import { useAdsSelectionStore } from "./selectionStore";

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

export type BulkAction = "pause" | "activate" | "close";

function mapBulkActionToStatus(action: BulkAction): ChangeAdStatusRequest["status"] {
  if (action === "pause") return "paused";
  if (action === "activate") return "active";
  if (action === "close") return "closed";
  return "paused"; // default
}

export function useBulkChangeAdsStatus() {
  const selection = useAdsSelectionStore();
  const reset = useAdsSelectionStore((state) => state.reset);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (action: BulkAction) => {
      const status = mapBulkActionToStatus(action);

      if (selection.mode === "manual") {
        const ids = Array.from(selection.selectedIds);
        if (ids.length === 0) return undefined;

        return anuncioService.bulkChangeStatus({
          mode: "ids",
          status,
          ids,
        });
      }

      if (selection.mode === "allFiltered" && selection.baseFilter) {
        return anuncioService.bulkChangeStatus({
          mode: "filters",
          status,
          filters: {
            ...selection.baseFilter,
            page: undefined,
            per_page: undefined,
          },
          exclude_ids: Array.from(selection.excludedIdsFromAll),
        });
      }

      return undefined;
    },
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["anuncios"] });
      toast.success("Ação em massa aplicada com sucesso.");
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Erro ao aplicar ação em massa.";
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
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", "details"] });
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

      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", "details"] });

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

export function useAdsReprocessQuota() {
  return useQuery<ApiResponse<ReprocessQuota>>({
    queryKey: ["anuncios", "reprocess", "quota"],
    queryFn: async () => {
      const res = await anuncioService.getReprocessQuota();
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar cota de reprocessamento de anúncios");
      }
      return res;
    },
    staleTime: 1000 * 30, // 30s (cota muda após reprocessar)
  });
}

export function useReprocessAds() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (adIds: string[]) => {
      const res = await anuncioService.reprocessAds(adIds);
      if (!res.success) {
        throw new Error(res.message || "Erro ao reprocessar anúncios");
      }
      return res as ApiResponse<ReprocessAdsResponse>;
    },
    onSuccess: (res, variables) => {
      // Atualiza listas/detalhes
      queryClient.invalidateQueries({ queryKey: ["anuncios"] });
      variables.forEach((adId) => {
        queryClient.invalidateQueries({ queryKey: ["anuncios", "details", adId] });
      });
      queryClient.invalidateQueries({ queryKey: ["anuncios", "reprocess", "quota"] });

      const total = res.data?.total_reprocessed ?? 0;
      toast.success(`Reprocessamento concluído (${total} reprocessado(s)).`);
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Erro ao reprocessar anúncios";
      toast.error(message);
    },
  });
}

export function useRelistAd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { anuncioId: string; payload?: Record<string, unknown> }) => {
      const res = await anuncioService.relistAd(variables);
      if (!res.success) {
        throw new Error(res.message || "Erro ao republicar anúncio");
      }
      return res;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["anuncios"] });
      const apiMessage = res.message?.trim();
      const fallback = "Anúncio republicado com sucesso. O processamento pode levar alguns instantes.";
      toast.success(apiMessage || fallback);
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Erro ao republicar anúncio";
      toast.error(message);
    },
  });
}

export function useReprocessAllAds() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await anuncioService.reprocessAllAds();
      if (!res.success) {
        throw new Error(res.message || "Erro ao reprocessar todos os anúncios");
      }
      return res as ApiResponse<ReprocessAdsResponse>;
    },
    onSuccess: (res) => {
      // Atualiza todas as queries relacionadas a anúncios
      queryClient.invalidateQueries({ queryKey: ["anuncios"] });
      queryClient.invalidateQueries({ queryKey: ["anuncios", "reprocess", "quota"] });

      const apiMessage = res?.message?.trim();
      const fallbackMessage = `Reprocessamento iniciado.`;
      toast.success(apiMessage || fallbackMessage);
    },
    onError: (error: unknown) => {
      const apiMessage = error instanceof Error ? error.message?.trim() : undefined;
      const fallbackMessage = "Erro ao reprocessar todos os anúncios";
      toast.error(apiMessage || fallbackMessage);
    },
  });
}

export { useAnunciosFilters } from "./hooks/useAnunciosFilters";

export function getProblematicCatalogAds(selectedAds: Anuncio[]): Anuncio[] {
  return selectedAds.filter((catalogAd) => {
    if (!catalogAd.is_catalog) return false;

    const hasTraditionalInSelection = selectedAds.some(
      (other) =>
        !other.is_catalog &&
        other.catalog_product_id &&
        other.catalog_product_id === catalogAd.catalog_product_id,
    );

    return !hasTraditionalInSelection;
  });
}

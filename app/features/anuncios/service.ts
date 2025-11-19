import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type { AdsResponse, AdsFilters, ChangeAdStatusRequest, WithoutSkuResponse, UpdateSkuRequest, AnuncioDetails } from "./typings";
import type { DailyRevenue } from "../vendas/typings";

// Tipos para os novos endpoints
export interface AdsMetrics {
  total_categorias: number;
  total_anuncios: number;
  anuncios_estoque_baixo: number;
  anuncios_a_melhorar: number;
  anuncios_ativos?: number;
  anuncios_pausados?: number;
}

export interface TopSoldAd {
  mlb: string;
  name: string;
  price: string;
  sold_quantity: number;
  thumbnail: string;
  stock: number;
  geral_visits: number;
}

class AnuncioService {
  async getAnuncios(filters?: Partial<AdsFilters>): Promise<ApiResponse<AdsResponse>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
    }
    
    const queryString = params.toString();
    const url = `/v1/ads${queryString ? `?${queryString}` : ""}`;
    
    const response = await typedApiClient.get<AdsResponse>(url);
    return response as ApiResponse<AdsResponse>;
  }

  async getAnuncioDetails(anuncioId: string): Promise<ApiResponse<AnuncioDetails>> {
    const response = await typedApiClient.get<AnuncioDetails>(`/v1/ads/${anuncioId}/details`);
    return response as ApiResponse<AnuncioDetails>;
  }

  async getAdsMetrics(): Promise<ApiResponse<AdsMetrics>> {
    const response = await typedApiClient.get<AdsMetrics>("/v1/ads/metrics");
    return response as ApiResponse<AdsMetrics>;
  }

  async getTopSoldAds(params?: { limit?: number; sort_by?: string; sort_order?: "asc" | "desc" }): Promise<ApiResponse<{ ads: TopSoldAd[] }>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params?.sort_order) queryParams.append("sort_order", params.sort_order);
    
    const queryString = queryParams.toString();
    const url = `/v1/ads/top-sold${queryString ? `?${queryString}` : ""}`;
    
    const response = await typedApiClient.get<{ ads: TopSoldAd[] }>(url);
    return response as ApiResponse<{ ads: TopSoldAd[] }>;
  }

  async changeAdStatus(
    adId: string,
    status: ChangeAdStatusRequest["status"]
  ): Promise<ApiResponse<{ success: boolean; message?: string }>> {
    const response = await typedApiClient.post<{ success: boolean; message?: string }>(
      `/v1/ads/${adId}/status/change`,
      { status }
    );
    return response as ApiResponse<{ success: boolean; message?: string }>;
  }

  async getAdsWithoutSku(): Promise<ApiResponse<WithoutSkuResponse>> {
    const response = await typedApiClient.get<WithoutSkuResponse>("/v1/ads/without-sku");
    return response as ApiResponse<WithoutSkuResponse>;
  }

  async updateSku(request: UpdateSkuRequest): Promise<ApiResponse<{ success: boolean; message?: string }>> {
    const response = await typedApiClient.post<{ success: boolean; message?: string }>(
      "/v1/ads/update-sku",
      request
    );
    return response as ApiResponse<{ success: boolean; message?: string }>;
  }

  async getAdOrdersChart(
    anuncioId: string,
    params?: {
      days?: number;
      date_from?: string;
      date_to?: string;
    }
  ): Promise<ApiResponse<DailyRevenue>> {
    const queryParams = new URLSearchParams();
    if (params?.days) queryParams.append("days", String(params.days));
    if (params?.date_from) queryParams.append("date_from", params.date_from);
    if (params?.date_to) queryParams.append("date_to", params.date_to);

    const queryString = queryParams.toString();
    const url = `/v1/ads/${anuncioId}/orders-chart${queryString ? `?${queryString}` : ""}`;

    const response = await typedApiClient.get<DailyRevenue>(url);
    return response as ApiResponse<DailyRevenue>;
  }
}

export const anuncioService = new AnuncioService();

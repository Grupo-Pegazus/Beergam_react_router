import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type { AdsResponse, AdsFilters, ChangeAdStatusRequest } from "./typings";

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
}

export const anuncioService = new AnuncioService();

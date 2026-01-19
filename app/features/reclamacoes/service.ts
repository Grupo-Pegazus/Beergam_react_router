import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type {
  Claim,
  ClaimsFilters,
  ClaimsListApiResponse,
  ClaimsListResponse,
  ClaimsMetricsApiResponse,
  ClaimsMetricsResponse,
} from "./typings";

class ReclamacoesService {
  private buildQuery(filters?: Partial<ClaimsFilters>): string {
    if (!filters) return "";

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      params.append(key, String(value));
    });

    return params.toString();
  }

  async list(filters?: Partial<ClaimsFilters>): Promise<ClaimsListApiResponse> {
    const queryString = this.buildQuery(filters);
    const url = `/v1/claims${queryString ? `?${queryString}` : ""}`;
    const response = await typedApiClient.get<ClaimsListResponse>(url);
    return response as ClaimsListApiResponse;
  }

  async get(claimId: string): Promise<ApiResponse<Claim>> {
    const response = await typedApiClient.get<Claim>(`/v1/claims/${claimId}`);
    return response as ApiResponse<Claim>;
  }

  async getMetrics(): Promise<ClaimsMetricsApiResponse> {
    const response = await typedApiClient.get<ClaimsMetricsResponse>("/v1/claims/metrics");
    return response as ClaimsMetricsApiResponse;
  }
}

export const reclamacoesService = new ReclamacoesService();

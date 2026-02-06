import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type {
  OrdersResponse,
  OrdersFilters,
  OrdersMetrics,
  DailyRevenue,
  GeographicDistribution,
  TopCategories,
  OrderDetailsResponse,
  ReprocessOrdersResponse,
  ReprocessQuota,
  ReprocessOrdersInternalResponse,
} from "./typings";

class VendasService {
  async getOrders(filters?: Partial<OrdersFilters>): Promise<ApiResponse<OrdersResponse>> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            params.append(key, value.join(","));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    const queryString = params.toString();
    const url = `/v1/orders${queryString ? `?${queryString}` : ""}`;

    const response = await typedApiClient.get<OrdersResponse>(url);
    return response as ApiResponse<OrdersResponse>;
  }

  async getOrdersMetrics(period?: string): Promise<ApiResponse<OrdersMetrics>> {
    const queryParams = new URLSearchParams();
    if (period) queryParams.append("period", period);

    const queryString = queryParams.toString();
    const url = `/v1/orders/metrics${queryString ? `?${queryString}` : ""}`;

    const response = await typedApiClient.get<OrdersMetrics>(url);
    return response as ApiResponse<OrdersMetrics>;
  }

  async getDailyRevenue(params?: {
    days?: number;
    date_from?: string;
    date_to?: string;
  }): Promise<ApiResponse<DailyRevenue>> {
    const queryParams = new URLSearchParams();
    if (params?.days) queryParams.append("days", String(params.days));
    if (params?.date_from) queryParams.append("date_from", params.date_from);
    if (params?.date_to) queryParams.append("date_to", params.date_to);

    const queryString = queryParams.toString();
    const url = `/v1/orders/daily-revenue${queryString ? `?${queryString}` : ""}`;

    const response = await typedApiClient.get<DailyRevenue>(url);
    return response as ApiResponse<DailyRevenue>;
  }

  async getGeographicDistribution(params?: {
    period?: "last_day" | "last_7_days" | "last_15_days" | "last_30_days" | "last_90_days" | "custom";
    date_from?: string;
    date_to?: string;
  }): Promise<ApiResponse<GeographicDistribution>> {
    const queryParams = new URLSearchParams();
    if (params?.period) queryParams.append("period", params.period);
    if (params?.date_from) queryParams.append("date_from", params.date_from);
    if (params?.date_to) queryParams.append("date_to", params.date_to);

    const queryString = queryParams.toString();
    const url = `/v1/orders/geographic-distribution${queryString ? `?${queryString}` : ""}`;

    const response = await typedApiClient.get<GeographicDistribution>(url);
    return response as ApiResponse<GeographicDistribution>;
  }

  async getTopCategories(params?: {
    limit?: number;
    date_from?: string;
    date_to?: string;
  }): Promise<ApiResponse<TopCategories>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.date_from) queryParams.append("date_from", params.date_from);
    if (params?.date_to) queryParams.append("date_to", params.date_to);

    const queryString = queryParams.toString();
    const url = `/v1/orders/top-categories${queryString ? `?${queryString}` : ""}`;

    const response = await typedApiClient.get<TopCategories>(url);
    return response as ApiResponse<TopCategories>;
  }

  async getOrderDetails(orderIdOrPackId: string): Promise<ApiResponse<OrderDetailsResponse>> {
    const response = await typedApiClient.get<OrderDetailsResponse>(`/v1/orders/${orderIdOrPackId}`);
    return response as ApiResponse<OrderDetailsResponse>;
  }

  async getReprocessQuota(): Promise<ApiResponse<ReprocessQuota>> {
    const response = await typedApiClient.get<ReprocessQuota>("/v1/orders/reprocess/quota");
    return response as ApiResponse<ReprocessQuota>;
  }

  async reprocessOrders(orderIds: string[]): Promise<ApiResponse<ReprocessOrdersResponse>> {
    const response = await typedApiClient.post<ReprocessOrdersResponse>("/v1/orders/reprocess", {
      order_ids: orderIds,
    });
    return response as ApiResponse<ReprocessOrdersResponse>;
  }

  async reprocessOrdersByPeriod(params: {
    date_from: string;
    date_to: string;
  }): Promise<ApiResponse<ReprocessOrdersInternalResponse>> {
    const response = await typedApiClient.post<ReprocessOrdersInternalResponse>(
      "/v1/orders/reprocess-internal",
      params,
    );
    return response as ApiResponse<ReprocessOrdersInternalResponse>;
  }
}

export const vendasService = new VendasService();
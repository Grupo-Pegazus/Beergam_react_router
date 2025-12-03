import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type {
  SchedulingsResponse,
  SchedulingResponse,
  SchedulingFilters,
  CreateScheduling,
  UpdateScheduling,
  CancelScheduling,
  ReceiveScheduling,
  SchedulingLogsResponse,
} from "./typings";

class AgendamentosService {
  async getSchedulings(
    filters?: Partial<SchedulingFilters>
  ): Promise<ApiResponse<SchedulingsResponse>> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const url = `/v1/scheduling${queryString ? `?${queryString}` : ""}`;

    const response = await typedApiClient.get<SchedulingsResponse>(url);
    return response as ApiResponse<SchedulingsResponse>;
  }

  async getScheduling(id: string): Promise<ApiResponse<SchedulingResponse>> {
    const response = await typedApiClient.get<SchedulingResponse>(
      `/v1/scheduling/${id}`
    );
    return response as ApiResponse<SchedulingResponse>;
  }

  async createScheduling(
    data: CreateScheduling
  ): Promise<ApiResponse<SchedulingResponse>> {
    const response = await typedApiClient.post<SchedulingResponse>(
      "/v1/scheduling",
      data
    );
    return response as ApiResponse<SchedulingResponse>;
  }

  async updateScheduling(
    id: string,
    data: UpdateScheduling
  ): Promise<ApiResponse<SchedulingResponse>> {
    const response = await typedApiClient.put<SchedulingResponse>(
      `/v1/scheduling/${id}`,
      data
    );
    return response as ApiResponse<SchedulingResponse>;
  }

  async deleteScheduling(
    id: string
  ): Promise<ApiResponse<{ success: boolean; message: string; id: string }>> {
    const response = await typedApiClient.delete<{
      success: boolean;
      message: string;
      id: string;
    }>(`/v1/scheduling/${id}`);
    return response as ApiResponse<{ success: boolean; message: string; id: string }>;
  }

  async cancelScheduling(
    id: string,
    data: CancelScheduling
  ): Promise<ApiResponse<SchedulingResponse>> {
    const response = await typedApiClient.post<SchedulingResponse>(
      `/v1/scheduling/${id}/cancel`,
      data
    );
    return response as ApiResponse<SchedulingResponse>;
  }

  async getSchedulingLogs(
    id: string
  ): Promise<ApiResponse<SchedulingLogsResponse>> {
    const response = await typedApiClient.get<{ logs: SchedulingLogsResponse["logs"]; total: number }>(
      `/v1/scheduling/${id}/logs`
    );
    return response as ApiResponse<SchedulingLogsResponse>;
  }

  async receiveScheduling(
    id: string,
    data: ReceiveScheduling
  ): Promise<ApiResponse<SchedulingResponse & { message: string; items_processed: unknown[]; items_ignored_cancelled: unknown[]; items_ignored_already_processed: unknown[]; sync_errors: unknown[]; has_sync_errors: boolean }>> {
    const response = await typedApiClient.post<
      SchedulingResponse & {
        message: string;
        items_processed: unknown[];
        items_ignored_cancelled: unknown[];
        items_ignored_already_processed: unknown[];
        sync_errors: unknown[];
        has_sync_errors: boolean;
      }
    >(`/v1/scheduling/${id}/receive`, data);
    return response as ApiResponse<
      SchedulingResponse & {
        message: string;
        items_processed: unknown[];
        items_ignored_cancelled: unknown[];
        items_ignored_already_processed: unknown[];
        sync_errors: unknown[];
        has_sync_errors: boolean;
      }
    >;
  }
}

export const agendamentosService = new AgendamentosService();


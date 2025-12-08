import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type { HomeSummary } from "./typings";

class SummaryService {
  async getHomeSummary(period: number = 1): Promise<ApiResponse<HomeSummary>> {
    const url = `/v1/summary/home?period=${period}`;
    const response = await typedApiClient.get<HomeSummary>(url);
    return response as ApiResponse<HomeSummary>;
  }
}

export const summaryService = new SummaryService();


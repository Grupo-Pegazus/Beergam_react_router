import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type { FlexCutoff } from "./typings";
import { FlexCutoffSchema } from "./typings";
import type { HomeSummary } from "./typings";

export interface HomeSummaryFilters {
  period: number | "custom";
  date_from?: string;
  date_to?: string;
}

class SummaryService {
  async getHomeSummary(
    filters: HomeSummaryFilters
  ): Promise<ApiResponse<HomeSummary>> {
    const params = new URLSearchParams();
    params.set("period", String(filters.period));

    if (filters.period === "custom" && filters.date_from && filters.date_to) {
      params.set("date_from", filters.date_from);
      params.set("date_to", filters.date_to);
    }

    const url = `/v1/summary/home?${params.toString()}`;
    const response = await typedApiClient.get<HomeSummary>(url);
    return response as ApiResponse<HomeSummary>;
  }

  async getFlexCutoff(): Promise<ApiResponse<FlexCutoff>> {
    const response = await typedApiClient.get<unknown>("/v1/summary/flex-cutoff");

    if (!response.success || !response.data) {
      return {
        ...response,
        data: {
          has_flex: false,
          week: [],
          saturday: [],
          sunday: [],
        },
      };
    }

    const parsed = FlexCutoffSchema.safeParse(response.data);
    if (!parsed.success) {
      return {
        success: false,
        data: {
          has_flex: false,
          week: [],
          saturday: [],
          sunday: [],
        },
        message: "Formato inesperado do horário de corte Flex",
        error_code: 500,
        error_fields: {},
      };
    }

    return { ...response, data: parsed.data };
  }
}

export const summaryService = new SummaryService();


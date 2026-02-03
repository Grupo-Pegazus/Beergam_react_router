import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type { FlexCutoff } from "./typings";
import { FlexCutoffSchema } from "./typings";
import type { HomeSummary } from "./typings";

class SummaryService {
  async getHomeSummary(period: number = 1): Promise<ApiResponse<HomeSummary>> {
    const url = `/v1/summary/home?period=${period}`;
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


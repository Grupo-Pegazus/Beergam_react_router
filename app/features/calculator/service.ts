import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type {
  CalculatorRequest,
  CalculatorResponse,
} from "./typings";

class CalculatorService {
  async calculateFullListing(
    data: CalculatorRequest
  ): Promise<ApiResponse<CalculatorResponse>> {
    const response = await typedApiClient.post<CalculatorResponse>(
      "/v1/calculator/calculate_full_listing",
      data
    );
    return response as ApiResponse<CalculatorResponse>;
  }
}

export const calculatorService = new CalculatorService();


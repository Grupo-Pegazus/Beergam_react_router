import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";

class VendasService {
    async getVendas(): Promise<ApiResponse<unknown>> {
        const response = await typedApiClient.get<unknown>("/v1/orders");
        return response as ApiResponse<unknown>;
    }
}

export const vendasService = new VendasService();
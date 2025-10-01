import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type { BaseMarketPlace } from "./typings";

class MarketplaceService {
  async getMarketplacesAccounts(): Promise<ApiResponse<BaseMarketPlace[]>> {
    try {
      const response =
        await typedApiClient.get<BaseMarketPlace[]>("/v1/accounts");
      return response;
    } catch (error) {
      console.error("error do getMarketplacesAccounts", error);
      return {
        success: false,
        data: [] as BaseMarketPlace[],
        message:
          "Erro ao buscar contas de marketplace. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }
}

export const marketplaceService = new MarketplaceService();

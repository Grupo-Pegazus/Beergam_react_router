import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type { BaseMarketPlace, IntegrationData } from "./typings";
import { MarketplaceType } from "./typings";

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
  async IntegrationData(
    Marketplace: MarketplaceType
  ): Promise<ApiResponse<IntegrationData>> {
    try {
      if (!Object.values(MarketplaceType).includes(Marketplace)) {
        return {
          success: false,
          data: {} as IntegrationData,
          message: "Marketplace inválido. Selecione um marketplace válido.",
          error_code: 400,
          error_fields: {},
        };
      }
      const response = await typedApiClient.get<IntegrationData>(
        `/v1/auth/${Marketplace.toLowerCase()}/integration_data`
      );
      return response;
    } catch (error) {
      console.error("error do IntegrationData", error);
      return {
        success: false,
        data: {} as IntegrationData,
        message:
          "Erro ao buscar dados de integração. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }
}

export const marketplaceService = new MarketplaceService();

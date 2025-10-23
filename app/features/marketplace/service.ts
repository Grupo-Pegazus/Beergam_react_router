import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type { BaseMarketPlace, IntegrationData, IntegrationStatus } from "./typings";
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

  async deleteMarketplaceAccount(Marketplace_id: string, Marketplace_type: MarketplaceType): Promise<ApiResponse<null>> {
    try {
      const payload = {
        "marketplace_shop_id": Marketplace_id,
        "marketplace_type": Marketplace_type,
      }
      const response = await typedApiClient.delete<null>(
        `/v1/accounts/delete`,
        {
          data: payload,
        }
      );
      return response;
    } catch (error) {
      console.error("error do deleteMarketplaceAccount", error);
      return {
        success: false,
        data: null,
        message: "Erro ao deletar conta de marketplace. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }

  async checkIntegrationStatus(state: string): Promise<ApiResponse<IntegrationStatus>> {
    try {
      const response = await typedApiClient.get<IntegrationStatus>(
        `/v1/auth/meli/integration_status?state=${state}`
      );
      return response;
    } catch (error) {
      console.error("error do checkIntegrationStatus", error);
      return {
        success: false,
        data: {
          error_code: null,
          error_detail: null,
          marketplace_shop_id: null,
          message: "Erro ao verificar status da integração",
          state: state,
          status: "error",
          updated_at: new Date().toISOString(),
        },
        message: "Erro ao verificar status da integração. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }
}

export const marketplaceService = new MarketplaceService();

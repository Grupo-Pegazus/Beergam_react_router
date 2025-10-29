import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";

/**
 * Interface para a resposta do portal do Stripe
 */
interface PortalSessionResponse {
  url: string;
}

class SubscriptionService {
  /**
   * Cria uma sessão do portal de billing do Stripe para o cliente gerenciar sua assinatura
   * 
   * @param returnUrl - URL para onde redirecionar após o cliente sair do portal
   * @returns URL do portal de billing
   */
  async createBillingPortalSession(
    returnUrl: string
  ): Promise<ApiResponse<PortalSessionResponse>> {
    try {
      const response = await typedApiClient.post<PortalSessionResponse>(
        "/v1/stripe/payments/billing-portal",
        {
          return_url: returnUrl,
        }
      );
      return response;
    } catch (error) {
      console.error("Erro ao criar sessão do portal de billing", error);
      return {
        success: false,
        data: {} as PortalSessionResponse,
        message: "Erro ao acessar portal de billing. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }
}

export const subscriptionService = new SubscriptionService();


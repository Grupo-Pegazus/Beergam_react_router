import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import authStore from "../store-zustand";
import {
  SubscriptionStatus,
  type Subscription,
} from "../user/typings/BaseUser";
/**
 * Interface para a resposta do portal do Stripe
 */
interface PortalSessionResponse {
  url: string;
}

/**
 * Interface para a resposta do checkout do Stripe
 */
interface CheckoutSessionResponse {
  clientSecret: string;
}

/**
 * Interface para os parâmetros de criação de checkout
 */
interface CreateCheckoutParams {
  price_id: string;
  return_url: string;
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
        message:
          "Erro ao acessar portal de billing. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: [],
      };
    }
  }

  /**
   * Cria uma sessão de checkout de assinatura do Stripe
   *
   * @param params - Parâmetros para criação do checkout
   * @returns Client secret do Stripe para o Embedded Checkout
   */
  async createSubscriptionCheckout(
    params: CreateCheckoutParams
  ): Promise<ApiResponse<CheckoutSessionResponse>> {
    try {
      const response = await typedApiClient.post<CheckoutSessionResponse>(
        "/v1/stripe/payments/checkout/subscription",
        {
          price_id: params.price_id,
          return_url: params.return_url,
        }
      );
      return response;
    } catch (error) {
      console.error("Erro ao criar sessão de checkout", error);
      return {
        success: false,
        data: {} as CheckoutSessionResponse,
        message:
          "Erro ao criar sessão de checkout. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: [],
      };
    }
  }

  /**
   * Altera o plano de assinatura do usuário autenticado
   *
   * @param priceId - ID do preço (price_id) do novo plano
   * @returns Resposta da operação
   */
  async changeSubscriptionPlan(priceId: string): Promise<ApiResponse<unknown>> {
    try {
      const response = await typedApiClient.post<unknown>(
        "/v1/stripe/payments/checkout/subscription/change",
        {
          price_id: priceId,
        }
      );
      return response;
    } catch (error) {
      console.error("Erro ao alterar plano de assinatura", error);
      return {
        success: false,
        data: null,
        message: "Erro ao alterar plano. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: [],
      };
    }
  }

  /**
   * Busca a subscription atualizada do usuário autenticado
   *
   *
   * @returns Subscription atualizada do usuário
   */
  async getSubscription(): Promise<ApiResponse<Subscription>> {
    try {
      const response = await typedApiClient.get<Subscription>(
        "/v1/payments/subscription"
      );
      if (response.success) {
        const subscriptionStatusKeys = Object.keys(SubscriptionStatus);
        const errorCachedValue = authStore.getState().error ?? null;
        if (subscriptionStatusKeys.includes(response.data?.status as string)) {
          if (
            SubscriptionStatus[
              response.data
                ?.status as unknown as keyof typeof SubscriptionStatus
            ] === SubscriptionStatus.CANCELED
          ) {
            authStore.setState({
              error: "SUBSCRIPTION_CANCELLED",
            });
          }
          if (
            SubscriptionStatus[
              response.data
                ?.status as unknown as keyof typeof SubscriptionStatus
            ] === SubscriptionStatus.ACTIVE
          ) {
            if (
              errorCachedValue === "SUBSCRIPTION_CANCELLED" ||
              errorCachedValue === "SUBSCRIPTION_NOT_FOUND" ||
              errorCachedValue === "SUBSCRIPTION_NOT_ACTIVE"
            ) {
              authStore.setState({
                error: null,
              });
            }
          }
        }
      }
      // Normaliza diferentes formatos de resposta do backend (objeto ou array)
      type MaybeSubscriptionArray =
        | { data?: Subscription[] }
        | Subscription[]
        | Subscription
        | null
        | undefined;
      const rawData = (response as ApiResponse<unknown>)
        .data as MaybeSubscriptionArray;
      let normalized: Subscription | null = null;

      if (Array.isArray(rawData)) {
        normalized = rawData[0] ?? null;
      } else if (
        rawData &&
        "data" in (rawData as { data?: Subscription[] }) &&
        Array.isArray((rawData as { data?: Subscription[] }).data)
      ) {
        normalized = (rawData as { data?: Subscription[] }).data?.[0] ?? null;
      } else {
        normalized = rawData as Subscription;
      }
      if (response.success) {
        authStore.setState({
          subscription: normalized,
        });
      }
      return {
        ...(response as ApiResponse<unknown>),
        data: (normalized ?? ({} as Subscription)) as Subscription,
        success: Boolean(normalized),
        message:
          (response as ApiResponse<unknown>).message ??
          (normalized ? "" : "Nenhuma assinatura encontrada"),
      } as ApiResponse<Subscription>;
    } catch (error) {
      console.error("Erro ao buscar subscription", error);
      return {
        success: false,
        data: {} as Subscription,
        message:
          "Erro ao buscar assinatura. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: [],
      };
    }
  }
}

export const subscriptionService = new SubscriptionService();

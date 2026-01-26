import { typedApiClient } from "../apiClient/client";
import type {
  ClientsApiResponse,
  ClientsFilters,
  ClientsResponse,
  ChatMessagesResponse,
  ChatMessagesApiResponse,
} from "./typings";

class ChatService {
  private buildQuery(filters?: Partial<ClientsFilters>): string {
    if (!filters) return "";

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      params.append(key, String(value));
    });

    return params.toString();
  }

  async getClients(filters?: Partial<ClientsFilters>): Promise<ClientsApiResponse> {
    const queryString = this.buildQuery(filters);
    const url = `/v1/clients${queryString ? `?${queryString}` : ""}`;
    // O backend retorna diretamente um array, então tipamos como Client[]
    const response = await typedApiClient.get<ClientsResponse>(url);
    return response as ClientsApiResponse;
  }

  /**
   * Busca mensagens pós-compra de um pedido específico.
   * Aceita order_id ou pack_id como identificador.
   * 
   * @param orderId - order_id ou pack_id do pedido
   * @returns Resposta com mensagens de chat pós-compra
   */
  async getPosPurchaseMessages(orderId: string): Promise<ChatMessagesApiResponse> {
    // Remove caracteres não numéricos (mesmo padrão do backend)
    const cleanOrderId = orderId.replace(/\D/g, "");
    const url = `/v1/chat/pos-purchase/${cleanOrderId}`;
    const response = await typedApiClient.get<ChatMessagesResponse>(url);
    return response as ChatMessagesApiResponse;
  }

  /**
   * Busca mensagens de uma reclamação específica.
   * 
   * @param claimId - ID da reclamação
   * @returns Resposta com mensagens de chat da reclamação
   */
  async getClaimMessages(claimId: string): Promise<ChatMessagesApiResponse> {
    const url = `/v1/chat/claim/${claimId}`;
    const response = await typedApiClient.get<ChatMessagesResponse>(url);
    return response as ChatMessagesApiResponse;
  }

  /**
   * Busca mensagens de mediação de uma reclamação específica.
   * 
   * @param claimId - ID da reclamação
   * @returns Resposta com mensagens de mediação
   */
  async getMediationMessages(claimId: string): Promise<ChatMessagesApiResponse> {
    const url = `/v1/chat/mediation/${claimId}`;
    const response = await typedApiClient.get<ChatMessagesResponse>(url);
    return response as ChatMessagesApiResponse;
  }
}

export const chatService = new ChatService();

import { typedApiClient } from "../apiClient/client";
import type {
  ClientsApiResponse,
  ClientsFilters,
  ClientsResponse,
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
    const response = await typedApiClient.get<Client[]>(url);
    return response as ClientsApiResponse;
  }
}

export const chatService = new ChatService();

import type { ApiResponse } from "../apiClient/typings";
import { MarketplaceType } from "../marketplace/typings";

export interface ClientReceiverDocument {
    id: string;
    value: string;
}

export interface Client {
    client_id: string;
    nickname: string;
    orders: string[];
    claims: string[];
    total_orders: number;
    total_spent: number;
    marketplace_type: MarketplaceType;
    marketplace_shop_id: string;
    receiver_name: string;
    receiver_document: ClientReceiverDocument;
}

// O backend retorna diretamente um array de clientes em 'data'
export type ClientsResponse = Client[];

export type ClientsApiResponse = ApiResponse<ClientsResponse>;

export interface ClientsFilters {
    client_id?: string;
    receiver_name?: string;
    receiver_document?: string;
    has_claims?: boolean;
}

export interface ClientsFiltersState {
    client_id: string;
    receiver_name: string;
    receiver_document: string;
    has_claims: string;
}

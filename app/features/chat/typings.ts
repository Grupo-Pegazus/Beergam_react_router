import type Svg from "~/src/assets/svgs/_index";
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


export enum ChatUserType {
    SENDER = "sender",
    RECEIVER = "receiver",
    SYSTEM = "system",
}

interface ChatUser {
    id: string;
    name: string;
    type?: ChatUserType;
    marketplace: MarketplaceType;
}

export interface ChatAttachment {
    id: string;
    original_filename: string;
    url: string;
}

export type MessageStatus = "sending" | "sent" | "error";

export interface ChatMessage {
    text: string;
    user: ChatUserType;
    date_created: string;
    attachments?: ChatAttachment[];
    status?: MessageStatus; // Status de envio da mensagem (opcional, usado apenas no frontend)
    tempId?: string; // ID temporário usado para identificar mensagens sendo enviadas
    // [key: string]: unknown;
}

// Resposta do backend para mensagens de chat
export interface ChatMessagesResponse {
    messages: ChatMessage[];
    // Outros campos que o backend pode retornar
    [key: string]: unknown;
}

export type ChatMessagesApiResponse = ApiResponse<ChatMessagesResponse>;

interface ChatUserDetails extends ChatUser {
    details: {
        nickname: string;
        full_name: string;
        document: string;
        ammount_spent: number;
        total_orders: number;
        total_claims: number;
    };
}

interface ChatAction {
    id: string;
    label: string;
    icon: keyof typeof Svg;
    onClick: () => void;
}

export interface Chat {
    sender?: ChatUserDetails | null;
    messages: ChatMessage[];
    actions?: ChatAction[];
}

export function transformClientToChatUserDetails(client: Client | null): ChatUserDetails | null {
    if (!client) {
        return null;
    }
    return {
        id: client.client_id,
        name: client.nickname,
        type: ChatUserType.SENDER,
        marketplace: client.marketplace_type,
        details: {
            nickname: client.nickname,
            full_name: client.receiver_name,
            document: client.receiver_document.id,
            ammount_spent: client.total_spent,
            total_orders: client.total_orders,
            total_claims: client.claims.length,
        }
    }
}
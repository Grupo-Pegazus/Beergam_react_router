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

// ---------------------------
// Pós-venda - status de envio
// ---------------------------

export interface PosPurchaseDirectMessageStatus {
    /**
     * Indica se o vendedor pode enviar mensagem diretamente via /messages.
     */
    allowed: boolean;
    /**
     * Limite de caracteres que o vendedor pode enviar (seller_max_message_length).
     */
    seller_max_message_length: number;
    /**
     * Limite de caracteres que o comprador pode enviar (buyer_max_message_length), quando disponível.
     */
    buyer_max_message_length?: number | null;
}

export interface PosPurchaseMessagingStatus {
    /**
     * Objeto raw de status da conversa retornado pelo MELI.
     * Exemplo:
     * {
     *   path: "/packs/{pack_id}/sellers/{seller_id}",
     *   status: "active" | "blocked",
     *   substatus: "blocked_by_buyer" | "blocked_by_time" | ...
     * }
     */
    conversation_status?: {
        path?: string;
        status?: string;
        substatus?: string | null;
        [key: string]: unknown;
    } | null;
    /**
     * Informações específicas sobre o canal direto (/messages).
     */
    direct_message: PosPurchaseDirectMessageStatus;
    /**
     * Agregado indicando se existe QUALQUER forma de enviar mensagem
     * (direto ou via motivos / action_guide).
     */
    can_message: boolean;
    /**
     * Substatus de bloqueio, quando existir (espelha conversation_status.substatus).
     */
    blocked_substatus?: string | null;
    /**
     * Dados brutos das opções de motivos e caps retornados pelo MELI.
     * Mantemos tipagem aberta para acompanhar mudanças da API sem quebrar o frontend.
     */
    action_guide: {
        options?: unknown;
        caps?: unknown;
        error?: unknown;
    };
}

export type PosPurchaseMessagingStatusApiResponse = ApiResponse<PosPurchaseMessagingStatus>;

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
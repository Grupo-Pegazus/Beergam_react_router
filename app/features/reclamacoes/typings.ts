import type { ApiResponse } from "../apiClient/typings";

export enum ClaimStatus {
    OPENED = "opened",
    CLOSED = "closed",
}

export type ClaimMessageRole = "complainant" | "respondent" | "mediator" | "purchase";

export interface ClaimMessage {
    message: string;
    date_created?: string;
    sender_role?: ClaimMessageRole;
    receiver_role?: ClaimMessageRole;
    attachments?: string[];
    [key: string]: unknown;
}

export function getRoleLabel(role?: ClaimMessageRole | string): string {
    if (!role) return "Sistema";
    const normalized = role.toLowerCase();
    switch (normalized) {
        case "complainant":
            return "Reclamante";
        case "respondent":
            return "Respondente";
        case "mediator":
            return "Mediador";
        case "purchase":
            return "Comprador";
        default:
            return role;
    }
}

export function getStageLabel(stage?: string): string {
    if (!stage) return "—";
    const normalized = stage.toLowerCase();
    switch (normalized) {
        case "claim":
            return "Reclamação";
        case "dispute":
            return "Disputa";
        case "recontact":
            return "Recontato";
        case "stale":
            return "Inativa";
        case "none":
            return "Nenhuma";
        default:
            return stage;
    }
}

export function getTypeLabel(type?: string): string {
    if (!type) return "—";
    const normalized = type.toLowerCase();
    switch (normalized) {
        case "mediations":
            return "Mediações";
        case "returns":
            return "Devoluções";
        case "ml_case":
            return "Caso ML";
        case "cancel_sale":
            return "Cancelamento de Venda";
        case "cancel_purchase":
            return "Cancelamento de Compra";
        case "fulfillment":
            return "Cumprimento";
        case "change":
            return "Troca";
        default:
            return type;
    }
}

export function getResolutionReasonLabel(reason?: string): string {
    if (!reason) return "—";
    const normalized = reason.toLowerCase();
    switch (normalized) {
        case "already_shipped":
            return "Produto a caminho";
        case "buyer_claim_opened":
            return "Encerramento da devolução por abertura de outra reclamação";
        case "buyer_dispute_opened":
            return "Encerramento da devolução por abertura de outra reclamação em disputa";
        case "charged_back":
            return "Encerramento por contracargo";
        case "coverage_decision":
            return "Disputa encerrada com cobertura pelo ML";
        case "found_missing_parts":
            return "Comprador encontrou as partes faltantes";
        case "item_returned":
            return "Produto devolvido";
        case "no_bpp":
            return "Encerramento sem cobertura por parte do ML";
        case "not_delivered":
            return "Produto não entregue";
        case "opened_claim_by_mistake":
            return "Comprador criou a reclamação por engano";
        case "partial_refunded":
            return "Reembolso parcial do pagamento concedido ao comprador";
        case "payment_refunded":
            return "Pagamento devolvido ao comprador";
        case "prefered_to_keep_product":
            return "Comprador preferiu ficar com o produto";
        case "product_delivered":
            return "Falha de um representante do Mercado Livre";
        case "reimbursed":
            return "Reembolso";
        case "rep_resolution":
            return "Falha de um representante do Mercado Livre";
        case "respondent_timeout":
            return "Vendedor não responde";
        case "return_canceled":
            return "Devolução cancelada pelo comprador";
        case "return_expired":
            return "Devolução vencida sem alteração de status no envio";
        case "seller_asked_to_close_claim":
            return "Vendedor pediu ao comprador que encerrasse a reclamação";
        case "seller_did_not_help":
            return "Comprador conseguiu resolver o problema sem a ajuda do vendedor";
        case "seller_explained_functions":
            return "Vendedor explicou como funcionava o item";
        case "seller_sent_product":
            return "Vendedor enviou o produto";
        case "timeout":
            return "Encerramento por timeout de ação ao comprador";
        case "warehouse_decision":
            return "Encerramento por demora na revisão do produto no Warehouse";
        case "warehouse_timeout":
            return "Encerramento por demora na revisão do produto no Warehouse";
        case "worked_out_with_seller":
            return "Comprador resolveu com o vendedor fora do ML";
        case "low_cost":
            return "Encerramento porque o custo do envio é maior que o do produto";
        case "item_changed":
            return "Encerramento porque a troca foi feita com sucesso";
        case "change_expired":
            return "A troca não foi realizada e o tempo permitido expirou";
        case "change_cancelled_buyer":
            return "Encerramento proativo de uma troca pelo comprador";
        case "change_cancelled_seller":
            return "Encerramento proativo de uma troca pelo vendedor";
        case "change_cancelled_meli":
            return "Encerramento de uma troca pelo Meli";
        case "shipment_not_stopped":
            return "Encerramento porque o envio não conseguiu ser interrompido";
        case "cancel_installation":
            return "Cancelamento de serviço de instalação";
        default:
            return reason;
    }
}

export function getClosedByLabel(closedBy?: string): string {
    if (!closedBy) return "—";
    const normalized = closedBy.toLowerCase();
    switch (normalized) {
        case "mediator":
            return "Mediador";
        case "buyer":
            return "Comprador";
        case "seller":
            return "Vendedor";
        case "system":
            return "Sistema";
        default:
            return closedBy;
    }
}

export interface ClaimDetail {
    action_responsible?: string;
    available?: boolean;
    description?: string;
    due_date?: string | null;
    problem?: string | null;
    title?: string;
    [key: string]: unknown;
}

export interface AffectsReputation {
    affects_reputation?: string;
    due_date?: string | null;
    has_incentive?: boolean;
    [key: string]: unknown;
}

export interface ClaimResolution {
    reason?: string;
    date_created?: string;
    benefited?: string[];
    closed_by?: string;
    applied_coverage?: boolean;
    [key: string]: unknown;
}

export interface Claim {
    id: string | number;
    status?: string;
    resource?: string;
    resource_id?: string | number;
    reason?: string;
    reason_id?: string;
    messages?: ClaimMessage[] | Record<string, unknown>;
    date_created?: string;
    date_closed?: string | null;
    last_updated?: string;
    detail?: ClaimDetail | null;
    resolution?: ClaimResolution | null;
    affects_reputation?: AffectsReputation | null;
    stage?: string;
    type?: string;
    [key: string]: unknown;
}

export function getClaimStatus(status?: string): ClaimStatus | string {
    if (!status) return "unknown";
    const normalized = status.toLowerCase();
    if (normalized === "opened") return ClaimStatus.OPENED;
    if (normalized === "closed") return ClaimStatus.CLOSED;
    return status;
}

export interface ClaimsFilters {
    status?: string | null;
    claim_id?: string | null;
    resource?: string | null;
    resource_id?: string | null;
    text?: string | null;
    date_from?: string | null;
    date_to?: string | null;
    affects_reputation?: string | null;
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: "asc" | "desc";
}

export interface ClaimsInsights {
    total: number;
    opened: number;
    closed: number;
    avg_resolution_minutes: number | null;
    avg_resolution_days: number | null;
    status_counts: Record<string, number>;
    resource_counts: Record<string, number>;
    resolution_time_buckets: Record<string, number>;
    daily_trend: { date: string; total: number; opened: number; closed: number }[];
}

export interface ClaimsPagination {
    page: number;
    per_page: number;
    total_count: number;
    total_pages?: number;
}

export interface ClaimsListResponse {
    claims: Claim[];
    pagination: ClaimsPagination;
    filters_applied: Partial<ClaimsFilters>;
    insights?: ClaimsInsights;
}

export interface ClaimsMetricsResponse {
    insights: ClaimsInsights;
}

export type ClaimsListApiResponse = ApiResponse<ClaimsListResponse>;
export type ClaimsMetricsApiResponse = ApiResponse<ClaimsMetricsResponse>;

export interface ClaimsFiltersState {
    status: string;
    claim_id: string;
    text: string;
    date_from?: string;
    date_to?: string;
    affects_reputation: string;
    page: number;
    per_page: number;
    sort_by?: string;
    sort_order?: "asc" | "desc";
}

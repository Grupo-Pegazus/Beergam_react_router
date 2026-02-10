import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { ClientsFilters } from "./typings";
import { chatService } from "./service";

export function useClients(filters?: Partial<ClientsFilters>) {
    // Normaliza os filtros para evitar re-fetches desnecessários
    const normalizedFilters = useMemo(() => {
        if (!filters) return undefined;
        const normalized: Partial<ClientsFilters> = {};
        if (filters.client_id?.trim()) normalized.client_id = filters.client_id.trim();
        if (filters.receiver_name?.trim()) normalized.receiver_name = filters.receiver_name.trim();
        if (filters.receiver_document?.trim()) normalized.receiver_document = filters.receiver_document.trim();
        if (filters.has_claims !== undefined) normalized.has_claims = filters.has_claims;
        return Object.keys(normalized).length > 0 ? normalized : undefined;
    }, [filters]);

    return useQuery({
        queryKey: ["clients", normalizedFilters],
        queryFn: () => chatService.getClients(normalizedFilters),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
}

/**
 * Hook para buscar mensagens pós-compra de um pedido específico.
 * 
 * @param orderId - order_id ou pack_id do pedido
 * @param enabled - Se a query deve ser executada (default: true se orderId estiver presente)
 */
export function usePosPurchaseMessages(orderId?: string | null, enabled = true) {
    const shouldFetch = enabled && Boolean(orderId);

    return useQuery({
        queryKey: ["chat", "pos-purchase", orderId],
        queryFn: () => {
            if (!orderId) throw new Error("orderId é obrigatório");
            return chatService.getPosPurchaseMessages(orderId);
        },
        enabled: shouldFetch,
        staleTime: 1000 * 60 * 2, // 2 minutos
        gcTime: 1000 * 60 * 5, // 5 minutos
        refetchOnWindowFocus: false,
    });
}

/**
 * Hook para buscar o status de mensageria pós-venda de um pedido específico.
 *
 * @param orderId - order_id ou pack_id do pedido
 * @param enabled - Se a query deve ser executada (default: true se orderId estiver presente)
 */
export function usePosPurchaseMessagingStatus(orderId?: string | null, enabled = true) {
    const shouldFetch = enabled && Boolean(orderId);

    return useQuery({
        queryKey: ["chat", "pos-purchase-status", orderId],
        queryFn: () => {
            if (!orderId) throw new Error("orderId é obrigatório");
            return chatService.getPosPurchaseMessagingStatus(orderId);
        },
        enabled: shouldFetch,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
}

/**
 * Hook para buscar mensagens de uma reclamação específica.
 * 
 * @param claimId - ID da reclamação
 * @param enabled - Se a query deve ser executada (default: true se claimId estiver presente)
 */
export function useClaimMessages(claimId?: string | null, enabled = true) {
    const shouldFetch = enabled && Boolean(claimId);

    return useQuery({
        queryKey: ["chat", "claim", claimId],
        queryFn: () => {
            if (!claimId) throw new Error("claimId é obrigatório");
            return chatService.getClaimMessages(claimId);
        },
        enabled: shouldFetch,
        staleTime: 1000 * 30,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    });
}

/**
 * Hook para buscar mensagens de mediação de uma reclamação específica.
 * 
 * @param claimId - ID da reclamação
 * @param enabled - Se a query deve ser executada (default: true se claimId estiver presente)
 */
export function useMediationMessages(claimId?: string | null, enabled = true) {
    const shouldFetch = enabled && Boolean(claimId);

    return useQuery({
        queryKey: ["chat", "mediation", claimId],
        queryFn: () => {
            if (!claimId) throw new Error("claimId é obrigatório");
            return chatService.getMediationMessages(claimId);
        },
        enabled: shouldFetch,
        staleTime: 1000 * 30,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    });
}

// Re-export useClaimDetails from hooks subdirectory
export { useClaimDetails } from "./hooks/useClaimDetails";

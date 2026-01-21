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

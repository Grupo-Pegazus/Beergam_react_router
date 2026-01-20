import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ClientsList } from "~/features/chat/components/ClientsList";
import { ClientsFilters } from "~/features/chat/components/ClientsFilters";
import { ChatArea } from "~/features/chat/components/ChatArea";
import { ClientInfo } from "~/features/chat/components/ClientInfo";
import { useClients } from "~/features/chat/hooks";
import type { Client, ClientsFilters as ClientsFiltersType, ClientsFiltersState } from "~/features/chat/typings";
import type { ChatType } from "~/features/chat/components/ChatArea";

const DEFAULT_FILTERS: ClientsFiltersState = {
    client_id: "",
    receiver_name: "",
    receiver_document: "",
    has_claims: "",
};

function mapToApiFilters(
    filters: ClientsFiltersState
): Partial<ClientsFiltersType> {
    return {
        client_id: filters.client_id || undefined,
        receiver_name: filters.receiver_name || undefined,
        receiver_document: filters.receiver_document || undefined,
        has_claims:
            filters.has_claims === "true"
                ? true
                : filters.has_claims === "false"
                    ? false
                    : undefined,
    };
}

export default function ChatPage() {
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [chatType, setChatType] = useState<ChatType>("pos_venda");
    const [filters, setFilters] = useState<ClientsFiltersState>(DEFAULT_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState<ClientsFiltersState>(DEFAULT_FILTERS);
    const queryClient = useQueryClient();

    const apiFilters = useMemo(
        () => mapToApiFilters(appliedFilters),
        [appliedFilters]
    );

    const clientsQuery = useClients(apiFilters);

    const clients: Client[] = useMemo(() => {
        if (!clientsQuery.data?.success || !clientsQuery.data.data) {
            return [];
        }
        const responseData = clientsQuery.data.data;

        // O backend retorna diretamente um array de clientes
        return Array.isArray(responseData) ? responseData : [];
    }, [clientsQuery.data]);

    const handleClientSelect = useCallback((client: Client) => {
        setSelectedClient(client);
    }, []);

    const handleChatTypeChange = useCallback((type: ChatType) => {
        setChatType(type);
    }, []);

    const handleFiltersChange = useCallback((next: ClientsFiltersState) => {
        setFilters(next);
    }, []);

    const applyFilters = useCallback(() => {
        // Só aplica se realmente mudou algo
        const hasChanges = Object.keys(filters).some(
            (key) => filters[key as keyof ClientsFiltersState] !== appliedFilters[key as keyof ClientsFiltersState]
        );

        if (hasChanges) {
            setAppliedFilters({ ...filters });
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        }
    }, [filters, appliedFilters, queryClient]);

    const resetFilters = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
        setAppliedFilters(DEFAULT_FILTERS);
        queryClient.invalidateQueries({ queryKey: ["clients"] });
    }, [queryClient]);

    return (
        <div className="h-[calc(100vh-200px)] flex flex-col lg:flex-row gap-4">
            {/* Coluna Esquerda - Lista de Clientes (20%) */}
            <div className="w-full lg:w-[20%] lg:min-w-[250px] flex flex-col gap-4">
                <ClientsFilters
                    value={filters}
                    onChange={handleFiltersChange}
                    onReset={resetFilters}
                    onSubmit={applyFilters}
                    isSubmitting={clientsQuery.isLoading}
                />

                <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="mb-2">
                        <h2 className="text-xl font-semibold text-beergam-typography-primary">
                            Clientes
                        </h2>
                        <p className="text-xs text-beergam-typography-secondary">
                            {clients.length} cliente{clients.length !== 1 ? "s" : ""} encontrado
                            {clients.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <ClientsList
                            clients={clients}
                            selectedClientId={selectedClient?.client_id}
                            loading={clientsQuery.isLoading}
                            onClientSelect={handleClientSelect}
                        />
                    </div>
                </div>
            </div>

            {/* Coluna Meio - Chat (50%) */}
            <div className="flex-1 flex flex-col min-w-0">
                <ChatArea chatType={chatType} onChatTypeChange={handleChatTypeChange} />
            </div>

            {/* Coluna Direita - Informações do Cliente (30%) */}
            <div className="w-full lg:w-[30%] lg:min-w-[300px] flex flex-col">
                <ClientInfo client={selectedClient || undefined} />
            </div>
        </div>
    );
}

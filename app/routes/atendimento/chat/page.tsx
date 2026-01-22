import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import type { ChatType } from "~/features/chat/components/ChatArea";
import { ChatArea } from "~/features/chat/components/ChatArea";
import { ClientsFilters } from "~/features/chat/components/ClientsFilters";
import { ClientsList } from "~/features/chat/components/ClientsList";
import { useClients, usePosPurchaseMessages, useClaimMessages, useMediationMessages } from "~/features/chat/hooks";
import type { Client, ClientsFiltersState, ClientsFilters as ClientsFiltersType, ChatMessage } from "~/features/chat/typings";
import { transformClientToChatUserDetails } from "~/features/chat/typings";

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
    const [searchParams, setSearchParams] = useSearchParams();
    const orderIdParam = searchParams.get("order_id");
    const claimIdParam = searchParams.get("claim_id");

    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [chatType, setChatType] = useState<ChatType>("pos_venda");
    const [filters, setFilters] = useState<ClientsFiltersState>(DEFAULT_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState<ClientsFiltersState>(DEFAULT_FILTERS);
    const queryClient = useQueryClient();

    // Ref para evitar loops infinitos ao atualizar URL
    const isUpdatingFromUrlRef = useRef(false);

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

    // Efeito para selecionar cliente automaticamente quando houver order_id ou claim_id
    useEffect(() => {
        if (!clients.length || (!orderIdParam && !claimIdParam)) {
            return;
        }

        // Marca que está atualizando a partir da URL para evitar loop
        isUpdatingFromUrlRef.current = true;

        let clientToSelect: Client | null = null;
        let chatTypeToSet: ChatType = "pos_venda";

        if (orderIdParam) {
            // Busca cliente que tem o order_id
            clientToSelect = clients.find((client) =>
                client.orders.some((orderId) => orderId === orderIdParam || orderId.includes(orderIdParam))
            ) || null;
            chatTypeToSet = "pos_venda";
        } else if (claimIdParam) {
            // Busca cliente que tem o claim_id
            clientToSelect = clients.find((client) =>
                client.claims.some((claimId) => String(claimId) === String(claimIdParam))
            ) || null;
            chatTypeToSet = "reclamacao";
        }

        if (clientToSelect && clientToSelect.client_id !== selectedClient?.client_id) {
            setSelectedClient(clientToSelect);
            setChatType(chatTypeToSet);
        }

        // Reset do flag após um pequeno delay
        setTimeout(() => {
            isUpdatingFromUrlRef.current = false;
        }, 100);
    }, [clients, orderIdParam, claimIdParam, selectedClient?.client_id]);

    // Efeito para ajustar chatType quando o cliente muda e não tem claims mas está em reclamação/mediação
    useEffect(() => {
        if (!selectedClient || isUpdatingFromUrlRef.current) {
            return;
        }

        // Se está em reclamação/mediação mas o cliente não tem claims, muda para pós-venda
        if ((chatType === "reclamacao" || chatType === "mediacao") && selectedClient.claims.length === 0) {
            setChatType("pos_venda");

            // Atualiza a URL para pós-venda
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete("claim_id");

            if (selectedClient.orders.length > 0) {
                const urlOrderId = orderIdParam && selectedClient.orders.some(id => id === orderIdParam || id.includes(orderIdParam))
                    ? orderIdParam
                    : selectedClient.orders[0];
                newSearchParams.set("order_id", urlOrderId);
            }

            setSearchParams(newSearchParams, { replace: true });
        }
    }, [selectedClient, chatType, searchParams, setSearchParams, orderIdParam]);

    const handleClientSelect = useCallback((client: Client) => {
        // Verifica se precisa ajustar o tipo de chat
        let newChatType = chatType;

        // Se está em reclamação/mediação mas o novo cliente não tem claims, muda para pós-venda
        if ((chatType === "reclamacao" || chatType === "mediacao") && client.claims.length === 0) {
            newChatType = "pos_venda";
        }

        setSelectedClient(client);
        if (newChatType !== chatType) {
            setChatType(newChatType);
        }

        // Evita atualizar URL se está vindo da URL
        if (isUpdatingFromUrlRef.current) {
            return;
        }

        // Atualiza a URL dinamicamente baseado no cliente selecionado e tipo de chat (ajustado se necessário)
        const newSearchParams = new URLSearchParams(searchParams);

        // Remove parâmetros antigos
        newSearchParams.delete("order_id");
        newSearchParams.delete("claim_id");

        // Adiciona o parâmetro correto baseado no tipo de chat
        // Prioriza usar o order_id/claim_id da URL se existir e pertencer ao cliente, senão usa o primeiro disponível
        if (newChatType === "pos_venda" && client.orders.length > 0) {
            // Se há order_id na URL e ele pertence a este cliente, mantém ele
            const urlOrderId = orderIdParam && client.orders.some(id => id === orderIdParam || id.includes(orderIdParam))
                ? orderIdParam
                : client.orders[0];
            newSearchParams.set("order_id", urlOrderId);
        } else if ((newChatType === "reclamacao" || newChatType === "mediacao") && client.claims.length > 0) {
            // Se há claim_id na URL e ele pertence a este cliente, mantém ele
            const urlClaimId = claimIdParam && client.claims.some(id => String(id) === String(claimIdParam))
                ? claimIdParam
                : String(client.claims[0]);
            newSearchParams.set("claim_id", urlClaimId);
        }
        // Se não tem orders nem claims, mantém a URL limpa (sem parâmetros)

        setSearchParams(newSearchParams, { replace: true });
    }, [chatType, searchParams, setSearchParams, orderIdParam, claimIdParam]);

    const handleChatTypeChange = useCallback((type: ChatType) => {
        setChatType(type);

        // Evita atualizar URL se está vindo da URL ou não há cliente selecionado
        if (isUpdatingFromUrlRef.current || !selectedClient) {
            return;
        }

        // Atualiza a URL quando o tipo de chat muda
        const newSearchParams = new URLSearchParams(searchParams);

        // Remove parâmetros antigos
        newSearchParams.delete("order_id");
        newSearchParams.delete("claim_id");

        // Adiciona o parâmetro correto baseado no novo tipo de chat
        // Prioriza usar o order_id/claim_id da URL se existir e pertencer ao cliente, senão usa o primeiro disponível
        if (type === "pos_venda" && selectedClient.orders.length > 0) {
            // Se há order_id na URL e ele pertence a este cliente, mantém ele
            const urlOrderId = orderIdParam && selectedClient.orders.some(id => id === orderIdParam || id.includes(orderIdParam))
                ? orderIdParam
                : selectedClient.orders[0];
            newSearchParams.set("order_id", urlOrderId);
        } else if ((type === "reclamacao" || type === "mediacao") && selectedClient.claims.length > 0) {
            // Se há claim_id na URL e ele pertence a este cliente, mantém ele
            const urlClaimId = claimIdParam && selectedClient.claims.some(id => String(id) === String(claimIdParam))
                ? claimIdParam
                : String(selectedClient.claims[0]);
            newSearchParams.set("claim_id", urlClaimId);
        }

        setSearchParams(newSearchParams, { replace: true });
    }, [selectedClient, searchParams, setSearchParams, orderIdParam, claimIdParam]);

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

    // Determina qual order_id ou claim_id usar baseado no cliente selecionado e tipo de chat
    const activeOrderId = useMemo(() => {
        if (chatType === "pos_venda" && selectedClient && orderIdParam) {
            // Se há order_id na URL, usa ele
            return orderIdParam;
        }
        // Se não há order_id na URL mas há cliente selecionado, usa o primeiro order_id do cliente
        if (chatType === "pos_venda" && selectedClient && selectedClient.orders.length > 0) {
            return selectedClient.orders[0];
        }
        return null;
    }, [chatType, selectedClient, orderIdParam]);

    const activeClaimId = useMemo(() => {
        if ((chatType === "reclamacao" || chatType === "mediacao") && selectedClient && claimIdParam) {
            // Se há claim_id na URL, usa ele
            return claimIdParam;
        }
        // Se não há claim_id na URL mas há cliente selecionado, usa o primeiro claim_id do cliente
        if ((chatType === "reclamacao" || chatType === "mediacao") && selectedClient && selectedClient.claims.length > 0) {
            return String(selectedClient.claims[0]);
        }
        return null;
    }, [chatType, selectedClient, claimIdParam]);

    // Busca mensagens baseado no tipo de chat
    const posPurchaseMessagesQuery = usePosPurchaseMessages(
        activeOrderId,
        chatType === "pos_venda" && Boolean(selectedClient)
    );

    const claimMessagesQuery = useClaimMessages(
        activeClaimId,
        chatType === "reclamacao" && Boolean(selectedClient)
    );

    const mediationMessagesQuery = useMediationMessages(
        activeClaimId,
        chatType === "mediacao" && Boolean(selectedClient)
    );

    // Seleciona as mensagens corretas baseado no tipo de chat
    const messages: ChatMessage[] = useMemo(() => {
        if (!selectedClient) return [];

        switch (chatType) {
            case "pos_venda":
                if (posPurchaseMessagesQuery.data?.success && posPurchaseMessagesQuery.data.data?.messages) {
                    return posPurchaseMessagesQuery.data.data.messages;
                }
                return [];
            case "reclamacao":
                if (claimMessagesQuery.data?.success && claimMessagesQuery.data.data?.messages) {
                    return claimMessagesQuery.data.data.messages;
                }
                return [];
            case "mediacao":
                if (mediationMessagesQuery.data?.success && mediationMessagesQuery.data.data?.messages) {
                    return mediationMessagesQuery.data.data.messages;
                }
                return [];
            default:
                return [];
        }
    }, [chatType, posPurchaseMessagesQuery.data, claimMessagesQuery.data, mediationMessagesQuery.data, selectedClient]);

    // Determina se está carregando mensagens
    const isLoadingMessages = useMemo(() => {
        if (!selectedClient) return false;

        switch (chatType) {
            case "pos_venda":
                return posPurchaseMessagesQuery.isLoading;
            case "reclamacao":
                return claimMessagesQuery.isLoading;
            case "mediacao":
                return mediationMessagesQuery.isLoading;
            default:
                return false;
        }
    }, [chatType, posPurchaseMessagesQuery.isLoading, claimMessagesQuery.isLoading, mediationMessagesQuery.isLoading, selectedClient]);

    return (
        <div className="h-[calc(100vh-200px)] flex flex-col lg:flex-row gap-4">
            {/* Coluna Esquerda - Lista de Clientes (20%) */}
            <div className="w-full lg:w-[40%] lg:min-w-[250px] flex flex-col gap-4">
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
                <ChatArea
                    sender={transformClientToChatUserDetails(selectedClient)}
                    messages={messages}
                    chatType={chatType}
                    isLoading={isLoadingMessages}
                    onChatTypeChange={handleChatTypeChange}
                    hasClaims={selectedClient ? selectedClient.claims.length > 0 : false}
                    client={selectedClient || undefined}
                />
            </div>

            {/* Coluna Direita - Informações do Cliente (30%) */}
            {/* <div className="w-full lg:w-[30%] lg:min-w-[300px] flex flex-col">
                <ClientInfo client={selectedClient || undefined} />
            </div> */}
        </div>
    );
}

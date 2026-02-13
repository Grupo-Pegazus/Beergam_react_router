import { useMediaQuery, useTheme } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import type { ChatType } from "~/features/chat/components/ChatArea";
import { ChatArea } from "~/features/chat/components/ChatArea";
import ClaimSelectionModal from "~/features/chat/components/ChatArea/ClaimSelectionModal";
import OrderSelectionModal from "~/features/chat/components/ChatArea/OrderSelectionModal";
import { ClientsFilters } from "~/features/chat/components/ClientsFilters";
import { ClientsList } from "~/features/chat/components/ClientsList";
import { useClients, usePosPurchaseMessages, useClaimMessages, useMediationMessages, usePosPurchaseMessagingStatus } from "~/features/chat/hooks";
import { MOCK_CLIENTS, USE_MOCK_CLIENTS } from "~/features/chat/mocks/mockClients";
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [searchParams, setSearchParams] = useSearchParams();
    const orderIdParam = searchParams.get("order_id");
    const claimIdParam = searchParams.get("claim_id");

    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [chatType, setChatType] = useState<ChatType>("pos_venda");
    const [filters, setFilters] = useState<ClientsFiltersState>(DEFAULT_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState<ClientsFiltersState>(DEFAULT_FILTERS);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
    const [showOrderSelection, setShowOrderSelection] = useState(false);
    const [showClaimSelection, setShowClaimSelection] = useState(false);
    const queryClient = useQueryClient();

    const isUpdatingFromUrlRef = useRef(false);
    const lastProcessedClientIdRef = useRef<string | null>(null);
    const isSelectingClientRef = useRef(false);

    const apiFilters = useMemo(
        () => mapToApiFilters(appliedFilters),
        [appliedFilters]
    );

    const clientsQuery = useClients(apiFilters);

    const clients: Client[] = useMemo(() => {
        if (!clientsQuery.data?.success || !clientsQuery.data.data) {
            return USE_MOCK_CLIENTS ? MOCK_CLIENTS : [];
        }
        const responseData = clientsQuery.data.data;
        const realClients = Array.isArray(responseData) ? responseData : [];
        // Usa mocks quando a API retorna vazio (ex: backend de teste sem dados)
        if (realClients.length === 0 && USE_MOCK_CLIENTS) {
            return MOCK_CLIENTS;
        }
        return realClients;
    }, [clientsQuery.data]);

    useEffect(() => {
        if (isSelectingClientRef.current || isUpdatingFromUrlRef.current) {
            return;
        }

        if (!clients.length || (!orderIdParam && !claimIdParam)) {
            return;
        }

        isUpdatingFromUrlRef.current = true;

        let clientToSelect: Client | null = null;
        let chatTypeToSet: ChatType = "pos_venda";

        if (orderIdParam) {
            clientToSelect = clients.find((client) =>
                client.orders.some((orderId) => orderId === orderIdParam || orderId.includes(orderIdParam))
            ) || null;
            chatTypeToSet = "pos_venda";
        } else if (claimIdParam) {
            clientToSelect = clients.find((client) =>
                client.claims.some((claimId) => String(claimId) === String(claimIdParam))
            ) || null;
            chatTypeToSet = "reclamacao";
        }

        if (clientToSelect && clientToSelect.client_id !== selectedClient?.client_id) {
            setSelectedClient(clientToSelect);
            setChatType(chatTypeToSet);
            if (orderIdParam) {
                setSelectedOrderId(orderIdParam);
            } else if (claimIdParam) {
                setSelectedClaimId(claimIdParam);
            }
            lastProcessedClientIdRef.current = `${clientToSelect.client_id}-${chatTypeToSet}`;
        }

        setTimeout(() => {
            isUpdatingFromUrlRef.current = false;
        }, 100);
    }, [clients, orderIdParam, claimIdParam, selectedClient?.client_id]);

    // Quando a URL não tem order_id nem claim_id, limpa o cliente selecionado (ex: após clicar em Voltar)
    useEffect(() => {
        if (!orderIdParam && !claimIdParam) {
            setSelectedClient(null);
            setSelectedOrderId(null);
            setSelectedClaimId(null);
        }
    }, [orderIdParam, claimIdParam]);

    useEffect(() => {
        if (!selectedClient || isUpdatingFromUrlRef.current || isSelectingClientRef.current) {
            return;
        }

        const clientChatKey = `${selectedClient.client_id}-${chatType}`;
        if (lastProcessedClientIdRef.current === clientChatKey) {
            return;
        }

        if ((chatType === "reclamacao" || chatType === "mediacao") && selectedClient.claims.length === 0) {
            setChatType("pos_venda");

            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete("claim_id");

            if (selectedClient.orders.length > 0) {
                const urlOrderId = orderIdParam && selectedClient.orders.some(id => id === orderIdParam || id.includes(orderIdParam))
                    ? orderIdParam
                    : selectedClient.orders[0];
                newSearchParams.set("order_id", urlOrderId);
            }

            setSearchParams(newSearchParams, { replace: true });
            lastProcessedClientIdRef.current = `${selectedClient.client_id}-pos_venda`;
        } else {
            lastProcessedClientIdRef.current = clientChatKey;
        }
    }, [selectedClient?.client_id, chatType, searchParams, setSearchParams, orderIdParam]);

    const handleClientSelect = useCallback((client: Client) => {
        if (isUpdatingFromUrlRef.current || selectedClient?.client_id === client.client_id) {
            return;
        }

        isSelectingClientRef.current = true;
        isUpdatingFromUrlRef.current = true;

        let newChatType: ChatType = "pos_venda";
        let newOrderId: string | null = null;
        let newClaimId: string | null = null;

        if (client.claims.length > 0) {
            if (chatType === "reclamacao" || chatType === "mediacao") {
                newChatType = chatType;
            } else {
                newChatType = "reclamacao";
            }
            newClaimId = String(client.claims[0]);
        } else {
            newChatType = "pos_venda";
            if (client.orders.length > 0) {
                newOrderId = client.orders[0];
            }
        }

        lastProcessedClientIdRef.current = null;

        setSelectedOrderId(newOrderId);
        setSelectedClaimId(newClaimId);
        setSelectedClient(client);
        setChatType(newChatType);

        const newSearchParams = new URLSearchParams();

        if (newChatType === "pos_venda" && newOrderId) {
            newSearchParams.set("order_id", newOrderId);
        } else if ((newChatType === "reclamacao" || newChatType === "mediacao") && newClaimId) {
            newSearchParams.set("claim_id", newClaimId);
        }

        setSearchParams(newSearchParams, { replace: true });
        lastProcessedClientIdRef.current = `${client.client_id}-${newChatType}`;

        setTimeout(() => {
            isSelectingClientRef.current = false;
            isUpdatingFromUrlRef.current = false;
        }, 300);
    }, [chatType, selectedClient?.client_id, setSearchParams]);

    const updateUrlForChatType = useCallback((type: ChatType, client: Client, orderId?: string | null, claimId?: string | null) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("order_id");
        newSearchParams.delete("claim_id");

        if (type === "pos_venda") {
            const orderIdToUse = orderId || (orderIdParam && client.orders.some(id => id === orderIdParam || id.includes(orderIdParam))
                ? orderIdParam
                : client.orders[0]);
            if (orderIdToUse) {
                newSearchParams.set("order_id", orderIdToUse);
            }
        } else if (type === "reclamacao" || type === "mediacao") {
            const claimIdToUse = claimId || (claimIdParam && client.claims.some(id => String(id) === String(claimIdParam))
                ? claimIdParam
                : String(client.claims[0]));
            if (claimIdToUse) {
                newSearchParams.set("claim_id", claimIdToUse);
            }
        }

        setSearchParams(newSearchParams, { replace: true });
    }, [searchParams, setSearchParams, orderIdParam, claimIdParam]);

    const handleChatTypeChange = useCallback((type: ChatType) => {
        if (isUpdatingFromUrlRef.current || !selectedClient) {
            return;
        }

        if (type === "pos_venda" && selectedClient.orders.length > 1) {
            setShowOrderSelection(true);
            return;
        }

        if ((type === "reclamacao" || type === "mediacao") && selectedClient.claims.length > 1) {
            setShowClaimSelection(true);
            return;
        }

        setChatType(type);
        updateUrlForChatType(type, selectedClient);
    }, [selectedClient, updateUrlForChatType]);

    const handleOrderSelect = useCallback((orderId: string) => {
        setSelectedOrderId(orderId);
        setChatType("pos_venda");
        updateUrlForChatType("pos_venda", selectedClient!, orderId, null);
    }, [selectedClient, updateUrlForChatType]);

    const handleClaimSelect = useCallback((claimId: string) => {
        setSelectedClaimId(claimId);
        if (chatType === "reclamacao" || chatType === "mediacao") {
            setChatType(chatType);
            updateUrlForChatType(chatType, selectedClient!, null, claimId);
        }
    }, [selectedClient, chatType, updateUrlForChatType]);


    const handleFiltersChange = useCallback((next: ClientsFiltersState) => {
        setFilters(next);
    }, []);

    const applyFilters = useCallback(() => {
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

    const activeOrderId = useMemo(() => {
        if (selectedOrderId) {
            return selectedOrderId;
        }
        if (chatType === "pos_venda" && selectedClient && orderIdParam) {
            return orderIdParam;
        }
        if (chatType === "pos_venda" && selectedClient && selectedClient.orders.length > 0) {
            return selectedClient.orders[0];
        }
        return null;
    }, [chatType, selectedClient, orderIdParam, selectedOrderId]);

    const activeClaimId = useMemo(() => {
        if (selectedClaimId) {
            return selectedClaimId;
        }
        if ((chatType === "reclamacao" || chatType === "mediacao") && selectedClient && claimIdParam) {
            return claimIdParam;
        }
        if ((chatType === "reclamacao" || chatType === "mediacao") && selectedClient && selectedClient.claims.length > 0) {
            return String(selectedClient.claims[0]);
        }
        return null;
    }, [chatType, selectedClient, claimIdParam, selectedClaimId]);

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

    const posPurchaseMessagingStatusQuery = usePosPurchaseMessagingStatus(
        activeOrderId,
        chatType === "pos_venda" && Boolean(selectedClient)
    );

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

    const posPurchaseStatus = useMemo(() => {
        if (!selectedClient || chatType !== "pos_venda") return undefined;
        const data = posPurchaseMessagingStatusQuery.data;
        if (!data?.success || !data.data) return undefined;
        return data.data;
    }, [chatType, posPurchaseMessagingStatusQuery.data, selectedClient]);

    const showClientsList = !isMobile || !selectedClient;
    const showChatArea = !isMobile || !!selectedClient;

    return (
        <div className="h-[calc(100dvh-180px)] md:h-[calc(100dvh-180px)] lg:h-[calc(100vh-200px)] flex flex-col lg:flex-row gap-4 min-h-0">
            {/* Lista de clientes - no mobile só aparece quando nenhum chat está selecionado */}
            {showClientsList && (
                <div className={`w-full flex flex-col gap-4 ${isMobile ? "flex-1 min-h-0" : "lg:w-[40%] lg:min-w-[250px]"}`}>
                    <ClientsFilters
                        value={filters}
                        onChange={handleFiltersChange}
                        onReset={resetFilters}
                        onSubmit={applyFilters}
                        isSubmitting={clientsQuery.isLoading}
                    />

                    <div className="flex flex-col flex-1 overflow-hidden min-h-0">
                        <div className="mb-2 shrink-0">
                            <h2 className="text-xl font-semibold text-beergam-typography-primary">
                                Clientes
                            </h2>
                            <p className="text-xs text-beergam-typography-secondary">
                                {clients.length} cliente{clients.length !== 1 ? "s" : ""} encontrado
                                {clients.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                        <div className="flex-1 overflow-hidden min-h-0">
                            <ClientsList
                                clients={clients}
                                selectedClientId={selectedClient?.client_id}
                                loading={clientsQuery.isLoading}
                                onClientSelect={handleClientSelect}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Área do chat - no mobile só aparece quando um cliente está selecionado */}
            {showChatArea && (
                <div className="flex-1 flex flex-col min-w-0 min-h-0">
                    <ChatArea
                    sender={transformClientToChatUserDetails(selectedClient)}
                    messages={messages}
                    chatType={chatType}
                    isLoading={isLoadingMessages}
                    onChatTypeChange={handleChatTypeChange}
                    hasClaims={selectedClient ? selectedClient.claims.length > 0 : false}
                    client={selectedClient || undefined}
                    activeOrderId={activeOrderId}
                    activeClaimId={activeClaimId}
                    onOrderChange={() => setShowOrderSelection(true)}
                    onClaimChange={() => setShowClaimSelection(true)}
                    posPurchaseStatus={posPurchaseStatus}
                    backToPath={isMobile ? "/interno/atendimento/chat" : undefined}
                />
                </div>
            )}

            {selectedClient && (
                <>
                    <OrderSelectionModal
                        isOpen={showOrderSelection}
                        onClose={() => setShowOrderSelection(false)}
                        orderIds={selectedClient.orders}
                        onSelect={handleOrderSelect}
                        currentOrderId={activeOrderId}
                    />
                    <ClaimSelectionModal
                        isOpen={showClaimSelection}
                        onClose={() => setShowClaimSelection(false)}
                        claimIds={selectedClient.claims}
                        onSelect={handleClaimSelect}
                        currentClaimId={activeClaimId}
                    />
                </>
            )}
        </div>
    );
}

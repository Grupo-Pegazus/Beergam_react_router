import { memo, useRef } from "react";
import { Paper } from "@mui/material";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Client } from "../../typings";
import ClientCard from "./ClientCard";
import ClientsListSkeleton from "./ClientsListSkeleton";

export interface ClientsListProps {
    clients: Client[];
    selectedClientId?: string;
    loading?: boolean;
    onClientSelect?: (client: Client) => void;
}

const ESTIMATED_CARD_HEIGHT = 140;

function ClientsListComponent({
    clients,
    selectedClientId,
    loading = false,
    onClientSelect,
}: ClientsListProps) {
    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: clients.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => ESTIMATED_CARD_HEIGHT,
        overscan: 5,
        getItemKey: (index) => {
            const client = clients[index];
            return client?.client_id || `client-${index}`;
        },
    });

    if (loading) {
        return <ClientsListSkeleton />;
    }

    if (clients.length === 0) {
        return (
            <Paper className="p-6 text-center bg-beergam-section-background! border border-beergam-section-border rounded-xl">
                <p className="text-beergam-typography-secondary">
                    Nenhum cliente encontrado
                </p>
            </Paper>
        );
    }

    return (
        <div
            ref={parentRef}
            className="h-full overflow-y-auto"
            style={{
                contain: "strict",
            }}
        >
            <div
                style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                }}
            >
                {virtualizer.getVirtualItems().map((virtualItem) => {
                    const client = clients[virtualItem.index];
                    const uniqueKey = client?.client_id || `client-${virtualItem.index}`;

                    if (!client) {
                        return null;
                    }

                    return (
                        <div
                            key={uniqueKey}
                            data-index={virtualItem.index}
                            ref={virtualizer.measureElement}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                transform: `translateY(${virtualItem.start}px)`,
                            }}
                            className="pb-2"
                        >
                            <ClientCard
                                client={client}
                                selected={selectedClientId === client.client_id}
                                onSelect={onClientSelect}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export const ClientsList = memo(ClientsListComponent, (prevProps, nextProps) => {
    // Se loading mudou, precisa re-renderizar
    if (prevProps.loading !== nextProps.loading) return false;

    // Se selectedClientId mudou, precisa re-renderizar apenas se realmente mudou
    if (prevProps.selectedClientId !== nextProps.selectedClientId) return false;

    // Se o número de clientes mudou, precisa re-renderizar
    if (prevProps.clients.length !== nextProps.clients.length) return false;

    // Se a função de callback mudou, precisa re-renderizar
    if (prevProps.onClientSelect !== nextProps.onClientSelect) return false;

    if (prevProps.clients === nextProps.clients) return true;

    const prevFirst = prevProps.clients[0]?.client_id;
    const nextFirst = nextProps.clients[0]?.client_id;
    const prevLast = prevProps.clients[prevProps.clients.length - 1]?.client_id;
    const nextLast = nextProps.clients[nextProps.clients.length - 1]?.client_id;

    return prevFirst === nextFirst && prevLast === nextLast;
});

ClientsList.displayName = "ClientsList";

export default ClientsList;

import { Paper } from "@mui/material";
import { memo, useState } from "react";
import BeergamButton from "~/src/components/utils/BeergamButton";
import type { Client } from "../../typings";
import ClaimSelectionModal from "./ClaimSelectionModal";
import OrderSelectionModal from "./OrderSelectionModal";

export interface ClientInfoProps {
    client?: Client;
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

function ClientInfoComponent({ client }: ClientInfoProps) {
    const [showOrdersModal, setShowOrdersModal] = useState(false);
    const [showClaimsModal, setShowClaimsModal] = useState(false);

    if (!client) {
        return (
            <Paper className="p-6 text-center bg-beergam-section-background! border border-beergam-section-border rounded-xl h-full">
                <p className="text-beergam-typography-secondary">
                    Selecione um cliente para ver as informações
                </p>
            </Paper>
        );
    }

    return (
        <div className="flex flex-col gap-4 h-full overflow-y-auto">
            <Paper className="p-4 bg-beergam-section-background! border border-beergam-section-border rounded-xl">
                <h3 className="text-lg font-semibold text-beergam-typography-primary mb-4">
                    Informações do Cliente
                </h3>

                <div className="flex flex-col gap-4">
                    {/* Informações básicas */}
                    <div className="grid grid-cols-3 space-y-2">
                        <div>
                            <p className="text-xs text-beergam-typography-secondary mb-1">
                                Apelido
                            </p>
                            <p className="text-sm font-medium text-beergam-typography-tertiary!">
                                {client.nickname}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-beergam-typography-secondary mb-1">
                                Nome Completo
                            </p>
                            <p className="text-sm font-medium text-beergam-typography-tertiary!">
                                {client.receiver_name}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-beergam-typography-secondary mb-1">
                                Documento
                            </p>
                            <p className="text-sm font-medium text-beergam-typography-tertiary!">
                                {client.receiver_document.id}: {client.receiver_document.value}
                            </p>
                        </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="pt-4 border-t border-beergam-section-border">
                        <h4 className="text-sm font-semibold text-beergam-typography-primary mb-3">
                            Estatísticas
                        </h4>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-beergam-typography-secondary">
                                    Total de Pedidos
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-beergam-typography-primary">
                                        {client.total_orders}
                                    </span>
                                    {client.orders.length > 0 && (
                                        <BeergamButton
                                            title="Ver pedidos"
                                            icon="chevron"
                                            onClick={() => setShowOrdersModal(true)}
                                            className="p-1! h-6! w-auto! min-w-auto!"
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-beergam-typography-secondary">
                                    Total Gasto
                                </span>
                                <span className="text-sm font-medium text-beergam-primary">
                                    {formatCurrency(client.total_spent)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-beergam-typography-secondary">
                                    Reclamações
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-beergam-typography-primary">
                                        {client.claims.length}
                                    </span>
                                    {client.claims.length > 0 && (
                                        <BeergamButton
                                            title="Ver reclamações"
                                            icon="chevron"
                                            onClick={() => setShowClaimsModal(true)}
                                            className="p-1! h-6! w-auto! min-w-auto!"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Paper>

            {/* Área de ações extras */}
            <Paper className="p-4 bg-beergam-section-background! border border-beergam-section-border rounded-xl">
                <h3 className="text-lg font-semibold text-beergam-typography-primary mb-4">
                    Ações Extras
                </h3>
                <div className="p-8 text-center">
                    <p className="text-sm text-beergam-typography-secondary">
                        Ações específicas do chat serão implementadas aqui
                    </p>
                </div>
            </Paper>

            {/* Modais de seleção e detalhes */}
            <OrderSelectionModal
                isOpen={showOrdersModal}
                onClose={() => setShowOrdersModal(false)}
                orderIds={client.orders}
            />
            <ClaimSelectionModal
                isOpen={showClaimsModal}
                onClose={() => setShowClaimsModal(false)}
                claimIds={client.claims}
            />
        </div>
    );
}

const ClientInfo = memo(ClientInfoComponent, (prevProps, nextProps) => {
    // Se não há cliente em ambos, não precisa re-renderizar
    if (!prevProps.client && !nextProps.client) return true;

    // Se um tem cliente e outro não, precisa re-renderizar
    if (!prevProps.client || !nextProps.client) return false;

    // Compara apenas o ID do cliente
    return prevProps.client.client_id === nextProps.client.client_id;
});

ClientInfo.displayName = "ClientInfo";

export default ClientInfo;

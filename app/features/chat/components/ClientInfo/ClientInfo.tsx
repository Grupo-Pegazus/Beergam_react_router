import { memo } from "react";
import { Paper } from "@mui/material";
import type { Client } from "../../typings";

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
                    <div className="space-y-2">
                        <div>
                            <p className="text-xs text-beergam-typography-secondary mb-1">
                                Apelido
                            </p>
                            <p className="text-sm font-medium text-beergam-typography-primary">
                                {client.nickname}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-beergam-typography-secondary mb-1">
                                Nome Completo
                            </p>
                            <p className="text-sm font-medium text-beergam-typography-primary">
                                {client.receiver_name}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-beergam-typography-secondary mb-1">
                                Documento
                            </p>
                            <p className="text-sm font-medium text-beergam-typography-primary">
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
                                <span className="text-sm font-medium text-beergam-typography-primary">
                                    {client.total_orders}
                                </span>
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
                                <span className="text-sm font-medium text-beergam-typography-primary">
                                    {client.claims.length}
                                </span>
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

import { Paper, Skeleton } from "@mui/material";
import { useOrderDetails } from "~/features/vendas/hooks";
import Thumbnail from "~/src/components/Thumbnail/Thumbnail";
import Modal from "~/src/components/utils/Modal";
import dayjs from "dayjs";

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
}

export default function OrderDetailsModal({
    isOpen,
    onClose,
    orderId,
}: OrderDetailsModalProps) {
    const { data: orderDetailsResponse, isLoading } = useOrderDetails(orderId);

    const orders = orderDetailsResponse?.data?.orders || [];
    const firstOrder = orders[0];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Detalhes do Pedido ${orderId}`}
            className="z-1000"
            contentClassName="!max-w-4xl !max-h-[90vh] overflow-y-auto"
        >
            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton variant="rectangular" height={200} />
                    <Skeleton variant="rectangular" height={100} />
                    <Skeleton variant="rectangular" height={150} />
                </div>
            ) : firstOrder ? (
                <div className="space-y-4">
                    {/* Informações básicas do pedido */}
                    <Paper className="p-4 bg-beergam-section-background! border border-beergam-section-border">
                        <h4 className="text-lg font-semibold text-beergam-typography-primary mb-3">
                            Informações do Pedido
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-xs text-beergam-typography-secondary mb-1">
                                    Status
                                </p>
                                <p className="font-medium text-beergam-typography-primary">
                                    {firstOrder.status}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-beergam-typography-secondary mb-1">
                                    Data de Criação
                                </p>
                                <p className="font-medium text-beergam-typography-primary">
                                    {dayjs(firstOrder.date_created).format("DD/MM/YYYY HH:mm")}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-beergam-typography-secondary mb-1">
                                    Valor Total
                                </p>
                                <p className="font-medium text-beergam-primary">
                                    {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: firstOrder.currency_id || "BRL",
                                    }).format(parseFloat(firstOrder.total_amount))}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-beergam-typography-secondary mb-1">
                                    Comprador
                                </p>
                                <p className="font-medium text-beergam-typography-primary">
                                    {firstOrder.buyer_nickname}
                                </p>
                            </div>
                        </div>
                    </Paper>

                    {/* Informações do produto */}
                    <Paper className="p-4 bg-beergam-section-background! border border-beergam-section-border">
                        <h4 className="text-lg font-semibold text-beergam-typography-primary mb-3">
                            Produto
                        </h4>
                        <div className="flex flex-col sm:flex-row gap-3 mb-4">
                            {firstOrder.thumbnail && (
                                <Thumbnail thumbnail={firstOrder.thumbnail} />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-beergam-typography-primary mb-2 wrap-break-word">
                                    {firstOrder.title}
                                </p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-xs text-beergam-typography-secondary mb-1">
                                            MLB
                                        </p>
                                        <p className="font-medium text-beergam-typography-primary">
                                            {firstOrder.mlb}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-beergam-typography-secondary mb-1">
                                            Quantidade
                                        </p>
                                        <p className="font-medium text-beergam-typography-primary">
                                            {firstOrder.quantity}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-beergam-typography-secondary mb-1">
                                            Preço Unitário
                                        </p>
                                        <p className="font-medium text-beergam-primary">
                                            {new Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: firstOrder.currency_id || "BRL",
                                            }).format(parseFloat(firstOrder.unit_price))}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Paper>

                    {/* Informações de envio */}
                    {firstOrder.shipping_details && (
                        <Paper className="p-4 bg-beergam-section-background! border border-beergam-section-border">
                            <h4 className="text-lg font-semibold text-beergam-typography-primary mb-3">
                                Envio
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                {firstOrder.tracking_number && (
                                    <div>
                                        <p className="text-xs text-beergam-typography-secondary mb-1">
                                            Código de Rastreamento
                                        </p>
                                        <p className="font-medium text-beergam-typography-primary">
                                            {firstOrder.tracking_number}
                                        </p>
                                    </div>
                                )}
                                {firstOrder.shipment_status && (
                                    <div>
                                        <p className="text-xs text-beergam-typography-secondary mb-1">
                                            Status do Envio
                                        </p>
                                        <p className="font-medium text-beergam-typography-primary">
                                            {firstOrder.shipment_status}
                                        </p>
                                    </div>
                                )}
                                {firstOrder.shipping_details.address_line && (
                                    <div className="col-span-2">
                                        <p className="text-xs text-beergam-typography-secondary mb-1">
                                            Endereço
                                        </p>
                                        <p className="font-medium text-beergam-typography-primary">
                                            {firstOrder.shipping_details.address_line}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Paper>
                    )}
                </div>
            ) : (
                <Paper className="p-6 text-center bg-beergam-section-background! border border-beergam-section-border">
                    <p className="text-beergam-typography-secondary">
                        Não foi possível carregar os detalhes do pedido.
                    </p>
                </Paper>
            )}
        </Modal>
    );
}

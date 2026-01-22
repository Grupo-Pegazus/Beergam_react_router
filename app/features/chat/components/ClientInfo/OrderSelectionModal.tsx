import { Paper } from "@mui/material";
import { useState } from "react";
import BeergamButton from "~/src/components/utils/BeergamButton";
import Modal from "~/src/components/utils/Modal";
import OrderDetailsModal from "./OrderDetailsModal";

interface OrderSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderIds: string[];
}

export default function OrderSelectionModal({
    isOpen,
    onClose,
    orderIds,
}: OrderSelectionModalProps) {
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    const handleOrderSelect = (orderId: string) => {
        setSelectedOrderId(orderId);
    };

    const handleCloseDetails = () => {
        setSelectedOrderId(null);
    };

    if (orderIds.length === 0) {
        return null;
    }

    // Se tiver apenas um pedido, abre direto o modal de detalhes
    if (orderIds.length === 1 && !selectedOrderId) {
        return (
            <>
                <OrderDetailsModal
                    isOpen={isOpen}
                    onClose={onClose}
                    orderId={orderIds[0]}
                />
            </>
        );
    }

    return (
        <>
            <Modal
                isOpen={isOpen && !selectedOrderId}
                onClose={onClose}
                title="Selecione um Pedido"
                className="z-1000"
                contentClassName="!max-w-lg"
            >
                <div className="space-y-2">
                    {orderIds.map((orderId) => (
                        <Paper
                            key={orderId}
                            className="p-4 cursor-pointer hover:bg-beergam-section-background/50 transition-colors border border-beergam-section-border"
                            onClick={() => handleOrderSelect(orderId)}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-beergam-typography-primary">
                                    Pedido: {orderId}
                                </span>
                                <BeergamButton
                                    title="Ver detalhes"
                                    onClick={() => handleOrderSelect(orderId)}
                                />
                            </div>
                        </Paper>
                    ))}
                </div>
            </Modal>

            {selectedOrderId && (
                <OrderDetailsModal
                    isOpen={!!selectedOrderId}
                    onClose={handleCloseDetails}
                    orderId={selectedOrderId}
                />
            )}
        </>
    );
}

import { Paper } from "@mui/material";
import Modal from "~/src/components/utils/Modal";

interface OrderSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderIds: string[];
    onSelect: (orderId: string) => void;
    currentOrderId?: string | null;
}

export default function OrderSelectionModal({
    isOpen,
    onClose,
    orderIds,
    onSelect,
    currentOrderId,
}: OrderSelectionModalProps) {
    if (orderIds.length === 0) {
        return null;
    }

    // Se tiver apenas um pedido, seleciona automaticamente e fecha
    if (orderIds.length === 1) {
        if (!currentOrderId || currentOrderId !== orderIds[0]) {
            // Pequeno delay para evitar problemas de renderização
            setTimeout(() => {
                onSelect(orderIds[0]);
                onClose();
            }, 0);
        }
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Selecione um Pedido"
            className="z-1000"
            contentClassName="!max-w-lg"
        >
            <div className="space-y-2">
                {orderIds.map((orderId) => (
                    <Paper
                        key={orderId}
                        className={`p-4 cursor-pointer hover:bg-beergam-section-background/50 transition-colors border ${currentOrderId === orderId
                            ? "border-beergam-primary! bg-beergam-primary/10!"
                            : "border-beergam-section-border"
                            }`}
                        onClick={() => {
                            onSelect(orderId);
                            onClose();
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-beergam-typography-primary">
                                Pedido: {orderId}
                            </span>
                            {currentOrderId === orderId && (
                                <span className="text-xs text-beergam-primary font-semibold">
                                    Atual
                                </span>
                            )}
                        </div>
                    </Paper>
                ))}
            </div>
        </Modal>
    );
}

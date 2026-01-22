import { Paper } from "@mui/material";
import BeergamButton from "~/src/components/utils/BeergamButton";
import Modal from "~/src/components/utils/Modal";

interface ClaimSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    claimIds: string[];
    onSelect: (claimId: string) => void;
    currentClaimId?: string | null;
}

export default function ClaimSelectionModal({
    isOpen,
    onClose,
    claimIds,
    onSelect,
    currentClaimId,
}: ClaimSelectionModalProps) {
    if (claimIds.length === 0) {
        return null;
    }

    // Se tiver apenas uma reclamação, seleciona automaticamente e fecha
    if (claimIds.length === 1) {
        const singleClaimId = String(claimIds[0]);
        if (!currentClaimId || currentClaimId !== singleClaimId) {
            // Pequeno delay para evitar problemas de renderização
            setTimeout(() => {
                onSelect(singleClaimId);
                onClose();
            }, 0);
        }
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Selecione uma Reclamação"
            className="z-1000"
            contentClassName="!max-w-lg"
        >
            <div className="space-y-2">
                {claimIds.map((claimId) => {
                    const claimIdStr = String(claimId);
                    return (
                        <Paper
                            key={claimIdStr}
                            className={`p-4 cursor-pointer hover:bg-beergam-section-background/50 transition-colors border ${
                                currentClaimId === claimIdStr
                                    ? "border-beergam-primary! bg-beergam-primary/10!"
                                    : "border-beergam-section-border"
                            }`}
                            onClick={() => {
                                onSelect(claimIdStr);
                                onClose();
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-beergam-typography-primary">
                                    Reclamação: {claimIdStr}
                                </span>
                                {currentClaimId === claimIdStr && (
                                    <span className="text-xs text-beergam-primary font-semibold">
                                        Atual
                                    </span>
                                )}
                            </div>
                        </Paper>
                    );
                })}
            </div>
        </Modal>
    );
}

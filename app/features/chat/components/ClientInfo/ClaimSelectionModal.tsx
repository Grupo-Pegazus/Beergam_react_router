import { Paper } from "@mui/material";
import { useState } from "react";
import BeergamButton from "~/src/components/utils/BeergamButton";
import Modal from "~/src/components/utils/Modal";
import ClaimDetailsModal from "./ClaimDetailsModal";

interface ClaimSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    claimIds: string[];
}

export default function ClaimSelectionModal({
    isOpen,
    onClose,
    claimIds,
}: ClaimSelectionModalProps) {
    const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);

    const handleClaimSelect = (claimId: string) => {
        setSelectedClaimId(claimId);
    };

    const handleCloseDetails = () => {
        setSelectedClaimId(null);
    };

    if (claimIds.length === 0) {
        return null;
    }

    // Se tiver apenas uma reclamação, abre direto o modal de detalhes
    if (claimIds.length === 1 && !selectedClaimId) {
        return (
            <>
                <ClaimDetailsModal
                    isOpen={isOpen}
                    onClose={onClose}
                    claimId={claimIds[0]}
                />
            </>
        );
    }

    return (
        <>
            <Modal
                isOpen={isOpen && !selectedClaimId}
                onClose={onClose}
                title="Selecione uma Reclamação"
                className="z-1000"
                contentClassName="!max-w-lg"
            >
                <div className="space-y-2">
                    {claimIds.map((claimId) => (
                        <Paper
                            key={claimId}
                            className="p-4 cursor-pointer hover:bg-beergam-section-background/50 transition-colors border border-beergam-section-border"
                            onClick={() => handleClaimSelect(claimId)}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-beergam-typography-primary">
                                    Reclamação: {claimId}
                                </span>
                                <BeergamButton
                                    title="Ver detalhes"
                                    onClick={() => handleClaimSelect(claimId)}
                                />
                            </div>
                        </Paper>
                    ))}
                </div>
            </Modal>

            {selectedClaimId && (
                <ClaimDetailsModal
                    isOpen={!!selectedClaimId}
                    onClose={handleCloseDetails}
                    claimId={selectedClaimId}
                />
            )}
        </>
    );
}

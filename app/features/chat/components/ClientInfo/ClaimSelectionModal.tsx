import { Paper, Skeleton } from "@mui/material";
import { useState } from "react";
import BeergamButton from "~/src/components/utils/BeergamButton";
import Modal from "~/src/components/utils/Modal";
import ClaimDetailsModal from "./ClaimDetailsModal";
import { useClaimDetails } from "~/features/chat/hooks/useClaimDetails";

interface ClaimSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    claimIds: string[];
}

function ClaimItem({ claimId, onSelect }: { claimId: string; onSelect: (id: string) => void }) {
    const { data: claimResponse, isLoading } = useClaimDetails(claimId, true);
    const claim = claimResponse?.success ? claimResponse.data : null;
    
    const reputationStatus = claim?.affects_reputation?.affects_reputation || "unknown";
    const reputationLabel =
        reputationStatus === "affected" ? "Afetou Reputação" :
        reputationStatus === "not_affected" ? "Não Afetou Reputação" :
        null;

    if (isLoading) {
        return (
            <Paper className="p-4 border border-beergam-section-border">
                <Skeleton variant="rectangular" height={60} />
            </Paper>
        );
    }

    return (
        <Paper
            className="p-4 cursor-pointer hover:bg-beergam-section-background/50 transition-colors border border-beergam-section-border"
            onClick={() => onSelect(claimId)}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <span className="text-sm font-medium text-beergam-typography-primary">
                        Reclamação: {claimId}
                    </span>
                    {reputationStatus !== "unknown" && reputationLabel && (
                        <span
                            className={`px-2 py-1 rounded-full border text-xs w-fit ${
                                reputationStatus === "affected"
                                    ? "bg-red-500/30 border-red-500/50 text-red-300"
                                    : "bg-green-500/20 border-green-500/40 text-green-300"
                            }`}
                        >
                            {reputationLabel}
                        </span>
                    )}
                </div>
                <BeergamButton
                    title="Ver detalhes"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(claimId);
                    }}
                />
            </div>
        </Paper>
    );
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
                        <ClaimItem
                            key={claimId}
                            claimId={claimId}
                            onSelect={handleClaimSelect}
                        />
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

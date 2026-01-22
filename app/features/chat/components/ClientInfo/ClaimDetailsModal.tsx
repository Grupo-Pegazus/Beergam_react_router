import { Paper, Skeleton } from "@mui/material";
import { useClaimDetails } from "../../hooks";
import { ClaimCard } from "~/features/reclamacoes/components/ClaimsList";
import Modal from "~/src/components/utils/Modal";

interface ClaimDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    claimId: string;
}

export default function ClaimDetailsModal({
    isOpen,
    onClose,
    claimId,
}: ClaimDetailsModalProps) {
    const { data: claimResponse, isLoading } = useClaimDetails(claimId, isOpen);

    const claim = claimResponse?.success ? claimResponse.data : null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Detalhes da Reclamação ${claimId}`}
            className="z-1000"
            contentClassName="!max-w-4xl !max-h-[90vh] overflow-y-auto"
        >
            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton variant="rectangular" height={200} />
                    <Skeleton variant="rectangular" height={100} />
                    <Skeleton variant="rectangular" height={150} />
                </div>
            ) : claim ? (
                <div className="space-y-4">
                    {/* Usa o ClaimCard existente para manter consistência */}
                    <ClaimCard claim={claim} />
                </div>
            ) : (
                <Paper className="p-6 text-center bg-beergam-section-background! border border-beergam-section-border">
                    <p className="text-beergam-typography-secondary">
                        Não foi possível carregar os detalhes da reclamação.
                    </p>
                </Paper>
            )}
        </Modal>
    );
}

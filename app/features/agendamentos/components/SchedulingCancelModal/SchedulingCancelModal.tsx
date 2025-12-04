import { useState, useEffect } from "react";
import Modal from "~/src/components/utils/Modal";
import { Fields } from "~/src/components/utils/_fields";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { useCancelScheduling, useScheduling } from "../../hooks";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import Loading from "~/src/assets/loading";
import type { Scheduling } from "../../typings";

interface SchedulingCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduling?: Scheduling | null;
  schedulingId?: string | null;
}

export default function SchedulingCancelModal({
  isOpen,
  onClose,
  scheduling: schedulingProp,
  schedulingId,
}: SchedulingCancelModalProps) {
  const cancelMutation = useCancelScheduling();
  const { data: schedulingData } = useScheduling(schedulingId ?? null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const scheduling = schedulingProp || (schedulingData?.success ? schedulingData.data : null);

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!reason.trim() || reason.trim().length < 2) {
      setError("Motivo deve ter pelo menos 2 caracteres");
      return;
    }

    if (reason.length > 500) {
      setError("Motivo deve ter no máximo 500 caracteres");
      return;
    }

    if (!scheduling) return;

    try {
      await cancelMutation.mutateAsync({
        id: scheduling.id,
        data: { reason: reason.trim() },
      });
      onClose();
    } catch {
      // Erro já é tratado no hook
    }
  };

  const isLoading = cancelMutation.isPending;

  if (!scheduling && schedulingId) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Cancelar Agendamento">
        <AsyncBoundary
          isLoading={true}
          error={null}
          Skeleton={Loading}
          ErrorFallback={() => (
            <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
              Não foi possível carregar os dados do agendamento.
            </div>
          )}
        >
          <div>Carregando...</div>
        </AsyncBoundary>
      </Modal>
    );
  }

  if (!scheduling) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancelar Agendamento"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Fields.wrapper>
          <Fields.label text="Motivo do cancelamento" required />
          <Fields.input
            type="text"
            placeholder="Digite o motivo do cancelamento..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            error={error || undefined}
            disabled={isLoading}
          />
          <div className="text-xs text-gray-500 mt-1">
            {reason.length}/500 caracteres
          </div>
        </Fields.wrapper>

        <div className="flex gap-3 justify-end mt-4">
          <BeergamButton
            title="Fechar"
            mainColor="beergam-gray"
            animationStyle="fade"
            onClick={onClose}
            disabled={isLoading}
            type="button"
          />
          <BeergamButton
            title={isLoading ? "Cancelando..." : "Cancelar Agendamento"}
            mainColor="beergam-red"
            animationStyle="slider"
            disabled={isLoading || !reason.trim()}
            type="submit"
            fetcher={{
              fecthing: isLoading,
              completed: false,
              error: false,
              mutation: cancelMutation,
            }}
          />
        </div>
      </form>
    </Modal>
  );
}


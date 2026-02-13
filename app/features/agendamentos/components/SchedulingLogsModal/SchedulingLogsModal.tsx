import { Stack, Typography, Chip } from "@mui/material";
import Modal from "~/src/components/utils/Modal";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { useSchedulingLogs } from "../../hooks";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import Loading from "~/src/assets/loading";
import { formatDateTime } from "../../utils";
import MainCards from "~/src/components/ui/MainCards";
import Svg from "~/src/assets/svgs/_index";

interface SchedulingLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedulingId: string | null;
}

const getActionLabel = (action: string): string => {
  const actionMap: Record<string, string> = {
    CREATED: "Criado",
    UPDATED: "Atualizado",
    DELETED: "Deletado",
    CANCELLED: "Cancelado",
  };
  return actionMap[action] || action;
};

const getActionColor = (action: string): { bg: string; color: string } => {
  switch (action) {
    case "CREATED":
      return { bg: "var(--color-beergam-green)", color: "var(--color-beergam-green-dark)" };
    case "UPDATED":
      return { bg: "var(--color-beergam-primary-light)", color: "var(--color-beergam-primary)" };
    case "DELETED":
    case "CANCELLED":
      return { bg: "var(--color-beergam-red)", color: "var(--color-beergam-red-dark)" };
    default:
      return { bg: "var(--color-beergam-gray)", color: "var(--color-beergam-gray-dark)" };
  }
};

export default function SchedulingLogsModal({
  isOpen,
  onClose,
  schedulingId,
}: SchedulingLogsModalProps) {
  const { data, isLoading, error } = useSchedulingLogs(schedulingId);
  const logs = data?.success ? data.data?.logs || [] : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Histórico de Logs"
      contentClassName="max-w-4xl"
    >
      <AsyncBoundary
        isLoading={isLoading}
        error={error as unknown}
        Skeleton={Loading}
        ErrorFallback={() => (
          <div className="rounded-2xl border border-beergam-red bg-beergam-red/10 text-beergam-red p-4">
            Não foi possível carregar os logs do agendamento.
          </div>
        )}
      >
        {logs.length === 0 ? (
          <div className="text-center py-8 text-beergam-typography-secondary">
            <Svg.information_circle tailWindClasses="h-10 w-10 mx-auto mb-2 text-beergam-typography-secondary" />
            <Typography variant="body1" className="text-beergam-typography-secondary">
              Nenhum log encontrado para este agendamento.
            </Typography>
          </div>
        ) : (
          <Stack spacing={2}>
            {logs.map((log) => {
              const actionColor = getActionColor(log.action);
              return (
                <MainCards key={log.id} className="p-4 bg-beergam-section-background border border-beergam-section-border rounded-lg">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Chip
                            label={getActionLabel(log.action)}
                            size="small"
                            sx={{
                              height: 24,
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              backgroundColor: actionColor.bg,
                              color: actionColor.color,
                            }}
                          />
                          <Typography variant="caption" className="text-beergam-typography-secondary text-xs">
                            {formatDateTime(log.created_at)}
                          </Typography>
                        </div>
                        <Typography variant="body2" className="text-beergam-typography-primary">
                          {log.description}
                        </Typography>
                        <Typography variant="caption" className="text-beergam-typography-secondary text-xs mt-1">
                          Ator: <b className="text-beergam-typography-primary">{log.actor_name}</b> - {log.is_master ? "Master" : `Colaborador (${log.actor_pin})`}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </MainCards>
              );
            })}
          </Stack>
        )}

        <div className="flex justify-end mt-6 pt-4 border-t">
          <BeergamButton
            title="Fechar"
            mainColor="beergam-gray"
            animationStyle="fade"
            onClick={onClose}
            type="button"
          />
        </div>
      </AsyncBoundary>
    </Modal>
  );
}


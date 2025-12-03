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
      return { bg: "#d1fae5", color: "#065f46" };
    case "UPDATED":
      return { bg: "#e0f2fe", color: "#0369a1" };
    case "DELETED":
    case "CANCELLED":
      return { bg: "#fee2e2", color: "#991b1b" };
    default:
      return { bg: "#f3f4f6", color: "#374151" };
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
          <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
            Não foi possível carregar os logs do agendamento.
          </div>
        )}
      >
        {logs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Svg.information_circle tailWindClasses="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <Typography variant="body1" color="text.secondary">
              Nenhum log encontrado para este agendamento.
            </Typography>
          </div>
        ) : (
          <Stack spacing={2}>
            {logs.map((log) => {
              const actionColor = getActionColor(log.action);
              return (
                <MainCards key={log.id} className="p-4">
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
                          <Typography variant="caption" color="text.secondary" className="text-xs">
                            {formatDateTime(log.created_at)}
                          </Typography>
                        </div>
                        <Typography variant="body2" className="text-slate-700">
                          {log.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" className="text-xs mt-1">
                          Ator: <b>{log.actor_name}</b> - {log.is_master ? "Master" : `Colaborador (${log.actor_pin})`}
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


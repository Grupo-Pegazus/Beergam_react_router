import { Chip, Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField } from "@mui/material";
import Modal from "~/src/components/utils/Modal";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { useScheduling } from "../../hooks";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import Loading from "~/src/assets/loading";
import {
  formatDateTime,
  formatSchedulingStatus,
  formatSchedulingType,
  formatItemStatus,
  formatCurrency,
  calculateItemsTotal,
  getStatusColor,
  getItemStatusColor,
} from "../../utils";
import CopyButton from "~/src/components/ui/CopyButton";
import type { Scheduling } from "../../typings";

interface SchedulingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedulingId: string | null;
  onEdit?: (scheduling: Scheduling) => void;
  onCancel?: (scheduling: Scheduling) => void;
  onReceive?: (scheduling: Scheduling) => void;
  onViewLogs?: (schedulingId: string) => void;
}

export default function SchedulingDetailsModal({
  isOpen,
  onClose,
  schedulingId,
  onEdit,
  onCancel,
  onReceive,
  onViewLogs,
}: SchedulingDetailsModalProps) {
  const { data, isLoading, error } = useScheduling(schedulingId);
  const scheduling = data?.success ? data.data : null;

  if (!isOpen || !schedulingId) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes do Agendamento"
      contentClassName="max-w-5xl"
    >
      <AsyncBoundary
        isLoading={isLoading}
        error={error as unknown}
        Skeleton={Loading}
        ErrorFallback={() => (
          <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
            Não foi possível carregar os detalhes do agendamento.
          </div>
        )}
      >
        {scheduling && (
          <div className="flex flex-col gap-6">
            {/* Informações Gerais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="caption" color="text.secondary" className="text-xs">
                  ID do Agendamento
                </Typography>
                <div className="flex items-center gap-2 mt-1">
                  <Typography variant="body2" className="font-mono text-sm">
                    {scheduling.id}
                  </Typography>
                  <CopyButton
                    textToCopy={scheduling.id}
                    successMessage="ID copiado"
                    ariaLabel="Copiar ID"
                  />
                </div>
              </div>

              <div>
                <Typography variant="caption" color="text.secondary" className="text-xs">
                  Título
                </Typography>
                <Typography variant="body1" fontWeight={600} className="mt-1">
                  {scheduling.title}
                </Typography>
              </div>

              <div>
                <Typography variant="caption" color="text.secondary" className="text-xs">
                  Tipo
                </Typography>
                <div className="mt-1">
                  <Chip
                    label={formatSchedulingType(scheduling.type)}
                    size="small"
                    sx={{
                      height: 24,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      backgroundColor: scheduling.type === "ENTRY" ? "#e0f2fe" : "#fef3c7",
                      color: scheduling.type === "ENTRY" ? "#0369a1" : "#92400e",
                    }}
                  />
                </div>
              </div>

              <div>
                <Typography variant="caption" color="text.secondary" className="text-xs">
                  Status
                </Typography>
                <div className="mt-1">
                  <Chip
                    label={formatSchedulingStatus(scheduling.status)}
                    size="small"
                    sx={{
                      height: 24,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      backgroundColor:
                        getStatusColor(scheduling.status) === "warning"
                          ? "#fef3c7"
                          : getStatusColor(scheduling.status) === "success"
                            ? "#d1fae5"
                            : "#fee2e2",
                      color:
                        getStatusColor(scheduling.status) === "warning"
                          ? "#92400e"
                          : getStatusColor(scheduling.status) === "success"
                            ? "#065f46"
                            : "#991b1b",
                    }}
                  />
                </div>
              </div>

              <div>
                <Typography variant="caption" color="text.secondary" className="text-xs">
                  Data Prevista
                </Typography>
                <Typography variant="body2" className="mt-1">
                  {formatDateTime(scheduling.estimated_arrival_date)}
                </Typography>
              </div>

              <div>
                <Typography variant="caption" color="text.secondary" className="text-xs">
                  Criado em
                </Typography>
                <Typography variant="body2" className="mt-1">
                  {formatDateTime(scheduling.created_at)}
                </Typography>
              </div>

              {scheduling.updated_at && (
                <div>
                  <Typography variant="caption" color="text.secondary" className="text-xs">
                    Atualizado em
                  </Typography>
                  <Typography variant="body2" className="mt-1">
                    {formatDateTime(scheduling.updated_at)}
                  </Typography>
                </div>
              )}

              {scheduling.observation && (
                <div className="md:col-span-2">
                  <Typography variant="caption" color="text.secondary" className="text-xs">
                    Observação
                  </Typography>
                  <TextField
                    multiline
                    rows={3}
                    value={scheduling.observation}
                    disabled
                    fullWidth
                    variant="outlined"
                    sx={{
                      mt: 1,
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#f9fafb",
                        borderRadius: "8px",
                      },
                    }}
                  />
                </div>
              )}
            </div>

            <Divider />

            {/* Itens do Agendamento */}
            <div>
              <Typography variant="h6" className="mb-4">
                Itens do Agendamento ({scheduling.items.length})
              </Typography>

              {scheduling.items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum item cadastrado neste agendamento.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Produto/Variação</TableCell>
                        <TableCell align="right">Quantidade</TableCell>
                        <TableCell align="right">Qtd. Recebida</TableCell>
                        <TableCell align="right">Preço Unitário</TableCell>
                        <TableCell align="right">Valor Total</TableCell>
                        <TableCell align="center">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {scheduling.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.title ? (
                              <Typography variant="body2">
                                {item.product_id ? (
                                  <>Produto: <b>{item.title}</b></>
                                ) : (
                                  <>Variação: <b>{item.title}</b></>
                                )}
                              </Typography>
                            ) : (
                              <Typography variant="body2">
                                {item.product_id ? (
                                  <>Produto ID: <b>{item.product_id}</b></>
                                ) : (
                                  <>Variação ID: <b>{item.product_variation_id}</b></>
                                )}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">{item.quantity}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {item.received_quantity ?? "-"}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {formatCurrency(item.unity_price)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={600}>
                              {formatCurrency(item.total_price)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={formatItemStatus(item.status)}
                              size="small"
                              sx={{
                                height: 22,
                                fontSize: "0.65rem",
                                fontWeight: 600,
                                backgroundColor:
                                  getItemStatusColor(item.status) === "warning"
                                    ? "#fef3c7"
                                    : getItemStatusColor(item.status) === "success"
                                      ? "#d1fae5"
                                      : getItemStatusColor(item.status) === "error"
                                        ? "#fee2e2"
                                        : "#e0f2fe",
                                color:
                                  getItemStatusColor(item.status) === "warning"
                                    ? "#92400e"
                                    : getItemStatusColor(item.status) === "success"
                                      ? "#065f46"
                                      : getItemStatusColor(item.status) === "error"
                                        ? "#991b1b"
                                        : "#0369a1",
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {scheduling.items.length > 0 && (
                <div className="mt-4 flex justify-end">
                  <div className="text-right">
                    <Typography variant="caption" color="text.secondary" className="text-xs">
                      Valor Total
                    </Typography>
                    <Typography variant="h6" fontWeight={700} className="text-slate-900">
                      {formatCurrency(calculateItemsTotal(scheduling.items))}
                    </Typography>
                  </div>
                </div>
              )}
            </div>

            <Divider />

            {/* Botões de Ação */}
            <div className="flex flex-wrap gap-3 justify-end">
              {onViewLogs && (
                <BeergamButton
                  title="Ver Logs"
                  mainColor="beergam-blue-primary"
                  animationStyle="fade"
                  onClick={() => {
                    onViewLogs(scheduling.id);
                    onClose();
                  }}
                  type="button"
                />
              )}
              {scheduling.status === "PENDING" && onEdit && (
                <BeergamButton
                  title="Editar"
                  mainColor="beergam-orange"
                  animationStyle="fade"
                  onClick={() => {
                    onEdit(scheduling);
                    onClose();
                  }}
                  type="button"
                />
              )}
              {scheduling.status !== "CANCELLED" && onCancel && (
                <BeergamButton
                  title="Cancelar"
                  mainColor="beergam-red"
                  animationStyle="fade"
                  onClick={() => {
                    onCancel(scheduling);
                    onClose();
                  }}
                  type="button"
                />
              )}
              {scheduling.status === "PENDING" && onReceive && (
                <BeergamButton
                  title="Dar Baixa"
                  mainColor="beergam-green"
                  animationStyle="slider"
                  onClick={() => {
                    onReceive(scheduling);
                    onClose();
                  }}
                  type="button"
                />
              )}
              <BeergamButton
                title="Fechar"
                mainColor="beergam-gray"
                animationStyle="fade"
                onClick={onClose}
                type="button"
              />
            </div>
          </div>
        )}
      </AsyncBoundary>
    </Modal>
  );
}


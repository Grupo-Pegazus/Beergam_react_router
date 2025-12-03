import { useState, useEffect, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Checkbox } from "@mui/material";
import Modal from "~/src/components/utils/Modal";
import { Fields } from "~/src/components/utils/_fields";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { useReceiveScheduling, useScheduling } from "../../hooks";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import Loading from "~/src/assets/loading";
import type { Scheduling } from "../../typings";

interface SchedulingReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduling?: Scheduling | null;
  schedulingId?: string | null;
}

export default function SchedulingReceiptModal({
  isOpen,
  onClose,
  scheduling: schedulingProp,
  schedulingId,
}: SchedulingReceiptModalProps) {
  const receiveMutation = useReceiveScheduling();
  const [forceWithoutSync, setForceWithoutSync] = useState(false);
  const [receiptItems, setReceiptItems] = useState<
    Record<number, { received_quantity: number; error?: string }>
  >({});

  // Buscar agendamento atualizado se tiver ID
  const { data: schedulingData } = useScheduling(
    schedulingId ?? schedulingProp?.id ?? null
  );
  const currentScheduling =
    schedulingProp || (schedulingData?.success ? schedulingData.data : null);

  useEffect(() => {
    if (isOpen && currentScheduling) {
      // Inicializar com quantidade pendente para cada item
      const initialItems: Record<number, { received_quantity: number; error?: string }> = {};
      currentScheduling.items.forEach((item) => {
        const pendingQuantity = item.quantity - (item.received_quantity || 0);
        if (pendingQuantity > 0) {
          initialItems[item.id] = {
            received_quantity: pendingQuantity,
          };
        }
      });
      setReceiptItems(initialItems);
      setForceWithoutSync(false);
    }
  }, [isOpen, currentScheduling]);

  const pendingItems = useMemo(() => {
    if (!currentScheduling) return [];
    return currentScheduling.items.filter((item) => {
      const pendingQuantity = item.quantity - (item.received_quantity || 0);
      return pendingQuantity > 0;
    });
  }, [currentScheduling]);

  const handleQuantityChange = (itemId: number, quantity: number) => {
    const item = currentScheduling?.items.find((i) => i.id === itemId);
    if (!item) return;

    const error =
      quantity < 1 ? "Quantidade deve ser maior que zero" : undefined;

    setReceiptItems((prev) => ({
      ...prev,
      [itemId]: {
        received_quantity: quantity,
        error,
      },
    }));
  };

  const validate = (): boolean => {
    if (pendingItems.length === 0) return false;

    const hasErrors = Object.values(receiptItems).some((item) => item.error);
    const hasValidItems = Object.values(receiptItems).some(
      (item) => item.received_quantity > 0
    );

    return !hasErrors && hasValidItems;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !currentScheduling) return;

    const items = Object.entries(receiptItems)
      .filter(([, item]) => item.received_quantity > 0)
      .map(([itemId, item]) => ({
        item_id: parseInt(itemId),
        received_quantity: item.received_quantity,
      }));

    try {
      await receiveMutation.mutateAsync({
        id: currentScheduling.id,
        data: {
          items,
          force_without_sync: forceWithoutSync,
        },
      });
      onClose();
    } catch {
      // Erro já é tratado no hook
    }
  };

  const isLoading = receiveMutation.isPending;

  if (!currentScheduling) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dar Baixa - Recebimento de Itens"
      contentClassName="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AsyncBoundary
          isLoading={false}
          error={null}
          Skeleton={Loading}
          ErrorFallback={() => null}
        >
          {pendingItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Todos os itens deste agendamento já foram recebidos.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Quantidade</TableCell>
                      <TableCell align="right">Já Recebido</TableCell>
                      <TableCell align="right">Pendente</TableCell>
                      <TableCell align="right">Quantidade a Receber</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingItems.map((item) => {
                      const pendingQuantity = item.quantity - (item.received_quantity || 0);
                      const receiptItem = receiptItems[item.id];

                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.title ? (
                              <span>
                                {item.product_id ? (
                                  <>Produto: <b>{item.title}</b></>
                                ) : (
                                  <>Variação: <b>{item.title}</b></>
                                )}
                              </span>
                            ) : (
                              <span>
                                {item.product_id ? (
                                  <>Produto ID: {item.product_id}</>
                                ) : (
                                  <>Variação ID: {item.product_variation_id}</>
                                )}
                              </span>
                            )}
                          </TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">{item.received_quantity || 0}</TableCell>
                          <TableCell align="right">
                            <span className="font-semibold">{pendingQuantity}</span>
                          </TableCell>
                          <TableCell align="right">
                            <Fields.input
                              type="number"
                              min={1}
                              step={1}
                              value={receiptItem?.received_quantity ?? pendingQuantity}
                              onChange={(e) =>
                                handleQuantityChange(item.id, parseInt(e.target.value) || 0)
                              }
                              error={receiptItem?.error}
                              disabled={isLoading}
                              tailWindClasses="w-24"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={forceWithoutSync}
                    onChange={(e) => setForceWithoutSync(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span className="text-sm text-gray-700">
                    Forçar baixa sem sincronização de estoque
                  </span>
                </label>
              </div>
            </>
          )}
        </AsyncBoundary>

        <div className="flex gap-3 justify-end mt-4 pt-4 border-t">
          <BeergamButton
            title="Fechar"
            mainColor="beergam-gray"
            animationStyle="fade"
            onClick={onClose}
            disabled={isLoading}
            type="button"
          />
          <BeergamButton
            title={isLoading ? "Processando..." : "Processar Baixa"}
            mainColor="beergam-green"
            animationStyle="slider"
            disabled={isLoading || !validate()}
            type="submit"
            fetcher={{
              fecthing: isLoading,
              completed: false,
              error: false,
              mutation: receiveMutation,
            }}
          />
        </div>
      </form>
    </Modal>
  );
}


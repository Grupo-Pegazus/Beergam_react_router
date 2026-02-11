import { Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import PaginationBar from "~/src/components/ui/PaginationBar";
import { usePageFromSearchParams } from "~/src/hooks/usePageFromSearchParams";
import Alert from "~/src/components/utils/Alert";
import type { ModalOptions } from "~/src/components/utils/Modal/ModalContext";
import { useModal } from "~/src/components/utils/Modal/useModal";
import { useOrders, useOrdersReprocessQuota, useReprocessOrders } from "../../hooks";
import type { Order, OrdersFilters } from "../../typings";
import OrderCard from "./OrderCard";
import OrderListSkeleton from "./OrderListSkeleton";
import OrderPackage from "./OrderPackage";

interface OrderListProps {
  filters?: Partial<OrdersFilters>;
  /** Quando true, a página é lida/escrita na URL (`?page=N`). @default false */
  syncPageWithUrl?: boolean;
}

export default function OrderList({ filters = {}, syncPageWithUrl = false }: OrderListProps) {
  const [page, setPage] = useState(filters.page ?? 1);
  const [perPage, setPerPage] = useState(filters.per_page ?? 20);
  const [reprocessingKey, setReprocessingKey] = useState<string | null>(null);
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    if (!syncPageWithUrl) setPage(filters.page ?? 1);
  }, [filters.page, syncPageWithUrl]);

  useEffect(() => {
    setPerPage(filters.per_page ?? 20);
  }, [filters.per_page]);

  const { page: pageFromUrl } = usePageFromSearchParams();
  const effectivePage = syncPageWithUrl ? pageFromUrl : page;

  const { data, isLoading, error } = useOrders({
    ...filters,
    page: effectivePage,
    per_page: perPage,
  });
  const { data: quotaData } = useOrdersReprocessQuota();
  const reprocessMutation = useReprocessOrders();

  const orders = useMemo(() => {
    if (!data?.success || !data.data?.orders) return [];
    return data.data.orders;
  }, [data]);

  /**
   * A lista final é uma sequência de “itens de lista”, onde cada item é:
   * - um pack (vários pedidos com o mesmo pack_id), ou
   * - um pedido standalone.
   */
  type OrderListItem =
    | { type: "pack"; packId: string; orders: Order[] }
    | { type: "single"; order: Order };

  const listItems = useMemo<OrderListItem[]>(() => {
    if (!orders.length) return [];

    const packMap: Map<string, Order[]> = new Map();
    const standaloneCandidates: Order[] = [];

    orders.forEach((order) => {
      const packId = order.pack_id;
      if (packId) {
        if (!packMap.has(packId)) {
          packMap.set(packId, []);
        }
        packMap.get(packId)!.push(order);
      } else {
        standaloneCandidates.push(order);
      }
    });

    // Packs com apenas 1 pedido não são carrinhos: viram pedidos standalone.
    const validPacks: Map<string, Order[]> = new Map();
    const standaloneOrders: Order[] = [...standaloneCandidates];

    packMap.forEach((packOrders, packId) => {
      if (packOrders.length >= 2) {
        validPacks.set(packId, packOrders);
      } else {
        standaloneOrders.push(...packOrders);
      }
    });

    const seenPacks = new Set<string>();
    const items: OrderListItem[] = [];

    orders.forEach((order) => {
      const packId = order.pack_id;

      if (packId && validPacks.has(packId)) {
        // É um pack válido (2+ pedidos)
        if (!seenPacks.has(packId)) {
          seenPacks.add(packId);
          items.push({
            type: "pack",
            packId,
            orders: validPacks.get(packId)!,
          });
        }
        // Se já vimos esse packId, não adicionamos de novo (evita duplicar).
      } else {
        // Pedido standalone (sem pack_id ou pack com apenas 1 pedido)
        items.push({
          type: "single",
          order,
        });
      }
    });

    return items;
  }, [orders]);

  const pagination = data?.success ? data.data?.pagination : null;
  const totalPages = pagination?.total_pages ?? 1;
  const totalCount = pagination?.total_count ?? orders.length;
  const remainingQuota = quotaData?.success ? quotaData.data?.remaining ?? 0 : 0;

  const [, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (!syncPageWithUrl || isLoading || totalPages < 1 || pageFromUrl <= totalPages) return;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", String(totalPages));
        return next;
      },
      { replace: true }
    );
  }, [syncPageWithUrl, isLoading, totalPages, pageFromUrl, setSearchParams]);

  const handlePageChange = (nextPage: number) => {
    if (!syncPageWithUrl) setPage(nextPage);
  };

  return (
    <>
      <div id="order-list">
        <AsyncBoundary
          isLoading={isLoading}
          error={error as unknown}
          Skeleton={OrderListSkeleton}
          ErrorFallback={() => (
            <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
              Não foi possível carregar os pedidos.
            </div>
          )}
        >
          <div className="flex flex-col gap-2 w-full min-w-0">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <Typography variant="h6" color="text.secondary">
                  Nenhum pedido encontrado com os filtros atuais.
                </Typography>
              </div>
            ) : (
              <div className="flex flex-col gap-2 w-full min-w-0">
                {listItems.map((item) =>
                  item.type === "pack" ? (
                    <OrderPackage
                      key={`pack-${item.packId}`}
                      packId={item.packId}
                      orders={item.orders}
                      onReprocess={() => {
                        const orderIds = item.orders
                          .map((o) => o.order_id)
                          .filter(Boolean);

                        if (!orderIds.length) {
                          return;
                        }
                        if (orderIds.length > 30) {
                          return;
                        }
                        if (remainingQuota < orderIds.length) {
                          return;
                        }
                        const options: ModalOptions = {
                          title: "Confirmar reprocessamento de carrinho",
                        };

                        openModal(
                          <Alert
                            type="info"
                            confirmText="Reprocessar"
                            onClose={closeModal}
                            onConfirm={() => {
                              setReprocessingKey(`pack-${item.packId}`);
                              reprocessMutation.mutate(orderIds, {
                                onSettled: () => setReprocessingKey(null),
                              });
                            }}
                          >
                            <h3 className="text-lg font-semibold text-beergam-typography-primary mb-2">
                              Reprocessar {orderIds.length} pedido(s) do carrinho{" "}
                              <span className="font-mono">#{item.packId}</span>?
                            </h3>
                            <p className="text-sm text-beergam-typography-secondary mb-2">
                              Isso irá buscar novamente os dados desses pedidos no Mercado Livre e atualizar os registros aqui no Beergam.
                            </p>
                            <p className="text-xs text-beergam-typography-secondary">
                              Cota mensal: <strong>{quotaData?.data?.limit ?? 0}</strong> | Usados:{" "}
                              <strong>{quotaData?.data?.used ?? 0}</strong> | Restantes:{" "}
                              <strong>{remainingQuota}</strong>.
                            </p>
                          </Alert>,
                          options
                        );
                      }}
                      isReprocessing={reprocessingKey === `pack-${item.packId}`}
                      remainingQuota={remainingQuota}
                    />
                  ) : (
                    <OrderCard
                      key={`order-${item.order.order_id}`}
                      order={item.order}
                      onReprocess={() => {
                        if (remainingQuota <= 0) {
                          return;
                        }
                        const orderId = item.order.order_id;
                        const options: ModalOptions = {
                          title: "Confirmar reprocessamento do pedido",
                        };

                        openModal(
                          <Alert
                            type="info"
                            confirmText="Reprocessar"
                            onClose={closeModal}
                            onConfirm={() => {
                              setReprocessingKey(`order-${orderId}`);
                              reprocessMutation.mutate([orderId], {
                                onSettled: () => setReprocessingKey(null),
                              });
                            }}
                          >
                            <h3 className="text-lg font-semibold text-beergam-typography-primary mb-2">
                              Deseja reprocessar o pedido{" "}
                              <span className="font-mono" style={{ fontSize: "20px" }}>#{orderId}</span>?
                            </h3>
                            <p className="text-sm text-beergam-typography-secondary mb-2">
                              Isso irá buscar novamente os dados desse pedido no Mercado Livre e atualizar o registro aqui no Beergam.
                            </p>
                            <p className="text-xs text-beergam-typography-secondary">
                              Cota mensal: <strong>{quotaData?.data?.limit ?? 0}</strong> | Usados:{" "}
                              <strong>{quotaData?.data?.used ?? 0}</strong> | Restantes:{" "}
                              <strong>{remainingQuota}</strong>.
                            </p>
                          </Alert>,
                          options
                        );
                      }}
                      isReprocessing={reprocessingKey === `order-${item.order.order_id}`}
                      remainingQuota={remainingQuota}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </AsyncBoundary>
      </div>

      <PaginationBar
        page={Math.min(effectivePage, Math.max(1, totalPages))}
        totalPages={totalPages}
        totalCount={totalCount}
        entityLabel="pedidos"
        onChange={handlePageChange}
        scrollOnChange
        scrollTargetId="order-list"
        isLoading={isLoading}
        syncWithUrl={syncPageWithUrl}
      />
    </>
  );
}

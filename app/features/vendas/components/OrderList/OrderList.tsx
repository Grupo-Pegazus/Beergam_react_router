import { Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import PaginationBar from "~/src/components/ui/PaginationBar";
import { useOrders } from "../../hooks";
import type { Order, OrdersFilters } from "../../typings";
import OrderCard from "./OrderCard";
import OrderListSkeleton from "./OrderListSkeleton";
import OrderPackage from "./OrderPackage";

interface OrderListProps {
  filters?: Partial<OrdersFilters>;
}

export default function OrderList({ filters = {} }: OrderListProps) {
  const [page, setPage] = useState(filters.page ?? 1);
  const [perPage, setPerPage] = useState(filters.per_page ?? 20);

  useEffect(() => {
    setPage(filters.page ?? 1);
  }, [filters.page]);

  useEffect(() => {
    setPerPage(filters.per_page ?? 20);
  }, [filters.per_page]);

  const { data, isLoading, error } = useOrders({
    ...filters,
    page,
    per_page: perPage,
  });

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

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
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
                    />
                  ) : (
                    <OrderCard
                      key={`order-${item.order.order_id}`}
                      order={item.order}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </AsyncBoundary>
      </div>

      <PaginationBar
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        entityLabel="pedidos"
        onChange={handlePageChange}
        scrollOnChange
        scrollTargetId="order-list"
        isLoading={isLoading}
      />
    </>
  );
}

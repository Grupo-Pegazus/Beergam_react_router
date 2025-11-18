import { useEffect, useMemo, useState } from "react";
import { Pagination, Typography } from "@mui/material";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import { useOrders } from "../../hooks";
import type { OrdersFilters, Order } from "../../typings";
import OrderCard from "./OrderCard";
import OrderPackage from "./OrderPackage";
import OrderListSkeleton from "./OrderListSkeleton";

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

  // Agrupa pedidos por pack_id
  const groupedOrders = useMemo(() => {
    const groups: Map<string, Order[]> = new Map();
    const standaloneOrders: Order[] = [];

    orders.forEach((order) => {
      const packId = order.pack_id;
      
      if (packId) {
        if (!groups.has(packId)) {
          groups.set(packId, []);
        }
        groups.get(packId)!.push(order);
      } else {
        // Pedido standalone (sem pack_id)
        standaloneOrders.push(order);
      }
    });

    // Segundo passo: separa grupos com apenas 1 pedido (não são carrinhos)
    const validGroups: Map<string, Order[]> = new Map();
    
    groups.forEach((packOrders, packId) => {
      if (packOrders.length >= 2) {
        // É um carrinho (2 ou mais pedidos)
        validGroups.set(packId, packOrders);
      } else {
        // Não é carrinho, trata como standalone
        standaloneOrders.push(...packOrders);
      }
    });

    return { groups: validGroups, standaloneOrders };
  }, [orders]);

  const pagination = data?.success ? data.data?.pagination : null;
  const totalPages = pagination?.total_pages ?? 1;
  const totalCount = pagination?.total_count ?? orders.length;

  const handlePageChange = (_event: React.ChangeEvent<unknown>, nextPage: number) => {
    setPage(nextPage);
  };

  return (
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
            {/* Renderiza pacotes agrupados */}
            {Array.from(groupedOrders.groups.entries()).map(([packId, packOrders]) => (
              <OrderPackage key={packId} packId={packId} orders={packOrders} />
            ))}
            
            {/* Renderiza pedidos standalone */}
            {groupedOrders.standaloneOrders.map((order) => (
              <OrderCard key={order.order_id} order={order} />
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0 pt-2 w-full min-w-0">
            <Typography variant="body2" color="text.secondary" className="text-center md:text-left text-xs md:text-sm">
              Mostrando página {page} de {totalPages} — {totalCount} pedidos no total
            </Typography>
            <div className="flex justify-center">
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                shape="rounded"
                color="primary"
                size="small"
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontSize: "0.875rem",
                    minWidth: "32px",
                    height: "32px",
                  },
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </AsyncBoundary>
  );
}


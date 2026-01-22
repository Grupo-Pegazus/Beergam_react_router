import { Alert } from "@mui/material";
import { useMemo } from "react";
import { useOrders } from "~/features/vendas/hooks";
import type { Order } from "~/features/vendas/typings";
import { OrderTranslatedAttributes } from "~/features/vendas/typings";
import TanstackTable from "~/src/components/TanstackTable";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
interface OrderColumns {
    header: string;
    accessorKey: keyof Order;
    hidden?: boolean;
}
export default function RelatorioVendasRoute() {
    const filters = useMemo(() => ({
        page: 1,
        per_page: 100,
    }), []);
    const { data, isLoading, error } = useOrders(filters);
    const columns: OrderColumns[] = useMemo(() => {
        // Campos que são objetos ou arrays e não podem ser renderizados diretamente
        const excludedKeys: (keyof Order)[] = [
            'tags',
            'payments',
            'shipping_details',
            'shipment_costs',
            'client',
            'id',
            "title",
            'thumbnail'
        ];
        
        return Object.entries(OrderTranslatedAttributes)
            .filter(([key]) => !excludedKeys.includes(key as keyof Order))
            .map(([key, header]) => ({
                header,
                accessorKey: key as keyof Order,
                hidden: false,
            }));
    }, []);
    const orders = useMemo(() => {
        if (!data?.success || !data.data?.orders) return [];
        return data.data.orders;
    }, [data]);
    return (
        <AsyncBoundary
            isLoading={isLoading}
            error={error as unknown}
            Skeleton={() => <p>carregando...</p>}
            ErrorFallback={() => <Alert severity="error">Erro ao carregar o relatorio de vendas</Alert>}
        >
          <TanstackTable
            data={orders}
            columns={columns}
          />
        </AsyncBoundary>
    );
}
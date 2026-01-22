import { Alert } from "@mui/material";
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from "react";
import { useOrders } from "~/features/vendas/hooks";
import type { Order } from "~/features/vendas/typings";
import {
    OrderAttributeDisplayOrder,
    OrderTranslatedAttributes,
    getAttributeColors,
    getAttributeSectionName,
} from "~/features/vendas/typings";
import TanstackTable from "~/src/components/TanstackTable";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";

export default function RelatorioVendasRoute() {
    const filters = useMemo(() => ({
        page: 1,
        per_page: 100,
    }), []);
    const { data, isLoading, error } = useOrders(filters);
    
    const columns: ColumnDef<Order>[] = useMemo(() => {
        // Campos que são objetos ou arrays e não podem ser renderizados diretamente
        const excludedKeys: (keyof Order)[] = [
            'tags',
            'payments',
            'shipping_details',
            'shipment_costs',
            'client',
            'id',
            'thumbnail',
            'created_at'
        ];
        
        // Larguras customizadas para colunas específicas
        const customWidths: Partial<Record<keyof Order, number>> = {
            sku: 150,
            mlb: 150,
            date_created: 150,
            title: 200,
            pack_id: 150,
        };
        
        // Usa a ordem definida em OrderAttributeDisplayOrder
        return OrderAttributeDisplayOrder
            .filter((key) => !excludedKeys.includes(key))
            .map((key) => {
                const colors = getAttributeColors(key);
                return {
                    header: OrderTranslatedAttributes[key],
                    accessorKey: key,
                    meta: {
                        headerColor: colors.headerColor,
                        bodyColor: colors.bodyColor,
                        sectionName: getAttributeSectionName(key),
                        customWidth: customWidths[key],
                    },
                };
            });
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
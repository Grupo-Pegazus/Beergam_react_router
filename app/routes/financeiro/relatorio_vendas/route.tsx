import { Alert } from "@mui/material";
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from "react";
import { useOrdersWithLoadMore } from "~/features/vendas/hooks";
import type { Order } from "~/features/vendas/typings";
import {
    OrderAttributeDisplayOrder,
    OrderSchema,
    OrderTranslatedAttributes,
    createColumnFooters,
    getAttributeColors,
    getAttributeSectionName,
    getColumnFooter,
    getTextColorForColumn,
} from "~/features/vendas/typings";
import TanstackTable from "~/src/components/TanstackTable";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
export default function RelatorioVendasRoute() {
    const { 
        orders, 
        pagination, 
        isLoading, 
        isLoadingMore, 
        error, 
        loadMore, 
        hasMore 
    } = useOrdersWithLoadMore({ per_page: 100 });
    const transformedOrders = useMemo(() => orders.map((order) => OrderSchema.parse(order)), [orders]);
    
    const TotalCusto = useMemo(() => {
        return orders.reduce((acc, order) => {
            return acc + parseFloat(order.total_amount || "0");
        }, 0);
    }, [orders]);

    const TotalValorDoImposto = useMemo(() => {
        return orders.reduce((acc, order) => {
            return acc + parseFloat(order.tax_amount || "0");
        }, 0);
    }, [orders]);

    const TotalTarifaML = useMemo(() => {
        return orders.reduce((acc, order) => {
            return acc + parseFloat(order.sale_fee || "0");
        }, 0);
    }, [orders]);

    const TotalEnvioVendedor = useMemo(() => {
        return orders.reduce((acc, order) => {
            return acc + parseFloat(order.custo_envio_seller || "0");
        }, 0);
    }, [orders]);
    const TotalEnvioBase = useMemo(() => {
        return orders.reduce((acc, order) => {
            return acc + parseFloat(order.custo_envio_base || "0");
        }, 0);
    }, [orders]);
    const TotalEnvioFinal = useMemo(() => {
        return orders.reduce((acc, order) => {
            return acc + parseFloat(order.custo_envio_final || "0");
        }, 0);
    }, [orders]);
    const footers = useMemo(() => createColumnFooters({
        total_amount: {
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(TotalCusto),
        },
        tax_amount: {
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(TotalValorDoImposto),
        },
        sale_fee: {
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(TotalTarifaML),
        },
        custo_envio_seller: {
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(TotalEnvioVendedor),
        },
        custo_envio_base: {
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(TotalEnvioBase),
        },
        custo_envio_final: {
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(TotalEnvioFinal),
        },
    }), [TotalCusto, TotalValorDoImposto, TotalTarifaML, TotalEnvioVendedor, TotalEnvioBase, TotalEnvioFinal]);
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
            'created_at',
            'marketplace_shop_id',
        ];
        
        // Larguras customizadas para colunas específicas
        const customWidths: Partial<Record<keyof Order, number>> = {
            sku: 150,
            mlb: 150,
            date_created: 150,
            title: 200,
            pack_id: 150,
        };
        
        // Colunas que podem ser ordenadas (sorting)
        const sortableColumns: (keyof Order)[] = [
            'order_id',
            'date_created',
            'date_closed',
            'status',
            'total_amount',
            'paid_amount',
            'quantity',
            'unit_price',
            'valor_base',
            'valor_liquido',
            'sku',
            'mlb',
            'buyer_nickname',
        ];
        
        // Usa a ordem definida em OrderAttributeDisplayOrder
        return OrderAttributeDisplayOrder
            .filter((key) => !excludedKeys.includes(key))
            .map((key) => {
                const colors = getAttributeColors(key);
                const footer = getColumnFooter(key, footers); // Obtém footer específico da coluna
                const textColor = getTextColorForColumn(key); // Cor vermelha para valores negativos
                
                return {
                    header: OrderTranslatedAttributes[key],
                    accessorKey: key,
                    meta: {
                        headerColor: colors.headerColor,
                        bodyColor: colors.bodyColor,
                        textColor,
                        sectionName: getAttributeSectionName(key),
                        customWidth: customWidths[key],
                        enableSorting: sortableColumns.includes(key),
                        ...footer, // Aplica footerValue e footerColor se existir
                    },
                };
            });
    }, [footers]);
    ;
    return (
        <AsyncBoundary
            isLoading={isLoading}
            error={error as unknown}
            Skeleton={() => <p>carregando...</p>}
            ErrorFallback={() => <Alert severity="error">Erro ao carregar o relatorio de vendas</Alert>}
        >
            <p>Total de custo: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(TotalCusto)}</p>
          <TanstackTable
            data={transformedOrders}
            columns={columns}
            controlColumns
            pagination={pagination}
            onLoadMore={hasMore ? loadMore : undefined}
            isLoadingMore={isLoadingMore}
          />
        </AsyncBoundary>
    );
}
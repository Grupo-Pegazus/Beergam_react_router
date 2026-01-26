import { Alert, Popover } from "@mui/material";
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router";
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
import Svg from "~/src/assets/svgs/_index";
import TanstackTable, { type ContextMenuProps } from "~/src/components/TanstackTable";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";

/** Item do context menu estilo shadcn */
function ContextMenuItem({ 
    children, 
    icon, 
    shortcut,
    destructive = false,
    onClick,
    to,
}: { 
    children: React.ReactNode;
    icon?: React.ReactNode;
    shortcut?: string;
    destructive?: boolean;
    onClick?: () => void;
    to?: string;
}) {
    const baseStyles = `
        flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer
        outline-none select-none transition-colors duration-75
        ${destructive 
            ? 'text-red-600 hover:bg-red-50 focus:bg-red-50' 
            : 'text-beergam-typography-primary! hover:bg-beergam-primary/20 focus:bg-beergam-primary/20'
        }
    `;

    const content = (
        <>
            {icon && <span className="w-4 h-4 flex items-center justify-center opacity-70">{icon}</span>}
            <span className="flex-1">{children}</span>
            {shortcut && (
                <span className="ml-auto text-xs text-zinc-400 tracking-widest">
                    {shortcut}
                </span>
            )}
        </>
    );

    if (to) {
        return (
            <Link to={to} onClick={onClick} className={baseStyles}>
                {content}
            </Link>
        );
    }

    return (
        <div onClick={onClick} className={baseStyles} role="menuitem" tabIndex={0}>
            {content}
        </div>
    );
}

/** Context menu para a tabela de vendas */
function OrderContextMenu({ data: order, anchorPosition, onClose }: ContextMenuProps<Order>) {
    const { order_id: orderId, buyer_nickname: buyerNickname, sku, thumbnail, mlb, title } = order;
    return (
        <Popover
            open
            onClose={onClose}
            anchorReference="anchorPosition"
            anchorPosition={anchorPosition}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            transitionDuration={100}
            slotProps={{
                paper: {
                    sx: {
                        bgcolor: 'var(--color-beergam-layout-background)',
                        borderRadius: '8px',
                        border: '1px solid rgba(0,0,0,0.08)',
                        minWidth: 280,
                        maxWidth: 320,
                        p: 0.5,
                        boxShadow: '0 10px 38px -10px rgba(22,23,24,0.35), 0 10px 20px -15px rgba(22,23,24,0.2)',
                        animation: 'fadeIn 0.1s ease-out',
                        '@keyframes fadeIn': {
                            from: { opacity: 0, transform: 'scale(0.95)' },
                            to: { opacity: 1, transform: 'scale(1)' },
                        },
                    },
                },
            }}
        >
            {/* Card do produto com thumbnail */}
            <div className="flex gap-3 p-2 mb-1 bg-beergam-section-background rounded-md">
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-14 h-14 rounded-md overflow-hidden bg-zinc-100 border border-zinc-200">
                    {thumbnail ? (
                        <img 
                            src={thumbnail} 
                            alt={title || 'Produto'} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Svg.box width={24} height={24} tailWindClasses="text-zinc-400" />
                        </div>
                    )}
                </div>
                
                {/* Info do produto */}
                <div className="flex-1 min-w-0">
                    <Link 
                        to={`/interno/anuncios/${mlb}`}
                        onClick={onClose}
                        className="text-xs font-semibold text-beergam-primary hover:underline block truncate"
                    >
                        {mlb}
                    </Link>
                    <p className="text-[11px] text-beergam-typography-secondary line-clamp-2 mt-0.5" title={title}>
                        {title}
                    </p>
                </div>
            </div>

            {/* Header com info do pedido */}
            <div className="px-2 py-1.5 border-b border-zinc-200 mb-1">
                <p className="text-xs font-medium text-beergam-typography-primary truncate">
                    Pedido #{orderId}
                </p>
                <p className="text-xs text-beergam-typography-secondary! truncate">
                    {buyerNickname}
                </p>
            </div>

            {/* Menu items */}
            <div role="menu">
                <ContextMenuItem
                    to={`/interno/vendas/${orderId}`}
                    onClick={onClose}
                    icon={<Svg.eye width={16} height={16} />}
                >
                    Ver detalhes
                </ContextMenuItem>
                
                <ContextMenuItem
                    onClick={() => {
                        navigator.clipboard.writeText(orderId);
                        toast.success('ID copiado com sucesso');
                        onClose();
                    }}
                    icon={<Svg.copy width={16} height={16} />}
                >
                    Copiar ID
                </ContextMenuItem>

                  <ContextMenuItem
                    onClick={() => {
                        navigator.clipboard.writeText(sku || '');
                        toast.success('SKU copiado com sucesso');
                        onClose();
                    }}
                    icon={<Svg.copy width={16} height={16} />}
                >
                    Copiar SKU
                </ContextMenuItem>
            </div>
        </Popover>
    );
}
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

    const TotalValorPago = useMemo(() => {
        return orders.reduce((acc, order) => {
            return acc + parseFloat(order.paid_amount || "0");
        }, 0);
    }, [orders]);

    const TotalValorBase = useMemo(() => {
        return orders.reduce((acc, order) => {
            return acc + parseFloat(order.valor_base || "0");
        }, 0);
    }, [orders]);

    const TotalValorLiquido = useMemo(() => {
        return orders.reduce((acc, order) => {
            return acc + parseFloat(order.valor_liquido || "0");
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
        paid_amount: {
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(TotalValorPago),
        },
        valor_base: {
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(TotalValorBase),
        },
        valor_liquido: {
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(TotalValorLiquido),
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
    }), [TotalCusto, TotalValorPago, TotalValorBase, TotalValorLiquido, TotalValorDoImposto, TotalTarifaML, TotalEnvioVendedor, TotalEnvioBase, TotalEnvioFinal]);
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
            'date_created',
            'date_closed',
            'total_amount',
            'paid_amount',
            'quantity',
            'unit_price',
            'valor_base',
            'valor_liquido',
            'tax_amount',
            'sale_fee',
            'custo_envio_seller',
            'custo_envio_base',
            'custo_envio_final',
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

    // Context menu callback
    const renderContextMenu = useCallback((props: ContextMenuProps<Order>) => (
        <OrderContextMenu {...props} />
    ), []);

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
            contextMenuComponent={renderContextMenu}
          />
        </AsyncBoundary>
    );
}
import { Popover } from "@mui/material";
import type { ColumnDef } from '@tanstack/react-table';
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router";
import type { DeliveryStatusFilter, DeliveryTypeFilter, OrderStatusFilter, VendasFiltersState } from "~/features/vendas/components/Filters/types";
import VendasFilters from "~/features/vendas/components/Filters/VendasFilters";
import { useOrdersWithLoadMore } from "~/features/vendas/hooks";
import { useVendasFilters } from "~/features/vendas/hooks/useVendasFilters";
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
import BeergamButton from "~/src/components/utils/BeergamButton";
import { useModal } from "~/src/components/utils/Modal/useModal";

// Labels amigáveis para os filtros
const STATUS_LABELS: Record<OrderStatusFilter, string> = {
    all: "Todos",
    payment_required: "Aguardando Pagamento",
    payment_in_process: "Em Processo",
    paid: "Pago",
    cancelled: "Cancelado",
};

const DELIVERY_STATUS_LABELS: Record<DeliveryStatusFilter, string> = {
    all: "Todos",
    ready_to_ship: "Pronto para Envio",
    handling: "Em Preparação",
    pending: "Pendente",
    shipped: "Enviado",
    delivered: "Entregue",
};

const DELIVERY_TYPE_LABELS: Record<DeliveryTypeFilter, string> = {
    all: "Todos",
    xd_drop_off: "Agência",
    fulfillment: "Full",
    cross_docking: "Coleta",
    drop_off: "Correios",
    me2: "ME2",
    self_service: "Self Service",
    flex: "Flex",
    not_specified: "Não Especificado",
};

const SEARCH_TYPE_LABELS: Record<string, string> = {
    order_id: "ID do Pedido",
    sku: "SKU",
    buyer_nickname: "Apelido do Comprador",
    mlb: "MLB",
};

/** Badge de filtro aplicado */
function FilterBadge({ 
    label, 
    value, 
}: { 
    label: string; 
    value: string; 
}) {
    return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-beergam-primary/10 border border-beergam-primary/20 rounded-full text-xs font-medium text-beergam-primary transition-all hover:bg-beergam-primary/20">
            <span className="text-beergam-typography-secondary">{label}:</span>
            <span className="max-w-[150px] truncate">{value}</span>
        </div>
    );
}

/** Container com todas as badges de filtros aplicados */
function AppliedFiltersBadges({ 
    filters, 
    onClearAll,
}: { 
    filters: VendasFiltersState;
    onClearAll: () => void;
}) {
    // Monta lista de badges baseado nos filtros aplicados
    const badges = useMemo(() => {
        const result: { key: keyof VendasFiltersState; label: string; value: string }[] = [];

        // Status do pedido
        if (filters.statusFilter && filters.statusFilter !== "all") {
            result.push({
                key: "statusFilter",
                label: "Status",
                value: STATUS_LABELS[filters.statusFilter] || filters.statusFilter,
            });
        }

        // Status de entrega
        if (filters.deliveryStatusFilter && filters.deliveryStatusFilter !== "all") {
            result.push({
                key: "deliveryStatusFilter",
                label: "Status Entrega",
                value: DELIVERY_STATUS_LABELS[filters.deliveryStatusFilter] || filters.deliveryStatusFilter,
            });
        }

        // Tipo de entrega
        if (filters.deliveryTypeFilter && filters.deliveryTypeFilter !== "all") {
            result.push({
                key: "deliveryTypeFilter",
                label: "Tipo Entrega",
                value: DELIVERY_TYPE_LABELS[filters.deliveryTypeFilter] || filters.deliveryTypeFilter,
            });
        }

        // Busca por texto (order_id, sku, buyer_nickname, mlb)
        if (filters.order_id) {
            result.push({
                key: "order_id",
                label: SEARCH_TYPE_LABELS.order_id,
                value: filters.order_id,
            });
        }
        if (filters.sku) {
            result.push({
                key: "sku",
                label: SEARCH_TYPE_LABELS.sku,
                value: filters.sku,
            });
        }
        if (filters.buyer_nickname) {
            result.push({
                key: "buyer_nickname",
                label: SEARCH_TYPE_LABELS.buyer_nickname,
                value: filters.buyer_nickname,
            });
        }
        if (filters.mlb) {
            result.push({
                key: "mlb",
                label: SEARCH_TYPE_LABELS.mlb,
                value: filters.mlb,
            });
        }

        // Datas
        if (filters.dateCreatedFrom) {
            result.push({
                key: "dateCreatedFrom",
                label: "De",
                value: dayjs(filters.dateCreatedFrom).format("DD/MM/YYYY"),
            });
        }
        if (filters.dateCreatedTo) {
            result.push({
                key: "dateCreatedTo",
                label: "Até",
                value: dayjs(filters.dateCreatedTo).format("DD/MM/YYYY"),
            });
        }

        return result;
    }, [filters]);

    if (badges.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 mb-3 p-2 bg-beergam-section-background rounded-lg">
            <span className="text-xs font-medium text-beergam-typography-secondary mr-1">
                Filtros:
            </span>
            {badges.map((badge) => (
                <FilterBadge
                    key={badge.key}
                    label={badge.label}
                    value={badge.value}
                />
            ))}
            <button
                type="button"
                onClick={onClearAll}
                className="ml-2 text-xs text-beergam-red hover:text-red-700 hover:underline transition-colors"
            >
                Limpar todos
            </button>
        </div>
    );
}

/** Wrapper do filtro que gerencia seu próprio estado interno (necessário para funcionar dentro do Modal) */
function FiltersModalContent({
    initialFilters,
    onApply,
    onReset,
    isSubmitting,
}: {
    initialFilters: VendasFiltersState;
    onApply: (filters: VendasFiltersState) => void;
    onReset: () => void;
    isSubmitting: boolean;
}) {
    const [localFilters, setLocalFilters] = useState<VendasFiltersState>(initialFilters);

    const handleChange = useCallback((next: VendasFiltersState) => {
        setLocalFilters(next);
    }, []);

    const handleSubmit = useCallback(() => {
        onApply(localFilters);
    }, [localFilters, onApply]);

    const handleReset = useCallback(() => {
        onReset();
    }, [onReset]);

    return (
        <VendasFilters
            value={localFilters}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onReset={handleReset}
            isSubmitting={isSubmitting}
        />
    );
}

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
    const { order_id: orderId, sku, thumbnail, mlb, title } = order;
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
            <div className="px-2 py-1.5 flex flex-col gap-2 border-b border-zinc-200 mb-1">
                <p className="text-xs font-medium text-beergam-typography-primary truncate">
                    Pedido #{orderId}
                </p>
                <p className="text-xs text-beergam-typography-secondary! truncate">
                    <span className="font-medium text-beergam-typography-primary!">Receita Bruta:</span> {order.total_amount}
                </p>
                <p className="text-xs text-beergam-typography-secondary! truncate">
                    <span className="font-medium text-beergam-typography-primary!">Total Receita:</span> {order.valor_liquido}
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
    const { openModal, closeModal } = useModal();
    const { filters, resetFilters, applyFilters, apiFilters } =
        useVendasFilters({ per_page: 100 });

    const handleApplyFilters = useCallback((newFilters: VendasFiltersState) => {
        // Aplica os filtros diretamente (atualiza ambos os estados de uma vez)
        applyFilters(newFilters);
        closeModal();
    }, [applyFilters, closeModal]);

    const handleResetFilters = useCallback(() => {
        resetFilters();
        closeModal();
    }, [resetFilters, closeModal]);

    // Limpa todos os filtros
    const handleClearAllFilters = useCallback(() => {
        resetFilters();
    }, [resetFilters]);

    // Passa os filtros aplicados (apiFilters) para o hook
    const { 
        orders, 
        pagination, 
        isLoading, 
        isLoadingMore,
        isFetching,
        error, 
        loadMore, 
        hasMore 
    } = useOrdersWithLoadMore(apiFilters);
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
            date_created: 180,
            title: 200,
            pack_id: 150,
            condition: 150,
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
        <div className="flex flex-col">
            {/* Badges de filtros aplicados */}
            <AppliedFiltersBadges
                filters={filters}
                onClearAll={handleClearAllFilters}
            />

            <TanstackTable
                data={transformedOrders}
                columns={columns}
                controlColumns
                storageKey="orders"
                pagination={pagination}
                onLoadMore={hasMore ? loadMore : undefined}
                isLoadingMore={isLoadingMore}
                contextMenuComponent={renderContextMenu}
                isLoading={isLoading}
                error={error as unknown}
                additionalControls={[
                  <BeergamButton 
                    key="filters-btn"
                    onClick={() => {
                      openModal(
                        <FiltersModalContent
                          initialFilters={filters}
                          onApply={handleApplyFilters}
                          onReset={handleResetFilters}
                          isSubmitting={isFetching}
                        />, {title: "Filtros Aplicados", icon: "adjustments_horizontal_solid"}
                      );
                    }} 
                    title="Filtros Aplicados"
                    icon="adjustments_horizontal_solid"
                  />
                ]}
              />
        </div>
    );
}
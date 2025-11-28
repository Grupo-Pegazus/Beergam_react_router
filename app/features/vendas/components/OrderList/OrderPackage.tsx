import { useState, useMemo } from "react";
import { Chip, Divider, IconButton, Stack, Typography } from "@mui/material";
import MainCards from "~/src/components/ui/MainCards";
import CopyButton from "~/src/components/ui/CopyButton";
import type { Order } from "../../typings";
import dayjs from "dayjs";
import Svg from "~/src/assets/svgs/_index";
import { getLogisticTypeMeliInfo } from "~/src/constants/logistic-type-meli";
import { getStatusOrderMeliInfo } from "~/src/constants/status-order-meli";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import OrderItemCard from "./OrderItemCard";
import Thumbnail from "~/src/components/Thumbnail/Thumbnail";

interface OrderPackageProps {
  packId: string;
  orders: Order[];
}

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "—";
  return dayjs(dateStr).format("DD MMM YYYY [às] HH:mm");
};

export default function OrderPackage({ packId, orders }: OrderPackageProps) {
  const [isPackageExpanded, setIsPackageExpanded] = useState(false);

  // Usa o primeiro pedido para informações do pacote (todos têm o mesmo pack_id)
  const firstOrder = orders[0];

  const statusInfo = useMemo(
    () => getStatusOrderMeliInfo(firstOrder.status),
    [firstOrder.status]
  );

  const logisticTypeInfo = useMemo(
    () => getLogisticTypeMeliInfo(firstOrder.shipping_mode ?? ""),
    [firstOrder.shipping_mode]
  );

  // Calcula totais do pacote
  const packageTotals = useMemo(() => {
    const totalAmount = orders.reduce(
      (sum, order) => sum + parseFloat(order.total_amount || "0"),
      0
    );
    const totalQuantity = orders.reduce((sum, order) => sum + (order.quantity || 0), 0);
    let totalLiquido = orders.reduce(
      (sum, order) => sum + parseFloat(order.valor_base || "0"),
      0
    );

    totalLiquido = totalLiquido - (orders[0].custo_envio_final || 0);

    return {
      totalAmount,
      totalQuantity,
      totalLiquido,
    };
  }, [orders]);

  // Informação de entrega (usa a primeira data disponível)
  const deliveryInfo = useMemo(() => {
    const now = dayjs();
    const orderWithDelivery = orders.find(
      (o) => o.estimated_delivery || o.expiration_date
    );

    if (!orderWithDelivery) return null;

    if (orderWithDelivery.estimated_delivery) {
      const estimatedDate = dayjs(orderWithDelivery.estimated_delivery);
      if (estimatedDate.isAfter(now) || estimatedDate.isSame(now, "day")) {
        return {
          type: "estimated" as const,
          date: estimatedDate.format("dddd[, dia] D [de] MMMM"),
          label: "Chega",
        };
      }
    }

    if (orderWithDelivery.expiration_date) {
      const expirationDate = dayjs(orderWithDelivery.expiration_date);
      if (expirationDate.isAfter(now) || expirationDate.isSame(now, "day")) {
        return {
          type: "expiration" as const,
          date: expirationDate.format("dddd[, dia] D [de] MMMM"),
          label: "Prazo limite para qualificar",
        };
      }
    }

    return null;
  }, [orders]);

  // Thumbnails dos produtos (máximo 4 visíveis + indicador de mais)
  const thumbnailsToDisplay = useMemo(() => {
    // Sempre mostra os primeiros 4 produtos
    return orders.slice(0, 4).map((order) => ({
      thumbnail: order.thumbnail || null,
      hasThumbnail: !!(order.thumbnail && order.thumbnail.trim() !== ""),
    }));
  }, [orders]);

  // Mostra indicador "+N" se houver mais de 4 produtos
  const hasMoreItems = orders.length > 4;
  const remainingCount = orders.length - 4;

  return (
    <MainCards className="p-3 md:p-4 w-full min-w-0">
      <div className="flex flex-col gap-2 w-full min-w-0">
        {/* Header: Pack ID e Data */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
            <div className="flex items-center gap-1">
              <Typography variant="caption" color="text.secondary" className="font-mono text-xs md:text-sm">
                #{packId}
              </Typography>
              <CopyButton
                textToCopy={packId}
                successMessage="Pack ID copiado para a área de transferência"
                ariaLabel="Copiar Pack ID"
              />
            </div>
            <span className="text-slate-300 hidden md:inline">|</span>
            <Typography variant="caption" color="text.secondary" className="text-xs md:text-sm">
              {formatDate(firstOrder.date_created)}
            </Typography>
            <span className="text-slate-300 hidden md:inline">|</span>
            <Chip
              label={logisticTypeInfo.label}
              size="small"
              sx={{
                height: 22,
                fontSize: "0.65rem",
                fontWeight: 600,
                backgroundColor: logisticTypeInfo.backgroundColor,
                color: logisticTypeInfo.color,
                "& .MuiChip-label": {
                  px: 0.75,
                },
              }}
            />
          </div>
          {firstOrder.buyer_nickname && (
            <div className="flex items-center gap-1.5 md:gap-2">
              <Svg.profile tailWindClasses="h-3.5 w-3.5 md:h-4 md:w-4 text-slate-500" />
              <Typography variant="body2" className="text-slate-900 text-sm md:text-base">
                {firstOrder.buyer_nickname}
              </Typography>
              {firstOrder.buyer_id && (
                <>
                  <span className="text-slate-300 hidden md:inline">|</span>
                  <Typography variant="caption" color="text.secondary" className="text-xs md:text-sm">
                    {firstOrder.buyer_id}
                  </Typography>
                </>
              )}
            </div>
          )}
        </div>

        <Divider sx={{ my: 0.5 }} />

        {/* Status Chips e Botão de Expandir */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 md:gap-2">
          <Chip
            label={statusInfo.label}
            size="small"
            icon={
              (() => {
                const IconComponent = Svg[statusInfo.icon];
                return <IconComponent tailWindClasses="h-3.5 w-3.5 md:h-4 md:w-4" />;
              })()
            }
            sx={{
              height: 22,
              fontSize: "0.65rem",
              fontWeight: 600,
              backgroundColor: statusInfo.backgroundColor,
              color: statusInfo.color,
              "& .MuiChip-label": {
                px: 0.75,
              },
            }}
          />
        </div>

        {/* Status do envio */}
        {(firstOrder.shipment_status || deliveryInfo) && (
          <div className="block mt-1 md:mt-2">
            {firstOrder.shipment_status && (
              <Typography variant="body2" fontWeight={600} className="text-slate-900 mb-0.5 md:mb-1 text-sm md:text-base">
                {getStatusOrderMeliInfo(firstOrder.shipment_status)?.label ||
                  firstOrder.shipment_status}
              </Typography>
            )}
            {deliveryInfo && (
              <Typography variant="caption" fontWeight={400} className="text-slate-700 text-xs md:text-sm">
                {deliveryInfo.label} {deliveryInfo.date}
              </Typography>
            )}
          </div>
        )}

        {/* Resumo do Pacote */}
        <div
          className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-2 bg-slate-100 rounded-lg p-2.5 md:p-3 cursor-pointer hover:bg-slate-200 transition-colors"
          onClick={() => setIsPackageExpanded(!isPackageExpanded)}
        >
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setIsPackageExpanded(!isPackageExpanded);
              }}
              sx={{ 
                padding: 0, 
                transform: isPackageExpanded ? "rotate(270deg)" : "rotate(90deg)", 
                transition: "transform 0.2s",
                minWidth: "auto",
              }}
            >
              <Svg.chevron tailWindClasses="h-4 w-4 md:h-5 md:w-5 text-slate-600" />
            </IconButton>

            {/* Thumbnails dos produtos */}
            <div className="flex items-center gap-0.5 md:gap-1 shrink-0">
              {thumbnailsToDisplay.map((item, index) => (
                <div
                  key={index}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white overflow-hidden -ml-3 md:-ml-4 shadow-xs first:ml-0 bg-white flex items-center justify-center"
                >
                    <Thumbnail thumbnail={item.thumbnail || ""} tailWindClasses="w-8! h-8! md:w-10! md:h-10!" />
                </div>
              ))}
              {hasMoreItems && (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center -ml-3 md:-ml-4">
                  <Typography variant="caption" fontWeight={600} className="text-slate-700 text-xs">
                    +{remainingCount}
                  </Typography>
                </div>
              )}
            </div>

            <Typography variant="body2" fontWeight={600} className="text-slate-900 text-sm md:text-base truncate">
              Pacote de {orders.length} produto{orders.length > 1 ? "s" : ""}
            </Typography>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-2 md:gap-4">
            <div className="text-left md:text-right">
              <Typography variant="h6" fontWeight={700} className="text-slate-900 text-base md:text-xl">
                {formatCurrency(packageTotals.totalAmount)}
              </Typography>
              {packageTotals.totalLiquido > 0 && (
                <Typography variant="caption" color="text.secondary" className="text-xs">
                  Líquido: {formatCurrency(packageTotals.totalLiquido)}
                </Typography>
              )}
            </div>
            <Chip
              label={`${packageTotals.totalQuantity} unidade${packageTotals.totalQuantity > 1 ? "s" : ""}`}
              size="small"
              sx={{
                height: 24,
                fontSize: "0.7rem",
                fontWeight: 600,
                backgroundColor: "#1e40af",
                color: "#fff",
                "& .MuiChip-label": {
                  px: 1,
                },
              }}
            />
          </div>
        </div>

        {/* Lista de itens - Expandida */}
        {isPackageExpanded && (
          <Stack spacing={1.5} sx={{ mt: 1.5 }}>
            {orders.map((order) => (
              <OrderItemCard key={order.order_id} order={order} />
            ))}
          </Stack>
        )}
      </div>
    </MainCards>
  );
}


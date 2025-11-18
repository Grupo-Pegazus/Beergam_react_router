import { useState, useMemo } from "react";
import { Chip, Divider, IconButton, Stack, Typography } from "@mui/material";
import MainCards from "~/src/components/ui/MainCards";
import type { Order } from "../../typings";
import dayjs from "dayjs";
import Svg from "~/src/assets/svgs/_index";
import { getLogisticTypeMeliInfo } from "~/src/constants/logistic-type-meli";
import { getStatusOrderMeliInfo } from "~/src/constants/status-order-meli";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import OrderItemCard from "./OrderItemCard";
import Thumbnail from "~/src/components/Thumbnail/Thumbnail";
import toast from "react-hot-toast";

interface OrderPackageProps {
  packId: string;
  orders: Order[];
}

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "—";
  return dayjs(dateStr).format("DD MMM YYYY [às] HH:mm");
};

export default function OrderPackage({ packId, orders }: OrderPackageProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
    <MainCards className="p-4">
      <div className="flex flex-col gap-2">
        {/* Header: Pack ID e Data */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Typography variant="caption" color="text.secondary" className="font-mono">
                #{packId}
              </Typography>
              <button
                className="flex items-center gap-1 text-slate-500 hover:text-slate-700"
                onClick={() => {
                  navigator.clipboard.writeText(packId);
                  toast.success("Pack ID copiado para a área de transferência");
                }}
              >
                <Svg.copy tailWindClasses="h-4 w-4" />
              </button>
            </div>
            <span className="text-slate-300">|</span>
            <Typography variant="caption" color="text.secondary">
              {formatDate(firstOrder.date_created)}
            </Typography>
            <span className="text-slate-300">|</span>
            <Chip
              label={logisticTypeInfo.label}
              size="small"
              sx={{
                height: 24,
                fontSize: "0.7rem",
                fontWeight: 600,
                backgroundColor: logisticTypeInfo.backgroundColor,
                color: logisticTypeInfo.color,
              }}
            />
          </div>
          {firstOrder.buyer_nickname && (
            <div className="flex items-center gap-2">
              <Svg.profile tailWindClasses="h-4 w-4 text-slate-500" />
              <Typography variant="body2" className="text-slate-900">
                {firstOrder.buyer_nickname}
              </Typography>
              {firstOrder.buyer_id && (
                <>
                  <span className="text-slate-300">|</span>
                  <Typography variant="caption" color="text.secondary">
                    {firstOrder.buyer_id}
                  </Typography>
                </>
              )}
            </div>
          )}
        </div>

        <Divider />

        {/* Status Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <Chip
            label={statusInfo.label}
            size="small"
            icon={
              (() => {
                const IconComponent = Svg[statusInfo.icon];
                return <IconComponent tailWindClasses="h-4 w-4" />;
              })()
            }
            sx={{
              height: 24,
              fontSize: "0.7rem",
              fontWeight: 600,
              backgroundColor: statusInfo.backgroundColor,
              color: statusInfo.color,
            }}
          />
        </div>

        {/* Status do envio */}
        {(firstOrder.shipment_status || deliveryInfo) && (
          <div className="mt-2">
            {firstOrder.shipment_status && (
              <Typography variant="body1" fontWeight={600} className="text-slate-900 mb-1">
                {getStatusOrderMeliInfo(firstOrder.shipment_status)?.label ||
                  firstOrder.shipment_status}
              </Typography>
            )}
            {deliveryInfo && (
              <Typography variant="body2" fontWeight={400} className="text-slate-700">
                {deliveryInfo.label} {deliveryInfo.date}
              </Typography>
            )}
          </div>
        )}

        {/* Resumo do Pacote - Sempre visível */}
        <div
          className="flex justify-between items-center gap-2 bg-slate-100 rounded-lg p-3 cursor-pointer hover:bg-slate-200 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3 flex-1">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              sx={{ padding: 0, transform: isExpanded ? "rotate(270deg)" : "rotate(90deg)", transition: "transform 0.2s" }}
            >
              <Svg.chevron tailWindClasses="h-5 w-5 text-slate-600" />
            </IconButton>

            {/* Thumbnails dos produtos */}
            <div className="flex items-center gap-1">
              {thumbnailsToDisplay.map((item, index) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-full border-2 border-white overflow-hidden -ml-4 shadow-xs first:ml-0 bg-white flex items-center justify-center"
                >
                    <Thumbnail thumbnail={item.thumbnail || ""} tailWindClasses="w-10! h-10!" />
                </div>
              ))}
              {hasMoreItems && (
                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center -ml-4">
                  <Typography variant="caption" fontWeight={600} className="text-slate-700">
                    +{remainingCount}
                  </Typography>
                </div>
              )}
            </div>

            <Typography variant="body2" fontWeight={600} className="text-slate-900">
              Pacote de {orders.length} produto{orders.length > 1 ? "s" : ""}
            </Typography>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <Typography variant="h6" fontWeight={700} className="text-slate-900">
                {formatCurrency(packageTotals.totalAmount)}
              </Typography>
              {packageTotals.totalLiquido > 0 && (
                <Typography variant="caption" color="text.secondary">
                  Líquido: {formatCurrency(packageTotals.totalLiquido)}
                </Typography>
              )}
            </div>
            <Chip
              label={`${packageTotals.totalQuantity} unidade${packageTotals.totalQuantity > 1 ? "s" : ""}`}
              size="small"
              sx={{
                height: 28,
                fontSize: "0.75rem",
                fontWeight: 600,
                backgroundColor: "#1e40af",
                color: "#fff",
              }}
            />
          </div>
        </div>

        {/* Lista de itens - Expandida */}
        {isExpanded && (
          <Stack spacing={2} sx={{ mt: 2 }}>
            {orders.map((order) => (
              <OrderItemCard key={order.order_id} order={order} />
            ))}
          </Stack>
        )}
      </div>
    </MainCards>
  );
}


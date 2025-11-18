import { useMemo } from "react";
import { Chip, Divider, Typography } from "@mui/material";
import MainCards from "~/src/components/ui/MainCards";
import type { Order } from "../../typings";
import dayjs from "dayjs";
import Svg from "~/src/assets/svgs/_index";
import { getLogisticTypeMeliInfo } from "~/src/constants/logistic-type-meli";
import { getStatusOrderMeliInfo } from "~/src/constants/status-order-meli";
import OrderItemCard from "./OrderItemCard";
import toast from "react-hot-toast";

interface OrderCardProps {
  order: Order;
}

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "—";
  return dayjs(dateStr).format("DD MMM YYYY [às] HH:mm");
};

export default function OrderCard({ order }: OrderCardProps) {
  const statusInfo = useMemo(() => getStatusOrderMeliInfo(order.status), [order.status]);
  const logisticTypeInfo = useMemo(
    () => getLogisticTypeMeliInfo(order.shipping_mode ?? ""),
    [order.shipping_mode]
  );

  const deliveryInfo = useMemo(() => {
    const now = dayjs();
    
    // Se tem estimated_delivery e ainda não passou, mostra a previsão
    if (order.estimated_delivery) {
      const estimatedDate = dayjs(order.estimated_delivery);
      if (estimatedDate.isAfter(now) || estimatedDate.isSame(now, "day")) {
        return {
          type: "estimated" as const,
          date: estimatedDate.format("dddd[, dia] D [de] MMMM"),
          label: "Chega",
          isPast: false,
        };
      }
    }
    
    // Se a previsão já passou ou não existe, verifica expiration_date
    if (order.expiration_date) {
      const expirationDate = dayjs(order.expiration_date);
      // Se expiration_date ainda não passou, mostra
      if (expirationDate.isAfter(now) || expirationDate.isSame(now, "day")) {
        return {
          type: "expiration" as const,
          date: expirationDate.format("dddd[, dia] D [de] MMMM"),
          label: "Prazo limite para qualificar",
          isPast: false,
        };
      }
      // Se já passou, está entregue, retorna null
      return null;
    }
    
    return null;
  }, [order.estimated_delivery, order.expiration_date]);

  return (
    <MainCards className="p-4">
      <div className="flex flex-col gap-2">
        {/* Header: ID e Data */}
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Typography variant="caption" color="text.secondary" className="font-mono">
                #{order.order_id}
              </Typography>
              <button
                className="flex items-center gap-1 text-slate-500 hover:text-slate-700"
                onClick={() => {
                  navigator.clipboard.writeText(order.order_id);
                  toast.success("Order ID copiado para a área de transferência");
                }}
              >
                <Svg.copy tailWindClasses="h-4 w-4" />
              </button>
            </div>
            <span className="text-slate-300">|</span>
            <Typography variant="caption" color="text.secondary">
                {formatDate(order.date_created)}
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
            {order.buyer_nickname && (
                <div className="flex items-center gap-2">
                    <Svg.profile tailWindClasses="h-4 w-4 text-slate-500" />
                    <Typography variant="body2" className="text-slate-900">
                    {order.buyer_nickname}
                    </Typography>
                    {order.buyer_id && (
                    <>
                        <span className="text-slate-300">|</span>
                        <Typography variant="caption" color="text.secondary">
                        {order.buyer_id}
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
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {(order.shipment_status || deliveryInfo) && (
              <div className="mt-2">
                {order.shipment_status && (
                  <Typography variant="body1" fontWeight={600} className="text-slate-900 mb-1">
                    {getStatusOrderMeliInfo(order.shipment_status)?.label || order.shipment_status}
                  </Typography>
                )}
                {deliveryInfo && (
                  <Typography variant="body2" fontWeight={400} className="text-slate-700">
                    {deliveryInfo.label} {deliveryInfo.date}
                  </Typography>
                )}
              </div>
            )}

          </div>

        </div>
        {/* Pedido */}
        <OrderItemCard order={order} />
      </div>
    </MainCards>
  );
}


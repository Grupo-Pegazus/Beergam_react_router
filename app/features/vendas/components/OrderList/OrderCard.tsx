import { Chip, Divider, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useMemo } from "react";
import Svg from "~/src/assets/svgs/_index";
import CopyButton from "~/src/components/ui/CopyButton";
import MainCards from "~/src/components/ui/MainCards";
import BeergamButton from "~/src/components/utils/BeergamButton";
import {
  CensorshipWrapper,
  TextCensored,
  useCensorship,
} from "~/src/components/utils/Censorship";
import { getLogisticTypeMeliInfo } from "~/src/constants/logistic-type-meli";
import { getStatusOrderMeliInfo } from "~/src/constants/status-order-meli";
import type { Order } from "../../typings";
import OrderItemCard from "./OrderItemCard";

interface OrderCardProps {
  order: Order;
}

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "—";
  return dayjs(dateStr).format("DD MMM YYYY [às] HH:mm");
};

export default function OrderCard({ order }: OrderCardProps) {
  const { isCensored } = useCensorship();
  const censored = isCensored("vendas_orders_list");
  const statusInfo = useMemo(
    () => getStatusOrderMeliInfo(order.status),
    [order.status]
  );
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
    <MainCards className="p-3 md:p-4 w-full min-w-0">
      <CensorshipWrapper censorshipKey="vendas_orders_list" canChange={false}>
        <div className="flex flex-col gap-2 w-full min-w-0">
          {/* Header: ID e Data */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
              <div className="flex items-center gap-1">
                <Typography
                  variant="caption"
                  className="font-mono text-xs md:text-sm text-beergam-typography-secondary!"
                >
                  #{order.order_id}
                </Typography>
                <CopyButton
                  textToCopy={order.order_id}
                  successMessage="Order ID copiado para a área de transferência"
                  ariaLabel="Copiar Order ID"
                />
              </div>
              <span className="text-slate-300 hidden md:inline">|</span>
              <Typography
                variant="caption"
                className="text-xs md:text-sm text-beergam-typography-secondary!"
              >
                {formatDate(order.date_created)}
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
              {/* Status do envio */}
              {order.shipment_status && (
                <>
                  <span className="text-slate-300 hidden md:inline">|</span>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    className="text-beergam-typography-primary! text-sm md:text-base"
                  >
                    {getStatusOrderMeliInfo(order.shipment_status)
                      ?.label || order.shipment_status}
                  </Typography>
                </>
              )}
            </div>
            {order.buyer_nickname && (
              <div className="flex items-center gap-1.5 md:gap-2">
                <Svg.profile tailWindClasses="h-3.5 w-3.5 md:h-4 md:w-4 text-beergam-typography-secondary!" />
                <TextCensored
                  forceCensor={censored}
                  censorshipKey="vendas_orders_list"
                  replacement="*"
                >
                  <Typography
                    variant="caption"
                    className="text-beergam-typography-primary! text-sm md:text-base"
                  >
                    {order.buyer_nickname} - {order.client?.receiver_name}
                  </Typography>
                </TextCensored>

                {order.buyer_id && (
                  <>
                    <span className="text-slate-300 hidden md:inline">|</span>
                    <TextCensored
                      forceCensor={censored}
                      censorshipKey="vendas_orders_list"
                      replacement="*"
                    >
                      <Typography
                        variant="caption"
                        className="text-xs md:text-sm text-beergam-typography-secondary!"
                      >
                        {order.buyer_id}
                      </Typography>
                    </TextCensored>
                  </>
                )}
              </div>
            )}
          </div>

          <Divider sx={{ my: 0.5 }} />

          {/* Status Chips e Botão de Expandir */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-1.5 md:gap-2">
                <Chip
                  label={statusInfo.label}
                  size="small"
                  icon={(() => {
                    const IconComponent = Svg[statusInfo.icon];
                    return (
                      <IconComponent tailWindClasses="h-3.5 w-3.5 md:h-4 md:w-4" />
                    );
                  })()}
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
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {(order.shipment_status || deliveryInfo) && (
                    <div className="mt-1 md:mt-2">
                      {deliveryInfo && (
                        <Typography
                          variant="caption"
                          fontWeight={400}
                          className="text-beergam-typography-secondary! text-xs md:text-sm"
                        >
                          {censored ? "************" : deliveryInfo.label}{" "}
                          {censored ? "****" : deliveryInfo.date}
                        </Typography>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>

            <BeergamButton
              title="Ver detalhes"
              link={`/interno/vendas/${order.order_id}`}
            />
          </div>

          {/* Pedido */}
          <OrderItemCard order={order} />
        </div>
      </CensorshipWrapper>
    </MainCards>
  );
}

import { Chip, Divider, IconButton, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import Svg from "~/src/assets/svgs/_index";
import Thumbnail from "~/src/components/Thumbnail/Thumbnail";
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
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import type { Order } from "../../typings";
import OrderItemCard from "./OrderItemCard";

interface OrderPackageProps {
  packId: string;
  orders: Order[];
  onReprocess: () => void;
  isReprocessing: boolean;
  remainingQuota: number;
}

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "—";
  return dayjs(dateStr).format("DD MMM YYYY [às] HH:mm");
};

export default function OrderPackage({
  packId,
  orders,
  onReprocess,
  isReprocessing,
  remainingQuota,
}: OrderPackageProps) {
  const { isCensored } = useCensorship();
  const censored = isCensored("vendas_orders_list");
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
    const totalQuantity = orders.reduce(
      (sum, order) => sum + (order.quantity || 0),
      0
    );
    let totalLiquido = orders.reduce(
      (sum, order) => sum + parseFloat(order.valor_base || "0"),
      0
    );

    totalLiquido = totalLiquido - Number(orders[0].custo_envio_final || "0");

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
      <CensorshipWrapper censorshipKey="vendas_orders_list" canChange={false}>
        <div className="flex flex-col gap-2 w-full min-w-0">
        {/* Header: Pack ID e Data */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
            <div className="flex items-center gap-1">
              <Typography
                variant="caption"
                className="font-mono text-xs md:text-sm text-beergam-typography-secondary!"
              >
                #{packId}
              </Typography>
              <CopyButton
                textToCopy={packId}
                successMessage="Pack ID copiado para a área de transferência"
                ariaLabel="Copiar Pack ID"
              />
            </div>
            <span className="text-slate-300 hidden md:inline">|</span>
            <Typography
              variant="caption"
              className="text-xs md:text-sm text-beergam-typography-secondary!"
            >
              {formatDate(firstOrder.date_closed)}
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
            {firstOrder.shipment_status && (
              <>
                <span className="text-slate-300 hidden md:inline">|</span>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  className="text-beergam-typography-primary! text-sm md:text-base"
                >
                  {getStatusOrderMeliInfo(firstOrder.shipment_status)
                    ?.label || firstOrder.shipment_status}
                </Typography>
              </>
            )}
          </div>
          {firstOrder.buyer_nickname && (
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
                  {firstOrder.buyer_nickname}{" "}
                  {firstOrder.client?.receiver_name &&
                    `- ${firstOrder.client?.receiver_name}`}
                </Typography>
              </TextCensored>
              {firstOrder.buyer_id && (
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
                      {firstOrder.buyer_id}
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
            {/* Informação de entrega */}
            {(firstOrder.shipment_status || deliveryInfo) && (
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

          <div className="flex items-center gap-2">
            <BeergamButton
              title={isReprocessing ? "Reprocessando..." : "Reprocessar"}
              animationStyle="fade"
              loading={isReprocessing}
              disabled={isReprocessing || remainingQuota <= 0}
              onClick={onReprocess}
            />
            <BeergamButton
              title="Ver detalhes"
              link={`/interno/vendas/${packId}`}
            />
          </div>
        </div>

        {/* Resumo do Pacote */}
        <div
          className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-2 bg-beergam-section-background! rounded-lg p-2.5 md:p-3 cursor-pointer hover:bg-beergam-section-background-hover! transition-colors"
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
                transform: isPackageExpanded
                  ? "rotate(270deg)"
                  : "rotate(90deg)",
                transition: "transform 0.2s",
                minWidth: "auto",
              }}
            >
              <Svg.chevron tailWindClasses="h-4 w-4 md:h-5 md:w-5 text-beergam-typography-secondary!" />
            </IconButton>

            {/* Thumbnails dos produtos */}
            <div className="flex items-center gap-0.5 md:gap-1 shrink-0">
              {thumbnailsToDisplay.map((item, index) => (
                <div
                  key={index}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-beergam-section-border! overflow-hidden -ml-3 md:-ml-4 shadow-xs first:ml-0 bg-beergam-section-background! flex items-center justify-center"
                >
                  <Thumbnail
                    thumbnail={item.thumbnail || ""}
                    tailWindClasses="w-8! h-8! md:w-10! md:h-10!"
                  />
                </div>
              ))}
              {hasMoreItems && (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-beergam-section-border! bg-beergam-section-background! flex items-center justify-center -ml-3 md:-ml-4">
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    className="text-beergam-typography-secondary! text-xs"
                  >
                    +{remainingCount}
                  </Typography>
                </div>
              )}
            </div>

            <Typography
              variant="body2"
              fontWeight={600}
              className="text-beergam-typography-primary! text-sm md:text-base truncate"
            >
              Pacote de {orders.length} produto{orders.length > 1 ? "s" : ""}
            </Typography>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-2 md:gap-4">
            <div className="text-left md:text-right">
              <Typography
                variant="h6"
                fontWeight={700}
                className="text-beergam-typography-primary! text-base md:text-xl"
              >
                {formatCurrency(packageTotals.totalAmount)}
              </Typography>
              {packageTotals.totalLiquido > 0 && (
                <Typography
                  variant="caption"
                  className="text-xs text-beergam-typography-secondary!"
                >
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
                backgroundColor: "beergam-blue-primary",
                color: "var(--color-beergam-typography-primary)",
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
      </CensorshipWrapper>
    </MainCards>
  );
}

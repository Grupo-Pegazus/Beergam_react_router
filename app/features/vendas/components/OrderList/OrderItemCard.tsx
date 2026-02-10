import { Typography } from "@mui/material";
import { useState } from "react";
import Svg from "~/src/assets/svgs/_index";
import Thumbnail from "~/src/components/Thumbnail/Thumbnail";
import {
  CensorshipWrapper,
  ImageCensored,
  TextCensored,
  useCensorship,
} from "~/src/components/utils/Censorship";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import type { Order } from "../../typings";

interface OrderItemCardProps {
  order: Order;
  censored?: boolean | undefined;
  censorshipKey?: "vendas_orders_list" | "vendas_orders_list_details";
}

function CardInfo({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5 md:gap-1 w-max text-nowrap text-center flex-1 bg-beergam-mui-paper! rounded-lg py-1 px-1.5 md:px-2 border border-beergam-input-border!">
      <p className="text-beergam-typography-secondary! text-xs! md:text-sm! font-medium">
        {label}
      </p>
      <h3 className="text-beergam-primary! text-xs! md:text-sm! font-bold">
        {value}
      </h3>
    </div>
  );
}

function ProfitCardInfo({
  censored,
  label,
  value,
  options,
}: {
  censored?: boolean | undefined;
  label: string;
  value: string | number;
  options?: { money?: boolean; percentage?: boolean };
}) {
  return (
    <div className="flex flex-col gap-0.5 md:gap-1 w-full md:w-[50%] text-center flex-1 bg-beergam-mui-paper! rounded-lg py-1 px-1.5 md:px-2 border border-beergam-input-border!">
      <p className="text-beergam-typography-secondary! text-xs! md:text-sm! font-medium">
        {label}
      </p>
      <h3 className="text-xs! md:text-sm! font-bold text-beergam-primary!">
        {censored ? "****" : formatCurrency(value, options)}
      </h3>
    </div>
  );
}

export default function OrderItemCard({
  order,
  censorshipKey = "vendas_orders_list",
}: OrderItemCardProps) {
  const { isCensored } = useCensorship();
  const censored = isCensored(censorshipKey);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calcula o custo total convertendo todos os valores para número
  const totalCost =
    Number(order.extra_cost || 0) +
    Number(order.price_cost || 0) +
    Number(order.packaging_cost || 0);
    // Number(order.stock_cost || 0);
  
  const profit =
    Number(order.valor_liquido || 0) -
    Number(order.price_cost || 0) -
    Number(order.packaging_cost || 0) -
    Number(order.extra_cost || 0) -
    // Number(order.stock_cost || 0) - 
    Number(order.tax_amount || 0);
  const margin =
    Number(order.total_amount || 0) > 0
      ? (profit / Number(order.total_amount || 0)) * 100
      : 0;

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-2 bg-beergam-section-background! rounded-lg p-2 md:p-2 w-full min-w-0">
      <CensorshipWrapper
        canChange={censorshipKey === "vendas_orders_list_details"}
        censorshipKey={censorshipKey}
        className="w-full flex"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0 w-full md:w-auto">
          <ImageCensored className="w-12! h-12! md:w-16! md:h-16! shrink-0" censorshipKey={censorshipKey}>
            <Thumbnail
              thumbnail={order.thumbnail ?? ""}
              tailWindClasses="w-12! h-12! md:w-16! md:h-16! shrink-0"
            />
          </ImageCensored>
          <div className="flex flex-col gap-0.5 md:gap-1 min-w-0 flex-1 overflow-hidden w-0">
            <TextCensored forceCensor={censored} censorshipKey={censorshipKey}>
              <Typography
                variant="body2"
                fontWeight={600}
                className="text-beergam-typography-primary! text-sm md:text-base"
                noWrap
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  width: "100%",
                  maxWidth: "100%",
                  display: "block",
                }}
              >
                {order.title}
              </Typography>
            </TextCensored>

            <Typography
              variant="caption"
              className="text-xs md:text-sm text-beergam-typography-secondary!"
            >
              {censored ? "****" : order.mlb || "—"} |{" "}
              {censored ? "****" : order.sku || "—"}
            </Typography>
            {order.ad_type && (
              <Typography
                variant="caption"
                className="text-xs md:text-sm text-beergam-typography-secondary!"
              >
                {order.ad_type}
              </Typography>
            )}
          </div>
        </div>

        {/* Mobile: Resumo básico com botão de expandir */}
        <div className="flex md:hidden items-center justify-between gap-2">
          <div className="flex items-center gap-2 bg-beergam-section-background! border border-beergam-input-border! px-2 py-1 rounded-lg">
            <Typography
              variant="caption"
              className="text-xs text-beergam-typography-secondary!"
            >
              Qtd:
            </Typography>
            <Typography
              variant="caption"
              fontWeight={600}
              className="text-beergam-typography-primary! text-sm"
            >
              {censored ? "****" : order.quantity || 0}
            </Typography>
            <span className="text-slate-300">|</span>
            <Typography
              variant="caption"
              className="text-xs text-beergam-typography-secondary!"
            >
              Total Bruto:
            </Typography>
            <Typography
              variant="caption"
              fontWeight={700}
              className="text-beergam-typography-primary! text-sm"
            >
              {censored ? "****" : formatCurrency(order.total_amount)}
            </Typography>
          </div>

          {/* Botão de expandir - Apenas mobile */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-beergam-blue-primary! bg-beergam-blue-primary! hover:bg-beergam-blue-primary-dark! active:bg-beergam-blue-primary-dark! transition-colors touch-manipulation shrink-0"
            aria-label={
              isExpanded
                ? "Recolher detalhes financeiros"
                : "Ver detalhes financeiros"
            }
          >
            <Svg.chevron
              tailWindClasses={`h-4 w-4 transition-transform duration-200 ${
                isExpanded ? "rotate-270" : "rotate-90"
              }`}
            />
          </button>
        </div>

        {/* Mobile: Detalhes financeiros - Expandido */}
        {isExpanded && (
          <div className="flex flex-col md:hidden gap-1.5 bg-beergam-section-background! p-2 rounded-lg w-full">
            <div className="grid grid-cols-2 gap-1.5">
              <CardInfo
                label="Bruto:"
                value={censored ? "****" : formatCurrency(order.total_amount)}
              />
              <CardInfo
                label="Imposto:"
                value={censored ? "****" : formatCurrency(order.tax_amount)}
              />
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <CardInfo
                label="Custo:"
                value={censored ? "****" : formatCurrency(totalCost)}
              />
              <ProfitCardInfo
                censored={censored}
                label="Lucro:"
                value={censored ? "****" : profit}
              />
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              <ProfitCardInfo
                label="Margem:"
                censored={censored}
                value={censored ? "*" : margin}
                options={{ percentage: true }}
              />
            </div>
          </div>
        )}

        {/* Desktop: Detalhes financeiros - Sempre visíveis */}
        <div className="hidden md:flex flex-col items-center gap-2 w-max bg-beergam-section-background! p-2 rounded-lg shrink-0">
          <div className="flex items-center gap-2 w-full">
            <CardInfo
              label="Qtd:"
              value={censored ? "*" : order.quantity || 0}
            />
            <CardInfo
              label="Bruto:"
              value={censored ? "*" : formatCurrency(order.total_amount)}
            />
            <CardInfo
              label="Imposto:"
              value={censored ? "*" : formatCurrency(order.tax_amount)}
            />
            <CardInfo
              label="Custo:"
              value={censored ? "*" : formatCurrency(totalCost)}
            />
          </div>
          <div className="flex items-center gap-2 w-full">
            <ProfitCardInfo censored={censored} label="Lucro:" value={profit} />
            <ProfitCardInfo
              label="Margem:"
              censored={censored}
              value={margin}
              options={{ percentage: true }}
            />
          </div>
        </div>
      </CensorshipWrapper>
    </div>
  );
}

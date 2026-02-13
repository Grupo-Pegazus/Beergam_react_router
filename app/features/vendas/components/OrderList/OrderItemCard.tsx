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
    <div className="flex flex-col gap-0.5 md:gap-1 min-w-[5.5rem] text-center flex-1 bg-beergam-mui-paper! rounded-lg py-1 px-1.5 md:px-2 border border-beergam-input-border!">
      <p className="text-beergam-typography-secondary! text-xs! md:text-sm! font-medium">
        {label}
      </p>
      <h3 className="text-beergam-primary! text-xs! md:text-sm! font-bold whitespace-nowrap overflow-hidden text-ellipsis" title={String(value)}>
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
  const displayValue = censored ? "****" : formatCurrency(value, options);
  return (
    <div className="flex flex-col gap-0.5 md:gap-1 min-w-[5.5rem] w-full md:w-[50%] text-center flex-1 bg-beergam-mui-paper! rounded-lg py-1 px-1.5 md:px-2 border border-beergam-input-border!">
      <p className="text-beergam-typography-secondary! text-xs! md:text-sm! font-medium">
        {label}
      </p>
      <h3 className="text-xs! md:text-sm! font-bold text-beergam-primary! whitespace-nowrap overflow-hidden text-ellipsis" title={String(displayValue)}>
        {displayValue}
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
  
  // Custo total e lucro/margem vindos do backend
  const totalCost = order.total_cost ?? 0;

  const profit = order.profit ?? 0;
  const margin = order.profit_margin ?? 0;

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-2 bg-beergam-section-background! rounded-xl p-3 md:p-2 w-full min-w-0 border border-beergam-input-border/20">
      <CensorshipWrapper
        canChange={censorshipKey === "vendas_orders_list_details"}
        censorshipKey={censorshipKey}
        className="w-full flex flex-col md:flex-row gap-3 md:gap-2"
      >
        {/* Produto: thumb + info + preço (mobile tudo em linha, compacto) */}
        <div className="flex items-center gap-3 flex-1 min-w-0 w-full md:w-auto">
          <ImageCensored className="w-12! h-12! md:w-16! md:h-16! shrink-0 rounded-lg overflow-hidden" censorshipKey={censorshipKey}>
            <Thumbnail
              thumbnail={order.thumbnail ?? ""}
              tailWindClasses="w-12! h-12! md:w-16! md:h-16! shrink-0 object-cover"
            />
          </ImageCensored>
          <div className="flex flex-col gap-0.5 min-w-0 flex-1 overflow-hidden">
            <TextCensored forceCensor={censored} censorshipKey={censorshipKey}>
              <Typography
                variant="body2"
                fontWeight={600}
                className="text-beergam-typography-primary! text-sm md:text-base line-clamp-2"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {order.title}
              </Typography>
            </TextCensored>
            <Typography
              variant="caption"
              className="text-xs md:text-sm text-beergam-typography-secondary! truncate hidden md:block"
            >
              {censored ? "****" : order.mlb || "—"} | {censored ? "****" : order.sku || "—"}
            </Typography>
            {order.ad_type && (
              <Typography
                variant="caption"
                className="text-xs text-beergam-typography-secondary! hidden md:block"
              >
                {order.ad_type}
              </Typography>
            )}
          </div>
          {/* Mobile: preço + expandir em linha com o produto */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <Typography
              variant="body2"
              fontWeight={700}
              className="text-beergam-primary! text-sm"
            >
              {censored ? "****" : formatCurrency(order.total_amount)}
            </Typography>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-beergam-blue-primary! bg-beergam-blue-primary/10 hover:bg-beergam-blue-primary/20 transition-colors touch-manipulation shrink-0"
              aria-label={
                isExpanded ? "Recolher detalhes" : "Ver detalhes financeiros"
              }
            >
              <Svg.chevron
                tailWindClasses={`h-4 w-4 text-beergam-blue-primary! transition-transform duration-200 ${
                  isExpanded ? "rotate-270" : "rotate-90"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile: Detalhes financeiros - Expandido, layout em lista com mais espaço */}
        {isExpanded && (
          <div className="flex flex-col md:hidden gap-3 w-full py-2">
            {[
              { label: "Qtd", value: censored ? "****" : order.quantity ?? 0 },
              { label: "Bruto", value: censored ? "****" : formatCurrency(order.total_amount) },
              { label: "Imposto", value: censored ? "****" : formatCurrency(order.tax_amount) },
              { label: "Custo", value: censored ? "****" : formatCurrency(totalCost) },
              { label: "Lucro", value: censored ? "****" : formatCurrency(profit) },
              { label: "Margem", value: censored ? "****" : `${margin}%`, highlight: true },
            ].map(({ label, value, highlight }) => (
              <div
                key={label}
                className="flex justify-between items-center py-1.5 border-b border-beergam-input-border/30 last:border-0"
              >
                <span className="text-xs text-beergam-typography-secondary!">{label}</span>
                <span
                  className={`text-sm font-semibold ${highlight ? "text-beergam-primary!" : "text-beergam-typography-primary!"}`}
                >
                  {value}
                </span>
              </div>
            ))}
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

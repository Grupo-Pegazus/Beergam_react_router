import { useState } from "react";
import { Typography } from "@mui/material";
import type { Order } from "../../typings";
import Thumbnail from "~/src/components/Thumbnail/Thumbnail";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import Svg from "~/src/assets/svgs/_index";

interface OrderItemCardProps {
  order: Order;
}

function CardInfo({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5 md:gap-1 w-max text-nowrap text-center flex-1 bg-white rounded-lg py-1 px-1.5 md:px-2 border border-slate-200">
      <p className="text-slate-500 text-xs! md:text-sm! font-medium">{label}</p>
      <h3 className="text-slate-900 text-xs! md:text-sm! font-bold">{value}</h3>
    </div>
  );
}

function ProfitCardInfo({ label, value, options }: { label: string; value: string | number; options?: { money?: boolean; percentage?: boolean } }) {
  return (
    <div className="flex flex-col gap-0.5 md:gap-1 w-full md:w-[50%] text-center flex-1 bg-white rounded-lg py-1 px-1.5 md:px-2 border border-slate-200">
      <p className="text-slate-500 text-xs! md:text-sm! font-medium">{label}</p>
      <h3 className="text-xs! md:text-sm! font-bold text-green-500">{formatCurrency(value, options)}</h3>
    </div>
  );
}

export default function OrderItemCard({ order }: OrderItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const profit = Number(order.valor_base) - Number(order.extra_cost) - Number(order.tax_amount);
  const margin = Number(order.valor_base) > 0 
    ? ((profit / Number(order.valor_base)) * 100) 
    : 0;

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-2 bg-slate-200 rounded-lg p-2 md:p-2 w-full min-w-0">
      <div className="flex items-center gap-2 flex-1 min-w-0 w-full md:w-auto">
        <Thumbnail thumbnail={order.thumbnail ?? ""} tailWindClasses="w-12! h-12! md:w-16! md:h-16! shrink-0" />
        <div className="flex flex-col gap-0.5 md:gap-1 min-w-0 flex-1 overflow-hidden w-0">
          <Typography 
            variant="body2" 
            fontWeight={600} 
            className="text-slate-900 text-sm md:text-base"
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
          <Typography variant="caption" color="text.secondary" className="text-xs md:text-sm">
            {order.mlb || "—"} | {order.sku || "—"}
          </Typography>
          {order.ad_type && (
            <Typography variant="caption" color="text.secondary" className="text-xs md:text-sm">
              {order.ad_type}
            </Typography>
          )}
        </div>
      </div>
      
      {/* Mobile: Resumo básico com botão de expandir */}
      <div className="flex md:hidden items-center justify-between gap-2">
        <div className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded-lg">
          <Typography variant="caption" color="text.secondary" className="text-xs">
            Qtd:
          </Typography>
          <Typography variant="body2" fontWeight={600} className="text-slate-900 text-sm">
            {order.quantity || 0}
          </Typography>
          <span className="text-slate-300">|</span>
          <Typography variant="caption" color="text.secondary" className="text-xs">
            Total:
          </Typography>
          <Typography variant="body2" fontWeight={700} className="text-slate-900 text-sm">
            {formatCurrency(order.valor_base)}
          </Typography>
        </div>
        
        {/* Botão de expandir - Apenas mobile */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 transition-colors touch-manipulation shrink-0"
          aria-label={isExpanded ? "Recolher detalhes financeiros" : "Ver detalhes financeiros"}
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
        <div className="flex flex-col md:hidden gap-1.5 bg-slate-100 p-2 rounded-lg w-full">
          <div className="grid grid-cols-2 gap-1.5">
            <CardInfo label="Bruto:" value={formatCurrency(order.valor_base)} />
            <CardInfo label="Imposto:" value={formatCurrency(order.tax_amount)} />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <CardInfo label="Custo:" value={formatCurrency(order.extra_cost)} />
            <ProfitCardInfo label="Lucro:" value={profit} />
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            <ProfitCardInfo label="Margem:" value={margin} options={{ percentage: true }} />
          </div>
        </div>
      )}

      {/* Desktop: Detalhes financeiros - Sempre visíveis */}
      <div className="hidden md:flex flex-col items-center gap-2 w-[max-content] bg-slate-100 p-2 rounded-lg shrink-0">
        <div className="flex items-center gap-2 w-full">
          <CardInfo label="Qtd:" value={order.quantity || 0} />
          <CardInfo label="Bruto:" value={formatCurrency(order.valor_base)} />
          <CardInfo label="Imposto:" value={formatCurrency(order.tax_amount)} />
          <CardInfo label="Custo:" value={formatCurrency(order.extra_cost)} />
        </div>
        <div className="flex items-center gap-2 w-full">
          <ProfitCardInfo label="Lucro:" value={profit} />
          <ProfitCardInfo label="Margem:" value={margin} options={{ percentage: true }} />
        </div>
      </div>
    </div>
  );
}


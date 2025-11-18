import { Typography } from "@mui/material";
import type { Order } from "../../typings";
import Thumbnail from "~/src/components/Thumbnail/Thumbnail";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";

interface OrderItemCardProps {
  order: Order;
}

function CardInfo({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1 w-[25%] text-center flex-1 bg-white rounded-lg py-1 px-2 border border-slate-200">
      <p className="text-slate-500 text-sm! font-medium">{label}</p>
      <h3 className="text-slate-900 text-sm! font-bold">{value}</h3>
    </div>
  );
}

function ProfitCardInfo({ label, value, options }: { label: string; value: string | number; options?: { money?: boolean; percentage?: boolean } }) {
  return (
    <div className="flex flex-col gap-1 w-[50%] text-center flex-1 bg-white rounded-lg py-1 px-2 border border-slate-200">
      <p className="text-slate-500 text-sm! font-medium">{label}</p>
      <h3 className="text-sm! font-bold text-green-500">{formatCurrency(value, options)}</h3>
    </div>
  );
}

export default function OrderItemCard({ order }: OrderItemCardProps) {
  return (
    <div className="flex justify-between items-center gap-2 bg-slate-200 rounded-lg p-2 w-full">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Thumbnail thumbnail={order.thumbnail ?? ""} />
        <div className="flex flex-col gap-1 min-w-0">
          <Typography variant="body2" fontWeight={600} className="text-slate-900 truncate">
            {order.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {order.mlb || "—"} | {order.sku || "—"}
          </Typography>
          {order.ad_type && (
            <Typography variant="caption" color="text.secondary">
              {order.ad_type}
            </Typography>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 w-[30%] bg-slate-100 p-2 rounded-lg shrink-0">
        <div className="flex items-center gap-2 w-full">
          <CardInfo label="Qtd:" value={order.quantity || 0} />
          <CardInfo label="Bruto:" value={formatCurrency(order.valor_base)} />
          <CardInfo label="Imposto:" value={formatCurrency(order.tax_amount)} />
          <CardInfo label="Custo:" value={formatCurrency(order.extra_cost)} />
        </div>
        <div className="flex items-center gap-2 w-full">
          <ProfitCardInfo 
            label="Lucro:" 
            value={Number(order.valor_base) - Number(order.extra_cost) - Number(order.tax_amount)} 
          />
          <ProfitCardInfo 
            label="Margem:" 
            value={((Number(order.valor_base) - Number(order.extra_cost) - Number(order.tax_amount)) / Number(order.valor_base) * 100)} 
            options={{ percentage: true }} 
          />
        </div>
      </div>
    </div>
  );
}


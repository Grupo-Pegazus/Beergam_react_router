import { Link } from "react-router";
import type { StockDashboardResponse } from "../../typings";
import MainCards from "~/src/components/ui/MainCards";
import Svg from "~/src/assets/svgs/_index";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";

interface LowStockVariationsListProps {
  variations: StockDashboardResponse["low_stock_variations"];
}

function formatNumber(value: number) {
  return value.toLocaleString("pt-BR");
}

export default function LowStockVariationsList({
  variations,
}: LowStockVariationsListProps) {
  if (variations.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-amber-200 bg-white p-10 text-center">
        <Svg.check_circle tailWindClasses="mx-auto h-8 w-8 text-emerald-500" />
        <p className="mt-2 text-sm text-slate-500">
          Nenhuma variação com estoque baixo encontrada.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {variations.map((variation) => {
        const isLowStock = variation.available_quantity <= variation.minimum_quantity;

        return (
          <Link
            key={variation.variation_id}
            to={
              variation.product_id
                ? `/interno/produtos/estoque/${variation.product_id}?variation=${variation.variation_id}`
                : "#"
            }
            className="block"
          >
            <MainCards className="hover:bg-slate-50/50 transition-colors h-full">
              <div className="p-4 space-y-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {variation.title}
                  </p>
                  {variation.product_title && (
                    <p className="text-xs text-slate-500 mt-1">
                      Produto: {variation.product_title}
                    </p>
                  )}
                  {variation.sku && (
                    <p className="text-xs text-slate-500">SKU: {variation.sku}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Estoque:</span>
                    <span
                      className={`text-sm font-semibold ${
                        isLowStock ? "text-amber-600" : "text-slate-900"
                      }`}
                    >
                      {formatNumber(variation.available_quantity)} /{" "}
                      {formatNumber(variation.minimum_quantity)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">
                      Valor em estoque:
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {formatCurrency(variation.stock_value.toString())}
                    </span>
                  </div>
                </div>
                {isLowStock && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 mt-2">
                    <p className="text-xs text-amber-700 flex items-center gap-1">
                      <Svg.warning_circle tailWindClasses="h-4 w-4 shrink-0" />
                      <span>Estoque abaixo do mínimo</span>
                    </p>
                  </div>
                )}
              </div>
            </MainCards>
          </Link>
        );
      })}
    </div>
  );
}


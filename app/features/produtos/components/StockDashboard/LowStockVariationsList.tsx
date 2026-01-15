import { Link } from "react-router";
import Svg from "~/src/assets/svgs/_index";
import MainCards from "~/src/components/ui/MainCards";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import type { StockDashboardResponse } from "../../typings";

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
        const isLowStock =
          variation.available_quantity <= variation.minimum_quantity;

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
            <MainCards className="hover:bg-beergam-primary/20! h-full">
              <div className="p-4 space-y-2">
                <div>
                  <p className="text-sm font-semibold text-beergam-typography-primary!">
                    {variation.title}
                  </p>
                  {variation.product_title && (
                    <p className="text-xs mt-1">
                      Produto:{" "}
                      <span className="text-beergam-typography-tertiary!">
                        {variation.product_title}
                      </span>
                    </p>
                  )}
                  {variation.sku && (
                    <p className="text-xs">
                      SKU:{" "}
                      <span className="text-beergam-typography-tertiary!">
                        {variation.sku}
                      </span>
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-beergam-typography-secondary!">
                      Estoque:
                    </span>
                    <span
                      className={`text-sm font-semibold text-beergam-typography-tertiary! ${
                        isLowStock
                          ? "text-beergam-red"
                          : "text-beergam-typography-primary!"
                      }`}
                    >
                      {formatNumber(variation.available_quantity)} /{" "}
                      {formatNumber(variation.minimum_quantity)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-beergam-typography-secondary!">
                      Valor em estoque:
                    </span>
                    <span className="text-sm font-semibold text-beergam-typography-tertiary!">
                      {formatCurrency(variation.stock_value.toString())}
                    </span>
                  </div>
                </div>
                {isLowStock && (
                  <div className="rounded-lg border border-beergam-red bg-beergam-red/10 p-2 mt-2">
                    <p className="text-xs text-beergam-red! flex items-center gap-1">
                      <Svg.warning_circle tailWindClasses="h-4 w-4 shrink-0" />
                      Estoque abaixo do mínimo
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

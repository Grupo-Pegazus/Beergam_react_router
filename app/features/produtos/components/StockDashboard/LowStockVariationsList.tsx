import { Link } from "react-router";
import MainCards from "~/src/components/ui/MainCards";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import type { StockDashboardResponse } from "../../typings";
import { BeergamAlert } from "~/src/components/ui/BeergamAlert";

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
      <BeergamAlert
        severity="info"
      >
        <p className="text-beergam-typography-primary!">Nenhuma variação com estoque baixo encontrada.</p>
      </BeergamAlert>
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
            <MainCards className="hover:bg-beergam-primary-light/50 transition-colors h-full">
              <div className="p-4 space-y-2">
                <div>
                  <p className="text-sm font-semibold text-beergam-typography-primary!">
                    {variation.title}
                  </p>
                  {variation.product_title && (
                    <p className="text-xs mt-1 text-beergam-typography-secondary!">
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
                          ? "text-beergam-primary"
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
                    <BeergamAlert
                      severity="warning"
                    >
                      <p className="text-beergam-typography-primary!">Estoque abaixo do mínimo</p>
                    </BeergamAlert>
                )}
              </div>
            </MainCards>
          </Link>
        );
      })}
    </div>
  );
}

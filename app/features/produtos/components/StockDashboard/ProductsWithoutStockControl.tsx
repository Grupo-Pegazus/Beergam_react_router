import { Link } from "react-router";
import type { StockDashboardResponse } from "../../typings";
import MainCards from "~/src/components/ui/MainCards";
import ProductImage from "../ProductImage/ProductImage";
import Svg from "~/src/assets/svgs/_index";

interface ProductsWithoutStockControlProps {
  products: StockDashboardResponse["products_without_stock_control"];
}

export default function ProductsWithoutStockControl({
  products,
}: ProductsWithoutStockControlProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-emerald-200 bg-white p-10 text-center">
        <Svg.check_circle tailWindClasses="mx-auto h-8 w-8 text-emerald-500" />
        <p className="mt-2 text-sm text-slate-500">
          Todos os produtos possuem controle de estoque ativo.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const mainImageId =
          product.images?.product?.[0] ||
          product.variations?.[0]?.images?.product?.[0];

        return (
          <Link
            key={product.product_id}
            to={`/interno/produtos/${product.product_id}`}
            className="block"
          >
            <MainCards className="hover:bg-slate-50/50 transition-colors h-full">
              <div className="flex items-start gap-3 p-4">
                <ProductImage
                  imageId={mainImageId}
                  alt={product.title}
                  size="medium"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {product.title}
                  </p>
                  {product.sku && (
                    <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                  )}
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 mt-2">
                    <p className="text-xs text-amber-700 flex items-center gap-1">
                      <Svg.information_circle tailWindClasses="h-4 w-4 shrink-0" />
                      <span>Sem controle de estoque ativo</span>
                    </p>
                  </div>
                </div>
              </div>
            </MainCards>
          </Link>
        );
      })}
    </div>
  );
}


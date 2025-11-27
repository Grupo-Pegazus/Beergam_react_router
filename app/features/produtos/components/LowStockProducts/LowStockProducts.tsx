import { useMemo } from "react";
import { useProducts } from "../../hooks";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import MainCards from "~/src/components/ui/MainCards";
import ProductImage from "../ProductImage/ProductImage";
import Svg from "~/src/assets/svgs/_index";
import LowStockProductsSkeleton from "./LowStockProductsSkeleton";
import type { Product } from "../../typings";

export default function LowStockProducts() {
  const { data, isLoading, error } = useProducts({
    per_page: 100,
    sort_by: "created_at",
    sort_order: "desc",
  });

  const lowStockProducts = useMemo(() => {
    if (!data?.success || !data.data?.products) return [];
    
    // Por enquanto, retorna os primeiros 4 produtos
    // TODO: Quando o backend retornar dados de estoque na lista ou tivermos endpoint específico,
    // calcular a proporção: (available_quantity - minimum_quantity) / (maximum_quantity - minimum_quantity) * 100
    // e ordenar por menor proporção
    return data.data.products.slice(0, 4);
  }, [data]);

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error as unknown}
      Skeleton={LowStockProductsSkeleton}
      ErrorFallback={() => (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
          Não foi possível carregar os produtos com menor estoque.
        </div>
      )}
    >
      {lowStockProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-amber-200 bg-white p-10 text-center">
          <Svg.warning_circle tailWindClasses="mx-auto h-8 w-8 text-amber-500" />
          <p className="mt-2 text-sm text-slate-500">
            Nenhum produto com estoque baixo encontrado.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {lowStockProducts.map((product) => (
            <LowStockCard key={product.product_id} product={product} />
          ))}
        </div>
      )}
    </AsyncBoundary>
  );
}

function LowStockCard({ product }: { product: Product }) {
  const mainImageId =
    product.images?.product?.[0] ||
    product.variations?.[0]?.images?.product?.[0];

  const variationsCount = product.variations?.length || 0;

  return (
    <MainCards className="relative flex h-full flex-col gap-3 p-4">
      <div className="flex items-start gap-3">
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
          <div className="flex items-center gap-2 mt-2">
            <Chip
              label={product.registration_type}
              variant={
                product.registration_type === "Completo" ? "default" : "outlined"
              }
            />
            {variationsCount > 0 && (
              <span className="text-xs text-slate-500">
                {variationsCount} var{variationsCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-2">
          <p className="text-xs text-amber-700 flex items-center gap-1">
            <Svg.information_circle tailWindClasses="h-4 w-4 shrink-0" />
            <span>Dados de estoque serão exibidos quando disponíveis</span>
          </p>
        </div>
      </div>
    </MainCards>
  );
}

function Chip({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "default" | "outlined";
}) {
  const baseClasses =
    "px-2 py-0.5 rounded text-xs font-semibold";
  const variantClasses =
    variant === "default"
      ? "bg-blue-100 text-blue-700"
      : "bg-slate-100 text-slate-700 border border-slate-300";

  return (
    <span className={`${baseClasses} ${variantClasses}`}>{label}</span>
  );
}


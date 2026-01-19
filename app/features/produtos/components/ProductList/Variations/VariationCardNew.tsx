import { Typography } from "@mui/material";
import type { Product, ProductDetails } from "../../../typings";
import {
  PriceCell,
  ProductInfoCell,
  SalesQuantityCell,
  SkuCell,
  StatusCell,
  StockCell,
} from "../ProductCardCells";

interface VariationCardNewProps {
  variation: Product["variations"][0] | ProductDetails["variations"][0];
  isMutating: boolean;
  onToggleStatus: (variationId: string, currentStatus: string) => void;
}

export default function VariationCardNew({
  variation,
  isMutating,
  onToggleStatus,
}: VariationCardNewProps) {
  const variationImageUrl = variation.images?.product?.[0];
  const isActive = variation.status.toLowerCase().trim() === "ativo";
  // categories pode existir em VariationBasicSchema mas não em VariationFullSchema
  const categoryName =
    "categories" in variation ? variation.categories?.[0]?.name : undefined;

  return (
    <div className="flex flex-col gap-2">
      <ProductInfoCell
        imageUrl={variationImageUrl}
        title={variation.title}
        registrationType="Variação"
        categoryName={categoryName}
        isVariation={true}
      />
      <PriceCell
        price={variation.price_sale as number | string | null | undefined}
        isVariation={true}
      />
      <SkuCell sku={variation.sku} isVariation={true} />
      <SalesQuantityCell
        quantity={
          "sales_quantity" in variation ? variation.sales_quantity : undefined
        }
        isVariation={true}
      />
      <StockCell
        stock={variation.available_quantity ?? null}
        isVariation={true}
      />
      <StatusCell
        hasVariations={false}
        variationsCount={0}
        status={variation.status}
        isActive={isActive}
        isMutating={isMutating}
        onToggleStatus={() =>
          onToggleStatus(variation.product_variation_id, variation.status)
        }
        onOpenVariationsModal={() => {}}
      />
      {/* Atributos da variação */}
      {variation.attributes && variation.attributes.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <p>Atributos:</p>
          <div className="flex flex-wrap gap-2">
            {variation.attributes.map((attr, attrIndex) => (
              <Typography
                key={attrIndex}
                variant="caption"
                className="text-xs text-beergam-typography-primary!"
              >
                <strong>{attr.name}:</strong> {attr.value.join(", ")}
              </Typography>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

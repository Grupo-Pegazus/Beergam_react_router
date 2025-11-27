import type { Product } from "../../../typings";
import VariationCard from "./VariationCard";
import ProductImage from "../../ProductImage/ProductImage";

interface VariationsListProps {
  variations: Product["variations"];
  product: Product;
}

export default function VariationsList({
  variations,
  product,
}: VariationsListProps) {
  if (!variations || variations.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start gap-3">
        {product.images?.product?.[0] && (
          <ProductImage
            imageId={product.images.product[0]}
            alt={product.title}
            size="small"
            className="hidden sm:block"
          />
        )}
        <div className="flex-1 min-w-0 w-full">
          <div className="space-y-0 border-t border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
            {variations.map((variation) => (
              <VariationCard
                key={variation.product_variation_id}
                variation={variation}
                productId={product.product_id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


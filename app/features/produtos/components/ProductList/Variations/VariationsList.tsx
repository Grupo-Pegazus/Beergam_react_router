import type { Product } from "../../../typings";
import VariationCard from "./VariationCard";

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
    <div className="space-y-2">
      {variations.map((variation) => (
        <VariationCard
          key={variation.product_variation_id}
          variation={variation}
          productId={product.product_id}
        />
      ))}
    </div>
  );
}


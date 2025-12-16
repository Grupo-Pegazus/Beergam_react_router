import type { Variation } from "../../../typings";
import { groupVariationsByCommonAttributes } from "../../AnuncioList/Variations/utils";
import VariationSkuInput from "./VariationSkuInput";

interface VariationsGroupProps {
  variations: Variation[];
  skuValues: Record<string, string>;
  onSkuChange: (variationId: string, value: string) => void;
  mlb: string;
  onUseMlbAsSku: (variationId: string) => void;
}

export default function VariationsGroup({
  variations,
  skuValues,
  onSkuChange,
  mlb,
  onUseMlbAsSku,
}: VariationsGroupProps) {
  if (variations.length === 0) return null;

  const groupedVariations = groupVariationsByCommonAttributes(variations);

  return (
    <div className="space-y-3">
      {groupedVariations.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-2">
          {/* Lista de variações */}
          <div className="space-y-2 border-t border-slate-200 pt-2">
            {group.variations.map((variation) => (
              <VariationSkuInput
                key={variation.variation_id}
                variation={variation}
                value={skuValues[variation.variation_id] || ""}
                onChange={(value) => onSkuChange(variation.variation_id, value)}
                varyingAttributeIds={group.varyingAttributeIds}
                mlb={mlb}
                onUseMlbAsSku={() => onUseMlbAsSku(variation.variation_id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}


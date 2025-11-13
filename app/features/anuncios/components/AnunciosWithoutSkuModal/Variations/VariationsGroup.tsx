import { Typography } from "@mui/material";
import type { Variation } from "../../../typings";
import { groupVariationsByCommonAttributes } from "../../AnuncioList/Variations/utils";
import VariationSkuInput from "./VariationSkuInput";

interface VariationsGroupProps {
  variations: Variation[];
  skuValues: Record<string, string>;
  onSkuChange: (variationId: string, value: string) => void;
}

export default function VariationsGroup({
  variations,
  skuValues,
  onSkuChange,
}: VariationsGroupProps) {
  if (variations.length === 0) return null;

  const groupedVariations = groupVariationsByCommonAttributes(variations);

  return (
    <div className="space-y-3">
      {groupedVariations.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-2">
          {/* Atributos comuns */}
          {group.commonAttributes.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {group.commonAttributes.map((attr, idx) => (
                <div key={attr.id} className="flex items-center gap-2 flex-wrap">
                  <Typography
                    variant="caption"
                    className="text-slate-600 text-xs wrap-break-word"
                  >
                    {attr.name}:{" "}
                    <span className="font-semibold text-slate-900">
                      {attr.value_name}
                    </span>
                  </Typography>
                  {idx < group.commonAttributes.length - 1 && (
                    <span className="text-slate-300 hidden sm:inline">|</span>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Lista de variações */}
          <div className="space-y-2 border-t border-slate-200 pt-2">
            {group.variations.map((variation) => (
              <VariationSkuInput
                key={variation.variation_id}
                variation={variation}
                value={skuValues[variation.variation_id] || ""}
                onChange={(value) => onSkuChange(variation.variation_id, value)}
                varyingAttributeId={group.varyingAttributeId}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}


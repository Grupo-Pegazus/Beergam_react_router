import { Typography } from "@mui/material";
import type { Anuncio, Variation } from "../../../typings";
import { groupVariationsByCommonAttributes } from "./utils";
import VariationCard from "./VariationCard";

interface VariationsListProps {
  variations: Variation[];
  anuncio: Anuncio;
}

export default function VariationsList({
  variations,
  anuncio,
}: VariationsListProps) {
  if (variations.length === 0) return null;

  const groupedVariations = groupVariationsByCommonAttributes(variations);

  return (
    <div className="space-y-4">
      {groupedVariations.map((group, groupIndex) => (
        <div key={groupIndex} className="flex flex-col sm:flex-row items-start gap-3">
          {anuncio.thumbnail && (
            <img
              src={anuncio.thumbnail}
              alt={anuncio.name}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded object-cover shrink-0 hidden sm:block"
            />
          )}
          <div className="flex-1 min-w-0 w-full">
            {/* Atributos comuns */}
            {group.commonAttributes.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-3 px-2 sm:px-0">
                {group.commonAttributes.map((attr, idx) => (
                  <div key={attr.id} className="flex items-center gap-2 flex-wrap">
                    <Typography variant="caption" className="text-slate-600 text-xs">
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
            <div className="space-y-0 border-t border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
              {group.variations.map((variation) => (
                <VariationCard
                  key={variation.variation_id}
                  variation={variation}
                  varyingAttributeId={group.varyingAttributeId}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


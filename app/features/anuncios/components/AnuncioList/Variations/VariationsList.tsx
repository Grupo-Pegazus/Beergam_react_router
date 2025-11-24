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
            {/* Lista de variações */}
            <div className="space-y-0 border-t border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
              {group.variations.map((variation) => (
                <VariationCard
                  key={variation.variation_id}
                  variation={variation}
                  varyingAttributeIds={group.varyingAttributeIds}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


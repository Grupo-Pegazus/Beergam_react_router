import CopyButton from "~/src/components/ui/CopyButton";
import type { Variation } from "../../../typings";
import { formatNumber } from "../utils";

interface VariationCardProps {
  variation: Variation;
  varyingAttributeIds: string[];
  isLast?: boolean;
}

export default function VariationCard({
  variation,
  varyingAttributeIds,
  isLast = false,
}: VariationCardProps) {
  // Pega todos os atributos que variam
  const varyingAttributes =
    varyingAttributeIds.length > 0
      ? variation.attributes.filter((attr) =>
          varyingAttributeIds.includes(attr.id)
        )
      : variation.attributes;

  return (
    <div
      className={`
        flex flex-col sm:flex-row sm:items-center sm:justify-between 
        py-3 px-3 sm:py-2.5 sm:px-3 
        ${!isLast ? "border-b border-beergam-border" : ""} 
        hover:bg-beergam-hover transition-colors 
        gap-2 sm:gap-3
      `}
    >
      {varyingAttributes.length > 0 ? (
        <>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {varyingAttributes.map((attr, idx) => (
                <span
                  key={attr.id}
                  className="text-sm text-beergam-typography-secondary"
                >
                  {attr.name}:{" "}
                  <span className="text-beergam-typography-primary font-semibold">
                    {attr.value_name || "-"}
                  </span>
                  {idx < varyingAttributes.length - 1 && (
                    <span className="text-beergam-typography-tertiary mx-1.5 hidden sm:inline">
                      •
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:ml-auto">
            <span className="font-semibold whitespace-nowrap bg-beergam-orange/10 text-beergam-orange px-2 py-0.5 rounded-full">
              {formatNumber(variation.stock)} un.
            </span>
            {variation.sku && (
              <div className="flex items-center gap-1.5 bg-beergam-mui-paper px-2 py-0.5 rounded-full border border-beergam-border">
                <span className="font-mono text-beergam-typography-secondary break-all sm:break-normal">
                  {variation.sku}
                </span>
                <CopyButton
                  textToCopy={variation.sku}
                  successMessage="SKU copiado"
                  className="flex items-center text-beergam-typography-tertiary hover:text-beergam-typography-primary transition-colors shrink-0 touch-manipulation"
                  iconSize="h-3.5 w-3.5"
                  ariaLabel="Copiar SKU"
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs w-full">
          <span className="font-semibold whitespace-nowrap text-beergam-orange bg-beergam-orange/10 px-2 py-0.5 rounded-full">
            {formatNumber(variation.stock)} un.
          </span>
          {variation.sku && (
            <div className="flex items-center gap-1.5 bg-beergam-mui-paper px-2 py-0.5 rounded-full border border-beergam-border">
              <span className="font-mono text-beergam-typography-secondary break-all sm:break-normal">
                {variation.sku}
              </span>
              <CopyButton
                textToCopy={variation.sku}
                successMessage="SKU copiado"
                className="flex items-center text-beergam-typography-tertiary hover:text-beergam-typography-primary transition-colors shrink-0 touch-manipulation"
                iconSize="h-3.5 w-3.5"
                ariaLabel="Copiar SKU"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}


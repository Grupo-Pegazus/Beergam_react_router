import { Typography } from "@mui/material";
import Svg from "~/src/assets/svgs/_index";
import toast from "react-hot-toast";
import type { Variation } from "../../../typings";
import { formatNumber } from "../utils";

interface VariationCardProps {
  variation: Variation;
  varyingAttributeId: string | null;
}

export default function VariationCard({
  variation,
  varyingAttributeId,
}: VariationCardProps) {
  // Pega apenas o atributo que varia (ex: Tamanho)
  const varyingAttribute = varyingAttributeId
    ? variation.attributes.find((attr) => attr.id === varyingAttributeId)
    : null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center md:max-w-[30%] sm:justify-between py-3 px-3 sm:py-2 sm:px-2 border-b border-slate-200 last:border-b-0 hover:bg-white sm:hover:bg-slate-50 transition-colors gap-2 sm:gap-0">
      {varyingAttribute ? (
        <>
          <div className="flex-1 min-w-0">
            <Typography variant="body2" className="text-slate-700 font-medium">
              {varyingAttribute.name}:{" "}
              <span className="text-slate-900 font-semibold">
                {varyingAttribute.value_name}
              </span>
            </Typography>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 sm:ml-auto">
            <span className="font-semibold whitespace-nowrap">
              {formatNumber(variation.stock)} unidades
            </span>
            {variation.sku && (
              <>
                <span className="text-slate-300 hidden sm:inline">|</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono break-all sm:break-normal">
                    SKU {variation.sku}
                  </span>
                  <button
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-700 ml-1 shrink-0 touch-manipulation"
                    onClick={() => {
                      if (variation.sku) {
                        navigator.clipboard.writeText(variation.sku);
                        toast.success("SKU copiado");
                      }
                    }}
                    aria-label="Copiar SKU"
                  >
                    <Svg.copy tailWindClasses="h-4 w-4 sm:h-3 sm:w-3" />
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 w-full">
          <span className="font-semibold whitespace-nowrap">
            {formatNumber(variation.stock)} unidades
          </span>
          {variation.sku && (
            <>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <div className="flex items-center gap-1">
                <span className="font-mono break-all sm:break-normal">
                  SKU {variation.sku}
                </span>
                <button
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-700 ml-1 shrink-0 touch-manipulation"
                  onClick={() => {
                    if (variation.sku) {
                      navigator.clipboard.writeText(variation.sku);
                      toast.success("SKU copiado");
                    }
                  }}
                  aria-label="Copiar SKU"
                >
                  <Svg.copy tailWindClasses="h-4 w-4 sm:h-3 sm:w-3" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}


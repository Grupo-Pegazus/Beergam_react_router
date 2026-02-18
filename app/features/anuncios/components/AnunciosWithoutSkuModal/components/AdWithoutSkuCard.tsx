import { Chip, Typography } from "@mui/material";
import Thumbnail from "~/src/components/Thumbnail/Thumbnail";
import MainCards from "~/src/components/ui/MainCards";
import BeergamButton from "~/src/components/utils/BeergamButton";
import type { AdWithoutSku } from "../../../typings";
import VariationsGroup from "../Variations/VariationsGroup";

interface AdWithoutSkuCardProps {
  ad: AdWithoutSku;
  skuValues: Record<string, string>;
  onSkuChange: (variationId: string, value: string) => void;
  onSave: () => void;
  isSaving: boolean;
  hasPendingChanges: boolean;
}

export default function AdWithoutSkuCard({
  ad,
  skuValues,
  onSkuChange,
  onSave,
  isSaving,
  hasPendingChanges,
}: AdWithoutSkuCardProps) {
  const variationsCount = ad?.variations_without_sku?.length ?? 0;

  return (
    <MainCards className="p-5 shadow-lg bg-white dark:bg-[#252a35]!">
      {/* Header do Card */}
      <div className="flex items-start gap-4 mb-4">
        {/* Thumbnail */}
        <div className="shrink-0">
          <Thumbnail 
            thumbnail={ad.thumbnail ?? ""} 
            tailWindClasses="w-20 h-20"
          />
        </div>

        {/* Informações do Anúncio */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <Typography
                variant="h6"
                fontWeight={600}
                className="text-beergam-typography-primary! mb-2 line-clamp-2"
              >
                {ad.name}
              </Typography>
              <div className="flex items-center gap-2 flex-wrap">
                <Chip
                  label={ad.mlb}
                  size="small"
                  className="bg-beergam-mui-paper! text-beergam-typography-secondary! border border-beergam-section-border!"
                />
                <span className="text-sm text-beergam-typography-secondary!">
                  {variationsCount} {variationsCount === 1 ? 'variação sem SKU' : 'variações sem SKU'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Variações sem SKU */}
      {ad.variations_without_sku && ad.variations_without_sku.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-beergam-section-border!">
          <VariationsGroup
            variations={ad.variations_without_sku}
            skuValues={skuValues}
            onSkuChange={onSkuChange}
            onUseMlbAsSku={(variationId) => onSkuChange(variationId, ad.mlb)}
          />
        </div>
      )}

      {/* Botão de Salvar */}
      {hasPendingChanges && (
        <div className="flex justify-end mt-4 pt-4 border-t border-beergam-section-border!">
          <BeergamButton
            title={isSaving ? "Salvando..." : "Salvar SKUs"}
            animationStyle="slider"
            onClick={onSave}
            disabled={isSaving}
            mainColor="beergam-green"
            className="min-w-[140px]"
            fetcher={{
              fecthing: isSaving,
              completed: false,
              error: false,
              mutation: {
                reset: () => {},
                isPending: isSaving,
                isSuccess: false,
                isError: false,
              },
            }}
          />
        </div>
      )}
    </MainCards>
  );
}

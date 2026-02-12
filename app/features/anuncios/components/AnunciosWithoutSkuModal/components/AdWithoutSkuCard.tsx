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
  return (
    <MainCards>
      <div className="mb-4 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-2 shrink-0">
              <Thumbnail thumbnail={ad.thumbnail ?? ""} />
              <Chip
                label={ad.mlb}
                size="small"
                variant="outlined"
                className="shrink-0 bg-beergam-typography-secondary! text-beergam-white! border-beergam-border-secondary!"
              />
            </div>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              className="text-beergam-typography-primary!"
            >
              {ad.name}
            </Typography>
          </div>
          <Typography
            variant="body2"
            className="text-beergam-typography-secondary!"
          >
            {ad?.variations_without_sku?.length ?? 0} variação(ões) sem SKU
          </Typography>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          {hasPendingChanges && (
            <BeergamButton
              title={isSaving ? "Salvando..." : "Salvar SKUs"}
              animationStyle="slider"
              onClick={onSave}
              disabled={isSaving}
              className="text-sm w-full md:w-auto"
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
          )}
        </div>
      </div>

      {ad.variations_without_sku && ad.variations_without_sku.length > 0 && (
        <VariationsGroup
          variations={ad.variations_without_sku}
          skuValues={skuValues}
          onSkuChange={onSkuChange}
          onUseMlbAsSku={(variationId) => onSkuChange(variationId, ad.mlb)}
        />
      )}
    </MainCards>
  );
}

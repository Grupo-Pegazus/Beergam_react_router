import { Button, Chip, CircularProgress, Typography } from "@mui/material";
import MainCards from "~/src/components/ui/MainCards";
import type { AdWithoutSku } from "../../../typings";
import VariationsGroup from "../Variations/VariationsGroup";
import Thumbnail from "../../Thumbnail/Thumbnail";

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
              <Thumbnail anuncio={ad} />
              <Chip label={ad.mlb} size="small" variant="outlined" className="shrink-0" />
            </div>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              className="text-slate-900"
            >
              {ad.name}
            </Typography>
          </div>
          <Typography variant="body2" color="text.secondary">
            {ad?.variations_without_sku?.length ?? 0} variação(ões) sem SKU
          </Typography>
        </div>
        {hasPendingChanges && (
          <Button
            variant="contained"
            color="primary"
            onClick={onSave}
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={16} /> : null}
            size="small"
            className="w-full md:w-auto shrink-0"
          >
            {isSaving ? "Salvando..." : "Salvar SKUs"}
          </Button>
        )}
      </div>

      {ad.variations_without_sku && ad.variations_without_sku.length > 0 && (
        <VariationsGroup
          variations={ad.variations_without_sku}
          skuValues={skuValues}
          onSkuChange={onSkuChange}
        />
      )}
    </MainCards>
  );
}


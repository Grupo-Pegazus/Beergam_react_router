import { Chip, Typography } from "@mui/material";
import MainCards from "~/src/components/ui/MainCards";
import type { AdWithoutSku } from "../../../typings";

interface AdWithoutVariationsCardProps {
  ad: AdWithoutSku;
}

export default function AdWithoutVariationsCard({
  ad,
}: AdWithoutVariationsCardProps) {
  return (
    <MainCards>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex flex-col sm:flex-row sm:items-center gap-2">
            <Typography
              variant="subtitle1"
              fontWeight={600}
              className="text-slate-900 wrap-break-word"
            >
              {ad.name}
            </Typography>
            <Chip label={ad.mlb} size="small" variant="outlined" className="shrink-0" />
          </div>
          <Typography variant="body2" color="text.secondary" className="mb-2">
            Este anúncio não possui variações. O SKU deve ser cadastrado diretamente no Mercado
            Livre.
          </Typography>
          {ad.link && (
            <a
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Abrir no Mercado Livre →
            </a>
          )}
        </div>
      </div>
    </MainCards>
  );
}


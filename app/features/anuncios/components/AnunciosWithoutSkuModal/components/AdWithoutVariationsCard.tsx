import { Chip, Typography } from "@mui/material";
import MainCards from "~/src/components/ui/MainCards";
import type { AdWithoutSku } from "../../../typings";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { useUpdateSkuWithMlb } from "../../../hooks";

interface AdWithoutVariationsCardProps {
  ad: AdWithoutSku;
}

export default function AdWithoutVariationsCard({
  ad,
}: AdWithoutVariationsCardProps) {
  const updateSkuWithMlbMutation = useUpdateSkuWithMlb();

  const handleUpdateSkuWithMlb = async () => {
    await updateSkuWithMlbMutation.mutateAsync([ad.mlb]);
  };

  return (
    <MainCards>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
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
        <div className="shrink-0">
          <BeergamButton
            title={updateSkuWithMlbMutation.isPending ? "Atualizando..." : "Usar MLB como SKU"}
            mainColor="beergam-orange"
            icon="arrow_path"
            onClick={handleUpdateSkuWithMlb}
            disabled={updateSkuWithMlbMutation.isPending}
            className="text-sm w-full md:w-auto"
            fetcher={{
              fecthing: updateSkuWithMlbMutation.isPending,
              completed: false,
              error: false,
              mutation: {
                reset: () => {},
                isPending: updateSkuWithMlbMutation.isPending,
                isSuccess: false,
                isError: false,
              },
            }}
          />
        </div>
      </div>
    </MainCards>
  );
}


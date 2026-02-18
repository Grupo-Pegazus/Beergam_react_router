import { Typography, Chip } from "@mui/material";
import MainCards from "~/src/components/ui/MainCards";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { useUpdateSkuWithMlb } from "../../../hooks";
import type { AdWithoutSku } from "../../../typings";

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
    <MainCards className="p-5 shadow-lg bg-white dark:bg-[#252a35]!">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        {/* Informações do Anúncio */}
        <div className="flex-1 min-w-0">
          <Typography
            variant="h6"
            fontWeight={600}
            className="text-beergam-typography-primary! mb-3 line-clamp-2"
          >
            {ad.name}
          </Typography>
          
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Chip
              label={ad.mlb}
              size="small"
              className="bg-beergam-mui-paper! text-beergam-typography-secondary! border border-beergam-section-border!"
            />
          </div>

          <Typography
            variant="body2"
            className="text-beergam-typography-secondary! mb-3"
          >
            Este anúncio não possui variações. O SKU deve ser cadastrado diretamente no Mercado Livre.
          </Typography>

          {ad.link && (
            <a
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-beergam-primary! hover:underline font-medium"
            >
              Abrir no Mercado Livre
              <span>→</span>
            </a>
          )}
        </div>

        {/* Botão de Ação */}
        <div className="shrink-0 lg:min-w-[180px]">
          <BeergamButton
            title={
              updateSkuWithMlbMutation.isPending
                ? "Atualizando..."
                : "Usar MLB como SKU"
            }
            icon="arrow_path"
            onClick={handleUpdateSkuWithMlb}
            disabled={updateSkuWithMlbMutation.isPending}
            mainColor="beergam-primary"
            animationStyle="slider"
            className="w-full"
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

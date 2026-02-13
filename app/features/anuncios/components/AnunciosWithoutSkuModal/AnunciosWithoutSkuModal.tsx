import { Divider, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { BeergamAlert } from "~/src/components/ui/BeergamAlert";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import { Modal } from "~/src/components/utils/Modal";
import { useAdsWithoutSku, useUpdateSku } from "../../hooks";
import type { AdWithoutSku, UpdateSkuRequest } from "../../typings";
import AdWithoutSkuCard from "./components/AdWithoutSkuCard";
import AdWithoutVariationsCard from "./components/AdWithoutVariationsCard";

interface AnunciosWithoutSkuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AnunciosWithoutSkuModal({
  isOpen,
  onClose,
}: AnunciosWithoutSkuModalProps) {
  const { data, isLoading, error } = useAdsWithoutSku();
  const updateSkuMutation = useUpdateSku();

  const [skuValues, setSkuValues] = useState<
    Record<string, Record<string, string>>
  >({});

  const adsData = useMemo(() => {
    if (!data?.success || !data.data)
      return { withVariations: [], withoutVariations: [] };
    return {
      withVariations: data.data.with_variations || [],
      withoutVariations: data.data.without_variations || [],
      total: data.data.total_without_sku || 0,
    };
  }, [data]);

  const handleSkuChange = (
    adId: string,
    variationId: string,
    value: string
  ) => {
    setSkuValues((prev) => ({
      ...prev,
      [adId]: {
        ...prev[adId],
        [variationId]: value,
      },
    }));
  };

  const handleSaveSku = async (ad: AdWithoutSku) => {
    const adSkus = skuValues[ad.mlb];
    if (!adSkus) return;

    const variations = Object.entries(adSkus)
      .filter(([, sku]) => sku.trim() !== "")
      .map(([variationId, sku]) => ({
        id: Number(variationId),
        attributes: [
          {
            id: "SELLER_SKU",
            value_name: sku.trim(),
          },
        ],
      }));

    if (variations.length === 0) {
      return;
    }

    const request: UpdateSkuRequest = {
      ad_id: ad.mlb,
      variations,
    };

    await updateSkuMutation.mutateAsync(request);
  };

  const hasPendingChanges = (ad: AdWithoutSku) => {
    const adSkus = skuValues[ad.mlb];
    if (!adSkus) return false;
    return Object.values(adSkus).some((sku) => sku.trim() !== "");
  };

  const totalPendencies = adsData.total || 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Anúncios sem SKU (${totalPendencies})`}
      contentClassName="max-w-5xl w-full"
    >
      <div className="space-y-6 bg-transparent p-0 text-beergam-typography-primary!">
        <AsyncBoundary
          isLoading={isLoading}
          error={error as unknown}
          ErrorFallback={() => (
            <BeergamAlert severity="error">
              Não foi possível carregar os anúncios sem SKU.
            </BeergamAlert>
          )}
        >
          {totalPendencies === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Typography
                variant="h6"
                className="mb-2 text-beergam-typography-secondary!"
              >
                Nenhum anúncio sem SKU encontrado
              </Typography>
              <Typography
                variant="body2"
                className="text-beergam-typography-secondary!"
              >
                Todos os anúncios possuem SKU cadastrado.
              </Typography>
            </div>
          ) : (
            <Stack spacing={4}>
              {adsData.withVariations.length > 0 && (
                <div>
                  <Stack spacing={3}>
                    {adsData.withVariations.map((ad) => (
                      <AdWithoutSkuCard
                        key={ad.mlb}
                        ad={ad}
                        skuValues={skuValues[ad.mlb] || {}}
                        onSkuChange={(variationId, value) =>
                          handleSkuChange(ad.mlb, variationId, value)
                        }
                        onSave={() => handleSaveSku(ad)}
                        isSaving={updateSkuMutation.isPending}
                        hasPendingChanges={hasPendingChanges(ad)}
                      />
                    ))}
                  </Stack>
                </div>
              )}

              {adsData.withoutVariations.length > 0 && (
                <div>
                  <Divider className="my-4" />
                  <Typography
                    variant="h6"
                    className="mb-3 text-beergam-typography-primary!"
                  >
                    Anúncios sem variações ({adsData.withoutVariations.length})
                  </Typography>
                  <BeergamAlert
                    severity="warning"
                    className="mb-3"
                  >
                    ATENÇÃO: Anúncios sem variações devem ter o SKU cadastrado
                    diretamente no Mercado Livre.
                  </BeergamAlert>
                  <Stack spacing={3}>
                    {adsData.withoutVariations.map((ad) => (
                      <AdWithoutVariationsCard key={ad.mlb} ad={ad} />
                    ))}
                  </Stack>
                </div>
              )}
            </Stack>
          )}
        </AsyncBoundary>
      </div>
    </Modal>
  );
}

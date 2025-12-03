import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "~/features/apiClient/typings";
import { MarketplaceType } from "~/features/marketplace/typings";
import authStore from "~/features/store-zustand";
import Svg from "~/src/assets/svgs/_index";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import StatCard from "~/src/components/ui/StatCard";
import { metricsAccountService } from "../../service";
import type { MarketplaceReputationData } from "../../typings";
import { getColorName, getMeliReputationColor } from "../../utils";
import ReputacaoSkeleton from "./Skeleton";

type ReputationResponse = ApiResponse<
  MarketplaceReputationData<MarketplaceType>
>;

function isReputationOfType<T extends MarketplaceType>(
  payload: MarketplaceReputationData<MarketplaceType> | null | undefined,
  type: T
): payload is MarketplaceReputationData<T> {
  return payload?.marketplace_type === type;
}

/**
 * Retorna o nome da cor em português
 */

function MeliColorBar({ currentLevel }: { currentLevel: number }) {
  const colors = [
    { level: 1, bg: "bg-red-500", label: "Vermelho" },
    { level: 2, bg: "bg-orange-400", label: "Laranja" },
    { level: 3, bg: "bg-yellow-400", label: "Amarelo" },
    { level: 4, bg: "bg-green-400", label: "Verde Claro" },
    { level: 5, bg: "bg-emerald-500", label: "Verde" },
  ];

  return (
    <div className="w-full h-8 rounded-lg overflow-hidden flex border border-black/10 shadow-inner">
      {colors.map((color) => (
        <div
          key={color.level}
          className={`flex-1 ${color.bg} ${currentLevel >= color.level ? "opacity-100" : "opacity-25"} transition-all duration-200`}
          title={color.label}
        />
      ))}
    </div>
  );
}

export default function Reputacao() {
  const selectedMarketplace = authStore.use.marketplace();
  const marketplaceType = selectedMarketplace?.marketplace_type;

  const { data, isLoading, error } = useQuery<ReputationResponse>({
    queryKey: [
      "reputacao",
      marketplaceType,
      selectedMarketplace?.marketplace_shop_id,
    ],
    queryFn: async () => {
      if (!marketplaceType) {
        throw new Error("Marketplace não selecionado");
      }
      return metricsAccountService.getReputationAccount(marketplaceType);
    },
    enabled: Boolean(marketplaceType),
    staleTime: 1000 * 60 * 5,
  });

  if (!selectedMarketplace) {
    return (
      <StatCard
        icon={<Svg.star tailWindClasses="w-5 h-5 text-yellow-500" />}
        title="Reputação da Conta"
      >
        <p className="text-sm text-[#475569] mt-3">
          Selecione um marketplace para visualizar a reputação.
        </p>
      </StatCard>
    );
  }

  const success = data?.success ?? false;
  const payload = success ? data?.data : null;

  let description: string | null = null;
  let cardColor:
    | "red"
    | "orange"
    | "yellow"
    | "light_green"
    | "green"
    | "slate" = "slate";
  let iconColor = "text-yellow-500";

  let meliLevel: number | null = null;
  let meliColorName: string | null = null;

  if (isReputationOfType(payload, MarketplaceType.MELI)) {
    const reputation = payload.reputation;
    const levelId = reputation.seller_reputation.level_id;

    // Aplica cores baseadas no level_id do MELI
    cardColor = getMeliReputationColor(levelId);
    meliColorName = getColorName(cardColor);

    // Calcula o nível numérico para a barra de cores
    if (levelId) {
      const level = parseInt(levelId, 10);
      if (!isNaN(level)) {
        meliLevel = level;
      }
    }

    // Ajusta cor do ícone para combinar com o card
    const iconColorMap: Record<
      "red" | "orange" | "yellow" | "light_green" | "green" | "slate",
      string
    > = {
      red: "text-red-500",
      orange: "text-orange-500",
      yellow: "text-yellow-500",
      light_green: "text-green-500",
      green: "text-emerald-500",
      slate: "text-slate-500",
    };
    iconColor = iconColorMap[cardColor];
  } else if (isReputationOfType(payload, MarketplaceType.SHOPEE)) {
    description =
      "Estrutura de reputação da Shopee ainda não foi implementada.";
    cardColor = "slate";
  }

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error as unknown}
      Skeleton={ReputacaoSkeleton}
      ErrorFallback={() => (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
          Não foi possível carregar a reputação no momento.
        </div>
      )}
    >
      <StatCard
        icon={<Svg.star tailWindClasses={`w-5 h-5 ${iconColor}`} />}
        title="Reputação da Conta"
        color={cardColor}
        variant="soft"
      >
        {isReputationOfType(payload, MarketplaceType.MELI) &&
        meliLevel &&
        meliColorName ? (
          <div className="mt-4 space-y-3">
            <h4 className="text-base font-bold text-[#0f172a]">
              Você tem cor {meliColorName}
            </h4>

            <MeliColorBar currentLevel={meliLevel} />

            <div className="flex items-center gap-2">
              <p className="text-sm text-[#475569]">
                Você aparece assim para os compradores.
              </p>
            </div>
          </div>
        ) : description ? (
          <p className="text-sm text-[#475569] mt-3">{description}</p>
        ) : null}
      </StatCard>
    </AsyncBoundary>
  );
}

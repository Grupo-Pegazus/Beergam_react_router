import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import type { ApiResponse } from "~/features/apiClient/typings";
import { MarketplaceType } from "~/features/marketplace/typings";
import authStore from "~/features/store-zustand";
import Svg from "~/src/assets/svgs/_index";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import StatCard from "~/src/components/ui/StatCard";
import { Modal } from "~/src/components/utils/Modal";
import { metricsAccountService } from "../../service";
import type { MarketplaceScheduleData } from "../../typings";
import ScheduleTimesSkeleton from "./Skeleton";

type ScheduleResponse = ApiResponse<MarketplaceScheduleData<MarketplaceType>>;

const WEEK_ORDER: Array<
  keyof NonNullable<
    NonNullable<
      NonNullable<
        MarketplaceScheduleData<MarketplaceType.MELI>["schedule"]
      >["results_by_logistic_type"][string]
    >["schedule"]
  >
> = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DAY_LABEL: Record<string, string> = {
  monday: "Segunda",
  tuesday: "Terça",
  wednesday: "Quarta",
  thursday: "Quinta",
  friday: "Sexta",
  saturday: "Sábado",
  sunday: "Domingo",
};

function isMeliSchedule(
  payload: MarketplaceScheduleData<MarketplaceType> | null
): payload is MarketplaceScheduleData<MarketplaceType.MELI> {
  return payload?.marketplace_type === MarketplaceType.MELI;
}

/**
 * Encontra o primeiro valor não-nulo em results_by_logistic_type.
 * Retorna null se todos os valores forem null.
 */
function findFirstNonEmptySchedule(
  resultsByLogisticType: MarketplaceScheduleData<MarketplaceType.MELI>["schedule"]["results_by_logistic_type"]
): NonNullable<
  MarketplaceScheduleData<MarketplaceType.MELI>["schedule"]["results_by_logistic_type"][string]
> | null {
  if (!resultsByLogisticType) return null;

  // Itera sobre os valores do objeto e retorna o primeiro que não seja null ou undefined
  // O record pode ter valores null, então precisamos verificar explicitamente
  const values = Object.values(resultsByLogisticType);

  for (const value of values) {
    // Verifica se o valor existe, não é null e tem a estrutura esperada
    if (value != null && typeof value === "object" && "schedule" in value) {
      return value as NonNullable<
        MarketplaceScheduleData<MarketplaceType.MELI>["schedule"]["results_by_logistic_type"][string]
      >;
    }
  }

  return null;
}

export default function ScheduleTimes() {
  const [open, setOpen] = useState(false);
  const selectedMarketplace = authStore.use.marketplace();
  const marketplaceType = selectedMarketplace?.marketplace_type;

  const { data, isLoading, error } = useQuery<ScheduleResponse>({
    queryKey: [
      "schedule_times",
      marketplaceType,
      selectedMarketplace?.marketplace_shop_id,
    ],
    queryFn: async () => {
      if (!marketplaceType) throw new Error("Marketplace não selecionado");
      return metricsAccountService.getScheduleTimes(marketplaceType);
    },
    enabled: Boolean(marketplaceType),
    staleTime: 1000 * 60 * 5,
  });

  const payload = data?.success ? data.data : null;

  const summary = useMemo(() => {
    if (!payload || !isMeliSchedule(payload))
      return { label: "—", cutoff: "—" };

    const meliSchedule = payload.schedule;

    // Verifica se results_by_logistic_type existe
    if (!meliSchedule.results_by_logistic_type) {
      return { label: "Sem dados", cutoff: "—" };
    }

    const scheduleByType = findFirstNonEmptySchedule(
      meliSchedule.results_by_logistic_type
    );

    if (!scheduleByType) {
      return { label: "Sem dados", cutoff: "—" };
    }

    const schedule = scheduleByType.schedule;
    if (!schedule) return { label: "—", cutoff: "—" };

    // pega o primeiro dia útil com detail válido
    for (const day of WEEK_ORDER) {
      const info = schedule[day];
      const cutoff = info?.detail?.[0]?.cutoff;
      if (info?.work && cutoff) {
        return { label: "Corte típico", cutoff };
      }
    }
    return { label: "—", cutoff: "—" };
  }, [payload]);

  return (
    <>
      <AsyncBoundary
        isLoading={isLoading}
        error={error as unknown}
        Skeleton={ScheduleTimesSkeleton}
        ErrorFallback={() => (
          <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
            Não foi possível carregar os horários de corte.
          </div>
        )}
      >
        <StatCard
          icon={<Svg.clock tailWindClasses="w-5 h-5" />}
          title="Horário de Corte"
          value={summary.cutoff}
          onClick={() => setOpen(true)}
        >
          <p className="text-sm text-beergam-typography-secondary mt-3">
            {summary.label}. Toque para ver a semana.
          </p>
        </StatCard>
      </AsyncBoundary>

      <Modal
        title="Horário de corte da semana"
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <div>
          {!payload ? (
            <div className="text-sm text-beergam-typography-secondary">
              Sem dados disponíveis para o marketplace selecionado.
            </div>
          ) : isMeliSchedule(payload) ? (
            (() => {
              const meliSchedule = payload.schedule;
              const scheduleByType = findFirstNonEmptySchedule(
                meliSchedule.results_by_logistic_type
              );

              if (!scheduleByType) {
                return (
                  <div className="text-sm text-beergam-typography-secondary">
                    Sem dados disponíveis de horários de corte.
                  </div>
                );
              }

              const schedule = scheduleByType.schedule ?? {};
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {WEEK_ORDER.map((day) => {
                    const info = schedule[day];
                    const work: boolean = info?.work ?? false;
                    const cutoff: string | undefined =
                      info?.detail?.[0]?.cutoff;
                    return (
                      <div
                        key={day}
                        className="rounded-xl border border-beergam-section-border p-3 bg-beergam-section-background!"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-beergam-typography-primary!">
                            {DAY_LABEL[day]}
                          </span>
                          <span
                            className={[
                              "text-xs px-2 py-0.5 rounded-full",
                              work
                                ? "bg-beergam-primary/10 text-beergam-primary border border-beergam-primary/30"
                                : "bg-beergam-typography-secondary/10 text-beergam-typography-secondary border border-beergam-typography-secondary/30",
                            ].join(" ")}
                          >
                            {work ? "Dia útil" : "Sem operação"}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-beergam-typography-secondary!">
                          Corte:{" "}
                          <span className="font-semibold text-beergam-typography-primary!">
                            {cutoff ?? (work ? "—" : "N/A")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()
          ) : (
            <div className="text-sm text-beergam-typography-secondary">
              Estrutura de horários de corte ainda não implementada para este
              marketplace.
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

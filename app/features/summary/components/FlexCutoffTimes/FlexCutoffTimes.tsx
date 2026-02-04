import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import type { ApiResponse } from "~/features/apiClient/typings";
import { MarketplaceType } from "~/features/marketplace/typings";
import authStore from "~/features/store-zustand";
import Svg from "~/src/assets/svgs/_index";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import StatCard from "~/src/components/ui/StatCard";
import { Modal } from "~/src/components/utils/Modal";
import { summaryService } from "../../service";
import type { FlexCutoff, FlexDeliveryRangeItem } from "../../typings";
import FlexCutoffTimesSkeleton from "./Skeleton";

type FlexCutoffResponse = ApiResponse<FlexCutoff>;

const FLEX_DAY_KEYS = ["week", "saturday", "sunday"] as const;
const DAY_LABEL: Record<(typeof FLEX_DAY_KEYS)[number], string> = {
  week: "Segunda a Sexta",
  saturday: "Sábado",
  sunday: "Domingo",
};

const DELIVERY_WINDOW_LABEL: Record<string, string> = {
  same_day: "Entrega no mesmo dia",
  next_day: "Entrega no dia seguinte",
};

/** Formata hora (número) para exibição "HH:00" */
function formatHour(h: number): string {
  return `${String(h).padStart(2, "0")}:00`;
}

/** Pega o primeiro item da lista; se tiver algo, tem horário. */
function getFirstRange(items: FlexDeliveryRangeItem[]): FlexDeliveryRangeItem | null {
  return items?.length ? items[0] : null;
}

/** Resumo para o card: usa o dia atual para escolher week/saturday/sunday */
function getSummaryForToday(payload: FlexCutoff): {
  cutoff: string;
  dayKey: (typeof FLEX_DAY_KEYS)[number] | null;
  deliveryWindow: string | null;
} {
  if (!payload.has_flex) return { cutoff: "—", dayKey: null, deliveryWindow: null };

  const today = new Date().getDay();
  const dayKey: (typeof FLEX_DAY_KEYS)[number] =
    today === 0 ? "sunday" : today === 6 ? "saturday" : "week";

  const range = getFirstRange(payload[dayKey] ?? []);
  const cutoffStr = range?.cutoff != null ? formatHour(range.cutoff) : "—";
  const deliveryWindow = payload.delivery_window
    ? DELIVERY_WINDOW_LABEL[payload.delivery_window] ?? payload.delivery_window
    : null;

  return { cutoff: cutoffStr, dayKey, deliveryWindow };
}

export default function FlexCutoffTimes() {
  const [open, setOpen] = useState(false);
  const selectedMarketplace = authStore.use.marketplace();
  const isMeli = selectedMarketplace?.marketplace_type === MarketplaceType.MELI;

  const { data, isLoading, error } = useQuery<FlexCutoffResponse>({
    queryKey: ["flex_cutoff", selectedMarketplace?.marketplace_shop_id],
    queryFn: () => summaryService.getFlexCutoff(),
    enabled: Boolean(isMeli && selectedMarketplace?.marketplace_shop_id),
    staleTime: 1000 * 60 * 5,
  });

  const payload = data?.success ? data.data : null;
  const summary = useMemo(
    () =>
      payload
        ? getSummaryForToday(payload)
        : { cutoff: "—", dayKey: null, deliveryWindow: null },
    [payload]
  );

  if (!isMeli) return null;

  return (
    <>
      <AsyncBoundary
        isLoading={isLoading}
        error={error as unknown}
        Skeleton={FlexCutoffTimesSkeleton}
        ErrorFallback={() => (
          <StatCard
            icon={<Svg.truck tailWindClasses="w-5 h-5" />}
            title="Horário de Corte Flex"
            value="—"
            color="slate"
          >
            <p className="text-sm text-beergam-typography-secondary mt-3">
              Não foi possível carregar.
            </p>
          </StatCard>
        )}
      >
        <StatCard
          icon={<Svg.truck tailWindClasses="w-5 h-5" />}
          title="Horário de Corte Flex"
          value={summary.cutoff}
          onClick={() => setOpen(true)}
          color="emerald"
        >
          <p className="text-sm text-beergam-typography-secondary mt-3">
            {summary.deliveryWindow && (
              <>
                <span className="font-semibold text-beergam-typography-primary">
                  {summary.deliveryWindow}
                </span>
                {summary.dayKey ? (
                  <> · {DAY_LABEL[summary.dayKey]}. Toque para ver a semana.</>
                ) : (
                  <> Toque para ver detalhes.</>
                )}
              </>
            )}
            {!summary.deliveryWindow && summary.dayKey && (
              <>
                <span className="font-semibold text-beergam-typography-primary">
                  {DAY_LABEL[summary.dayKey]}
                </span>
                . Toque para ver a semana.
              </>
            )}
            {!summary.deliveryWindow && !summary.dayKey && (
              <>Toque para ver detalhes.</>
            )}
          </p>
        </StatCard>
      </AsyncBoundary>

      <Modal
        title="Horário de corte Flex - Semana"
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <div>
          {!payload?.has_flex ? (
            <p className="text-sm text-beergam-typography-secondary">
              Sua conta não possui Flex ativo.
            </p>
          ) : (
            <>
              {payload.delivery_window && (
                <p className="text-sm font-semibold text-beergam-typography-primary mb-3">
                  {DELIVERY_WINDOW_LABEL[payload.delivery_window] ??
                    payload.delivery_window}
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {FLEX_DAY_KEYS.map((dayKey) => {
                const items = payload[dayKey] ?? [];
                const hasData = items.length > 0;

                return (
                  <div
                    key={dayKey}
                    className="rounded-xl border border-beergam-section-border p-3 bg-beergam-section-background!"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-beergam-typography-primary!">
                        {DAY_LABEL[dayKey]}
                      </span>
                      <span
                        className={[
                          "text-xs px-2 py-0.5 rounded-full",
                          hasData
                            ? "bg-beergam-primary/10 text-beergam-primary border border-beergam-primary/30"
                            : "bg-beergam-typography-secondary/10 text-beergam-typography-secondary border border-beergam-typography-secondary/30",
                        ].join(" ")}
                      >
                        {hasData ? "Disponível" : "Sem operação"}
                      </span>
                    </div>
                    {hasData && (
                      <div className="mt-2 space-y-2 text-sm text-beergam-typography-secondary!">
                        {items.map((range, idx) => (
                          <div key={idx} className="border-b border-beergam-section-border/50 pb-2 last:border-0 last:pb-0">
                            <p>
                              Corte:{" "}
                              <span className="font-semibold text-beergam-typography-primary!">
                                {range.cutoff != null ? formatHour(range.cutoff) : "—"}
                              </span>
                            </p>
                            <p>
                              Faixa:{" "}
                              <span className="font-semibold text-beergam-typography-primary!">
                                {formatHour(range.from)} – {formatHour(range.to)}
                              </span>
                            </p>
                            <p>
                              Máx. envios:{" "}
                              <span className="font-semibold text-beergam-typography-primary!">
                                {range.capacity}
                              </span>
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}

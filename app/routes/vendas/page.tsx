import { useCallback } from "react";
import Section from "~/src/components/ui/Section";
import Grid from "~/src/components/ui/Grid";
import MetricasCards from "~/features/vendas/components/MetricasCards/MetricasCards";
import DailyRevenueChart from "~/features/vendas/components/Charts/DailyRevenueChart";
import GeographicMap from "~/features/vendas/components/Charts/GeographicMap";

import { VendasFilters } from "~/features/vendas/components/Filters";
import type { VendasFiltersState } from "~/features/vendas/components/Filters";
import { useVendasFilters } from "~/features/vendas/hooks";
import OrderList from "~/features/vendas/components/OrderList/OrderList";

export default function VendasPage() {
  const {
    filters,
    setFilters,
    resetFilters,
    apiFilters,
    applyFilters,
  } = useVendasFilters();

  const handleFiltersChange = useCallback(
    (next: VendasFiltersState) => {
      setFilters(next);
    },
    [setFilters]
  );

  return (
    <>
      <Section title="Resumo">
        <Grid cols={{ base: 1, lg: 1 }}>
          <MetricasCards />
        </Grid>
      </Section>

      <Section title="Faturamento Diário">
        <Grid cols={{ base: 1, lg: 1 }}>
          <DailyRevenueChart days={30} />
        </Grid>
      </Section>

      <Section title="Distribuição Geográfica">
        <Grid cols={{ base: 1, lg: 2 }}>
          <GeographicMap period="last_day" />
        </Grid>
      </Section>

      <Section title="Pedidos">
        <VendasFilters
          value={filters}
          onChange={handleFiltersChange}
          onReset={resetFilters}
          onSubmit={applyFilters}
        />
        <OrderList filters={apiFilters} />
      </Section>
    </>
  );
}

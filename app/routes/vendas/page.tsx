import { useCallback } from "react";
import DailyRevenueChart from "~/features/vendas/components/Charts/DailyRevenueChart";
import GeographicMap from "~/features/vendas/components/Charts/GeographicMap";
import MetricasCards from "~/features/vendas/components/MetricasCards/MetricasCards";
import Grid from "~/src/components/ui/Grid";
import Section from "~/src/components/ui/Section";

import type { VendasFiltersState } from "~/features/vendas/components/Filters";
import { VendasFilters } from "~/features/vendas/components/Filters";
import OrderList from "~/features/vendas/components/OrderList/OrderList";
import { useVendasFilters } from "~/features/vendas/hooks";
import {
  CensorshipWrapper,
  ImageCensored,
} from "~/src/components/utils/Censorship";

export default function VendasPage() {
  const { filters, setFilters, resetFilters, apiFilters, applyFilters } =
    useVendasFilters();

  const handleFiltersChange = useCallback(
    (next: VendasFiltersState) => {
      setFilters(next);
    },
    [setFilters]
  );

  return (
    <>
      <CensorshipWrapper controlChildren censorshipKey="vendas_resumo">
        <Section
          title="Resumo"
        >
          <Grid cols={{ base: 1 }}>
            <MetricasCards />
          </Grid>
        </Section>
      </CensorshipWrapper>
      <CensorshipWrapper censorshipKey="vendas_faturamento_diario">
        <Section
          title="Faturamento Diário"
        >
          <Grid cols={{ base: 1 }}>
            <ImageCensored
              className="w-full h-full min-h-56"
              censorshipKey="vendas_faturamento_diario"
            >
              <DailyRevenueChart days={30} />
            </ImageCensored>
          </Grid>
        </Section>
      </CensorshipWrapper>

      <CensorshipWrapper censorshipKey="vendas_distribuicao_geografica">
        <Section title="Distribuição Geográfica">
          <Grid cols={{ base: 1 }}>
            <ImageCensored
              className="w-full h-full min-h-56"
              censorshipKey="vendas_distribuicao_geografica"
            >
              <GeographicMap period="last_day" />
            </ImageCensored>
          </Grid>
        </Section>
      </CensorshipWrapper>
      <CensorshipWrapper censorshipKey="vendas_orders_list" controlChildren>
        <Section title="Pedidos">
          <VendasFilters
            value={filters}
            onChange={handleFiltersChange}
            onReset={resetFilters}
            onSubmit={applyFilters}
          />
          <OrderList filters={apiFilters} />
        </Section>
      </CensorshipWrapper>
    </>
  );
}

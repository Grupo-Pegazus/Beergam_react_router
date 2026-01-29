import { useCallback } from "react";
import MetricasCards from "~/features/produtos/components/MetricasCards/MetricasCards";
import Grid from "~/src/components/ui/Grid";
import Section from "~/src/components/ui/Section";
// import LowStockProducts from "~/features/produtos/components/LowStockProducts/LowStockProducts";
import ProdutosFilters from "~/features/produtos/components/Filters/ProdutosFilters";
import type { ProdutosFiltersState } from "~/features/produtos/components/Filters/types";
import ProductList from "~/features/produtos/components/ProductList/ProductList";
import QuickAccess from "~/features/produtos/components/QuickAccess/QuickAccess";
import { useProdutosFilters } from "~/features/produtos/hooks";
import { CensorshipWrapper } from "~/src/components/utils/Censorship";

export default function ProdutosGestaoPage() {
  const { filters, setFilters, resetFilters, apiFilters, applyFilters } =
    useProdutosFilters();

  const handleFiltersChange = useCallback(
    (next: ProdutosFiltersState) => {
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

      <Section title="Acesso Rápido">
        <Grid cols={{ base: 1, lg: 1 }}>
          <QuickAccess />
        </Grid>
      </Section>

      {/* <Section title="Produtos com menor estoque">
        <Grid cols={{ base: 1, lg: 1 }}>
          <LowStockProducts />
        </Grid>
      </Section> */}

      <CensorshipWrapper censorshipKey="produtos_list">
        <Section title="Produtos cadastrados">
          <ProdutosFilters
            value={filters}
            onChange={handleFiltersChange}
            onReset={resetFilters}
            onSubmit={applyFilters}
          />
          <ProductList filters={apiFilters} syncPageWithUrl />
        </Section>
      </CensorshipWrapper>
    </>
  );
}

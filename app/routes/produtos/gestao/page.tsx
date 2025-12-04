import { useCallback } from "react";
import Section from "~/src/components/ui/Section";
import Grid from "~/src/components/ui/Grid";
import MetricasCards from "~/features/produtos/components/MetricasCards/MetricasCards";
// import LowStockProducts from "~/features/produtos/components/LowStockProducts/LowStockProducts";
import ProdutosFilters from "~/features/produtos/components/Filters/ProdutosFilters";
import type { ProdutosFiltersState } from "~/features/produtos/components/Filters/types";
import { useProdutosFilters } from "~/features/produtos/hooks";
import ProductList from "~/features/produtos/components/ProductList/ProductList";
import CatalogQuickAccess from "~/features/catalog/components/CatalogQuickAccess";

export default function ProdutosGestaoPage() {
  const {
    filters,
    setFilters,
    resetFilters,
    apiFilters,
    applyFilters,
  } = useProdutosFilters();

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

      <Section title="Gestão de Catálogo">
        <Grid cols={{ base: 1, lg: 1 }}>
          <CatalogQuickAccess />
        </Grid>
      </Section>

      {/* <Section title="Produtos com menor estoque">
        <Grid cols={{ base: 1, lg: 1 }}>
          <LowStockProducts />
        </Grid>
      </Section> */}

      <Section title="Produtos cadastrados">
        <ProdutosFilters
          value={filters}
          onChange={handleFiltersChange}
          onReset={resetFilters}
          onSubmit={applyFilters}
        />
        <ProductList filters={apiFilters} />
      </Section>
    </>
  );
}

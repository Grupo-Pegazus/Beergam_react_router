import { useSearchParams } from "react-router";
import LowStockProductsList from "~/features/produtos/components/StockDashboard/LowStockProductsList";
import LowStockVariationsList from "~/features/produtos/components/StockDashboard/LowStockVariationsList";
import ProductsWithoutStockControl from "~/features/produtos/components/StockDashboard/ProductsWithoutStockControl";
import RecentMovementsList from "~/features/produtos/components/StockDashboard/RecentMovementsList";
import StockMetricsCards from "~/features/produtos/components/StockDashboard/StockMetricsCards";
import StockOverviewTable from "~/features/produtos/components/StockDashboard/StockOverviewTable";
import StockProductsList from "~/features/produtos/components/StockDashboard/StockProductsList";
import StockSummaryCards from "~/features/produtos/components/StockDashboard/StockSummaryCards";
import { useStockDashboard } from "~/features/produtos/hooks";
import Loading from "~/src/assets/loading";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import Grid from "~/src/components/ui/Grid";
import MainCards from "~/src/components/ui/MainCards";
import Section from "~/src/components/ui/Section";

export default function StockDashboardPage() {
  const [searchParams] = useSearchParams();
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const {
    data: stockData,
    isLoading: isLoadingStock,
    error: stockError,
  } = useStockDashboard(limit);

  const stockDashboard = stockData?.success ? stockData.data : null;

  return (
    <>
      <Section title="Produtos com Controle de Estoque">
        <Grid cols={{ base: 1, lg: 1 }}>
          <StockProductsList />
        </Grid>
      </Section>

      <Section title="Panorama de Estoque">
        <Grid cols={{ base: 1, lg: 1 }}>
          <StockOverviewTable />
        </Grid>
      </Section>

      <Section title="Dashboard Geral de Estoque">
        <AsyncBoundary
          isLoading={isLoadingStock}
          error={stockError as unknown}
          Skeleton={Loading}
          ErrorFallback={() => (
            <div className="rounded-2xl border border-beergam-red bg-beergam-red/10 text-beergam-red p-4">
              Não foi possível carregar o dashboard de estoque.
            </div>
          )}
        >
          <MainCards className="flex flex-col gap-4 justify-center">
          {stockDashboard && (
            <>
              <Grid cols={{ base: 1, lg: 1 }}>
                <StockMetricsCards metrics={stockDashboard.metrics} />
              </Grid>

              <Grid cols={{ base: 1, lg: 1 }} className="mt-6">
                <StockSummaryCards summary={stockDashboard.stock_summary} />
              </Grid>

              {stockDashboard.low_stock_products.length > 0 && (
                <Grid cols={{ base: 1, lg: 1 }} className="mt-6">
                  <div>
                    <h3 className="text-lg font-semibold text-beergam-typography-primary! mb-4">
                      Produtos com Estoque Baixo
                    </h3>
                    <LowStockProductsList
                      products={stockDashboard.low_stock_products}
                      syncPageWithUrl
                      pageParamKey="low_stock_page"
                    />
                  </div>
                </Grid>
              )}

              {stockDashboard.low_stock_variations.length > 0 && (
                <Grid cols={{ base: 1, lg: 1 }} className="mt-6">
                  <div>
                    <h3 className="text-lg font-semibold text-beergam-typography-primary! mb-4">
                      Variações com Estoque Baixo
                    </h3>
                    <LowStockVariationsList
                      variations={stockDashboard.low_stock_variations}
                    />
                  </div>
                </Grid>
              )}

              {stockDashboard.recent_movements.length > 0 && (
                <Grid cols={{ base: 1, lg: 1 }} className="mt-6">
                  <div>
                    <h3 className="text-lg font-semibold text-beergam-typography-primary! mb-4">
                      Movimentações Recentes
                    </h3>
                    <RecentMovementsList
                      movements={stockDashboard.recent_movements}
                    />
                  </div>
                </Grid>
              )}

              {stockDashboard.products_without_stock_control.length > 0 && (
                <Grid cols={{ base: 1, lg: 1 }} className="mt-6">
                  <div>
                    <h3 className="text-lg font-semibold text-beergam-typography-primary! mb-4">
                      Produtos sem Controle de Estoque
                    </h3>
                    <ProductsWithoutStockControl
                      products={stockDashboard.products_without_stock_control}
                    />
                  </div>
                </Grid>
              )}
            </>
          )}
          </MainCards>
        </AsyncBoundary>
      </Section>
    </>
  );
}

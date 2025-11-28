import { useSearchParams } from "react-router";
import Section from "~/src/components/ui/Section";
import Grid from "~/src/components/ui/Grid";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import Loading from "~/src/assets/loading";
import { useStockDashboard, useStockSyncDashboard } from "~/features/produtos/hooks";
import StockProductsList from "~/features/produtos/components/StockDashboard/StockProductsList";
import StockMetricsCards from "~/features/produtos/components/StockDashboard/StockMetricsCards";
import StockSummaryCards from "~/features/produtos/components/StockDashboard/StockSummaryCards";
import LowStockProductsList from "~/features/produtos/components/StockDashboard/LowStockProductsList";
import LowStockVariationsList from "~/features/produtos/components/StockDashboard/LowStockVariationsList";
import RecentMovementsList from "~/features/produtos/components/StockDashboard/RecentMovementsList";
import ProductsWithoutStockControl from "~/features/produtos/components/StockDashboard/ProductsWithoutStockControl";
import SyncAccountInfo from "~/features/produtos/components/StockSyncDashboard/SyncAccountInfo";
import SyncStatsCards from "~/features/produtos/components/StockSyncDashboard/SyncStatsCards";
import RecentActivitiesList from "~/features/produtos/components/StockSyncDashboard/RecentActivitiesList";
import RecommendationsList from "~/features/produtos/components/StockSyncDashboard/RecommendationsList";

export default function StockDashboardPage() {
  const [searchParams] = useSearchParams();
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const {
    data: stockData,
    isLoading: isLoadingStock,
    error: stockError,
  } = useStockDashboard(limit);

  const {
    data: syncData,
    isLoading: isLoadingSync,
    error: syncError,
  } = useStockSyncDashboard();

  const stockDashboard = stockData?.success ? stockData.data : null;
  const syncDashboard = syncData?.success ? syncData.data : null;

  return (
    <>
      <Section title="Produtos com Controle de Estoque">
        <Grid cols={{ base: 1, lg: 1 }}>
          <StockProductsList />
        </Grid>
      </Section>

      <Section title="Dashboard Geral de Estoque">
        <AsyncBoundary
          isLoading={isLoadingStock}
          error={stockError as unknown}
          Skeleton={Loading}
          ErrorFallback={() => (
            <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
              Não foi possível carregar o dashboard de estoque.
            </div>
          )}
        >
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
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Produtos com Estoque Baixo
                    </h3>
                    <LowStockProductsList
                      products={stockDashboard.low_stock_products}
                    />
                  </div>
                </Grid>
              )}

              {stockDashboard.low_stock_variations.length > 0 && (
                <Grid cols={{ base: 1, lg: 1 }} className="mt-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
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
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
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
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
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
        </AsyncBoundary>
      </Section>

      <Section title="Dashboard de Sincronização">
        <AsyncBoundary
          isLoading={isLoadingSync}
          error={syncError as unknown}
          Skeleton={Loading}
          ErrorFallback={() => (
            <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
              Não foi possível carregar o dashboard de sincronização.
            </div>
          )}
        >
          {syncDashboard && (
            <>
              <Grid cols={{ base: 1, lg: 1 }}>
                <SyncAccountInfo accountInfo={syncDashboard.account_info} />
              </Grid>

              <Grid cols={{ base: 1, lg: 1 }} className="mt-6">
                <SyncStatsCards syncStats={syncDashboard.sync_stats} />
              </Grid>

              {syncDashboard.recent_activities.length > 0 && (
                <Grid cols={{ base: 1, lg: 1 }} className="mt-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Atividades Recentes
                    </h3>
                    <RecentActivitiesList
                      activities={syncDashboard.recent_activities}
                    />
                  </div>
                </Grid>
              )}

              {syncDashboard.recommendations.length > 0 && (
                <Grid cols={{ base: 1, lg: 1 }} className="mt-6">
                  <RecommendationsList
                    recommendations={syncDashboard.recommendations}
                  />
                </Grid>
              )}
            </>
          )}
        </AsyncBoundary>
      </Section>
    </>
  );
}


import { Alert } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import AverageCostCard from "~/features/produtos/components/StockControl/AverageCostCard";
import StockMovementForm from "~/features/produtos/components/StockControl/StockMovementForm";
import StockSummary from "~/features/produtos/components/StockControl/StockSummary";
import StockTrackingFilters from "~/features/produtos/components/StockControl/StockTrackingFilters";
import StockTrackingTable from "~/features/produtos/components/StockControl/StockTrackingTable";
import { useProductDetails, useStockTracking } from "~/features/produtos/hooks";
import type { StockTrackingFilters as StockTrackingFiltersType } from "~/features/produtos/typings";
import { useBreadcrumbCustomization } from "~/features/system/context/BreadcrumbContext";
import Loading from "~/src/assets/loading";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import Grid from "~/src/components/ui/Grid";
import Section from "~/src/components/ui/Section";
import { Fields } from "~/src/components/utils/_fields";
import { usePageFromSearchParams } from "~/src/hooks/usePageFromSearchParams";
import StockControlSkeleton from "./StockControlSkeleton";

const SYNC_PAGE_WITH_URL = true;

interface StockControlPageProps {
  productId: string;
}

export default function StockControlPage({ productId }: StockControlPageProps) {
  const { setCustomLabel } = useBreadcrumbCustomization();
  const [searchParams, setSearchParams] = useSearchParams();
  const { page: pageFromUrl } = usePageFromSearchParams();
  const [filters, setFilters] = useState<Partial<StockTrackingFiltersType>>({
    page: 1,
    page_size: 50,
  });

  const effectiveFilters = useMemo(() => {
    const base = { ...filters };
    if (SYNC_PAGE_WITH_URL) base.page = pageFromUrl;
    return base;
  }, [filters, pageFromUrl]);

  const {
    data: stockData,
    isLoading: isLoadingStock,
    error: stockError,
    refetch: refetchStock,
  } = useStockTracking(productId, effectiveFilters);

  const {
    data: productData,
    isLoading: isLoadingProduct,
    error: productError,
  } = useProductDetails(productId);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<StockTrackingFiltersType>) => {
      setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
      if (SYNC_PAGE_WITH_URL) {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.set("page", "1");
            return next;
          },
          { replace: true }
        );
      }
    },
    [setSearchParams]
  );

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setFilters((prev) => ({ ...prev, page_size: pageSize, page: 1 }));
      if (SYNC_PAGE_WITH_URL) {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.set("page", "1");
            return next;
          },
          { replace: true }
        );
      }
    },
    [setSearchParams]
  );

  const handleMovementSuccess = useCallback(() => {
    refetchStock();
  }, [refetchStock]);

  const product = useMemo(() => {
    if (!productData?.success || !productData.data) return null;
    return productData.data;
  }, [productData]);

  const stockTracking = useMemo(() => {
    if (!stockData?.success || !stockData.data) return null;
    return stockData.data;
  }, [stockData]);

  const variationsWithStockHandling = useMemo(() => {
    if (!product?.variations) return [];
    return product.variations.filter((v) => v.stock_handling === true);
  }, [product?.variations]);

  const hasVariations = variationsWithStockHandling.length > 0;
  const hasProductStockHandling = product?.stock_handling === true;
  const hasStockHandling = hasProductStockHandling || hasVariations;

  const firstVariationId = useMemo(() => {
    if (!hasVariations || variationsWithStockHandling.length === 0) return null;

    const firstVariation = variationsWithStockHandling[0];
    const productVariationId = firstVariation?.product_variation_id;

    if (!productVariationId) return null;

    // Mantém como string para consistência
    return String(productVariationId);
  }, [hasVariations, variationsWithStockHandling]);

  // Sincroniza o variation_id com a URL
  useEffect(() => {
    if (!hasVariations || !product) return;

    const variationFromUrl = searchParams.get("variation");

    if (variationFromUrl) {
      // Verifica se a variação da URL existe na lista de variações
      const variationExists = variationsWithStockHandling.some(
        (v) => String(v.product_variation_id) === variationFromUrl
      );

      if (variationExists) {
        // Sincroniza o filtro com a URL se for diferente
        if (filters.variation_id !== variationFromUrl) {
          setFilters((prev) => ({
            ...prev,
            variation_id: variationFromUrl,
            page: 1,
          }));
          if (SYNC_PAGE_WITH_URL) {
            const next = new URLSearchParams(searchParams);
            next.set("variation", variationFromUrl);
            next.set("page", "1");
            setSearchParams(next, { replace: true });
          }
        }
      } else {
        const next = new URLSearchParams(searchParams);
        next.delete("variation");
        if (SYNC_PAGE_WITH_URL) next.set("page", "1");
        setSearchParams(next, { replace: true });
        if (firstVariationId) {
          setFilters((prev) => ({
            ...prev,
            variation_id: firstVariationId,
            page: 1,
          }));
        }
      }
    } else if (firstVariationId && filters.variation_id !== firstVariationId) {
      setFilters((prev) => ({
        ...prev,
        variation_id: firstVariationId,
        page: 1,
      }));
      const next = new URLSearchParams(searchParams);
      next.set("variation", firstVariationId);
      if (SYNC_PAGE_WITH_URL) next.set("page", "1");
      setSearchParams(next, { replace: true });
    }
  }, [
    searchParams,
    hasVariations,
    variationsWithStockHandling,
    product,
    firstVariationId,
    filters.variation_id,
    setSearchParams,
  ]);

  const selectedVariationId = useMemo((): string | null => {
    if (hasVariations) {
      if (filters.variation_id !== undefined && filters.variation_id !== null) {
        return String(filters.variation_id);
      }
      if (firstVariationId) {
        return String(firstVariationId);
      }
    }
    return null;
  }, [filters.variation_id, hasVariations, firstVariationId]);

  const handleVariationChange = useCallback(
    (variationId: string | null) => {
      setFilters((prev) => ({
        ...prev,
        variation_id: variationId ?? undefined,
        page: 1,
      }));

      const next = new URLSearchParams(searchParams);
      if (variationId) {
        next.set("variation", variationId);
      } else {
        next.delete("variation");
      }
      if (SYNC_PAGE_WITH_URL) next.set("page", "1");
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  setCustomLabel(product?.title || "");

  if (isLoadingProduct) {
    return (
      <div className="flex justify-center p-4">
        <Loading size="3rem" />
      </div>
    );
  }

  if (productError || !product) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {productError instanceof Error
          ? productError.message
          : "Erro ao carregar informações do produto"}
      </Alert>
    );
  }

  if (!hasStockHandling) {
    return (
      <Alert severity="warning" sx={{ m: 3 }}>
        Este produto não possui controle de estoque ativo. Ative o controle de
        estoque nas configurações do produto ou de suas variações para acessar
        esta funcionalidade.
      </Alert>
    );
  }

  return (
    <>
      <Section>
        {product.sku && (
          <p className="text-xs sm:text-sm text-beergam-typography-secondary! mb-2 sm:mb-3">
            SKU: {product.sku}
          </p>
        )}

        {hasVariations && (
          <Grid cols={{ base: 1, md: 2 }} className="mb-3 sm:mb-4">
            <Fields.wrapper>
              <Fields.label text="Variação" required />
              <Fields.select
                value={selectedVariationId || ""}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const value = e.target.value;
                  if (value === "" && variationsWithStockHandling.length > 0) {
                    // Se vazio, seleciona a primeira variação
                    const firstId = String(
                      variationsWithStockHandling[0]?.product_variation_id
                    );
                    if (firstId) {
                      handleVariationChange(firstId);
                    }
                  } else if (value !== "") {
                    handleVariationChange(value);
                  }
                }}
                options={variationsWithStockHandling.map((variation) => ({
                  value: String(variation.product_variation_id),
                  label: `${variation.title}${variation.sku ? ` (SKU: ${variation.sku})` : ""}`,
                }))}
                required
              />
            </Fields.wrapper>
          </Grid>
        )}

        <AsyncBoundary
          isLoading={isLoadingStock}
          error={stockError as unknown}
          Skeleton={StockControlSkeleton}
          ErrorFallback={() => (
            <Alert severity="error" sx={{ mb: 3 }}>
              {stockError instanceof Error
                ? stockError.message
                : "Erro ao carregar histórico de estoque"}
            </Alert>
          )}
        >
          {stockTracking && (
            <>
              <Grid cols={{ base: 1, lg: 1 }} className="mb-3 sm:mb-4">
                <StockSummary data={stockTracking} />
              </Grid>

              <Grid cols={{ base: 1, lg: 1 }} className="mb-3 sm:mb-4">
                <AverageCostCard data={stockTracking} productId={productId} />
              </Grid>

              <Grid cols={{ base: 1, lg: 1 }} className="mb-3 sm:mb-4">
                <StockMovementForm
                  productId={productId}
                  variationId={
                    hasVariations && selectedVariationId !== null
                      ? selectedVariationId
                      : undefined
                  }
                  onSuccess={handleMovementSuccess}
                />
              </Grid>

              <Section title="Histórico de Movimentações">
                <Grid cols={{ base: 1, lg: 1 }} className="mb-2 sm:mb-3">
                  <StockTrackingFilters
                    value={filters}
                    onChange={handleFiltersChange}
                  />
                </Grid>

                <StockTrackingTable
                  data={stockTracking}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  hasVariations={hasVariations}
                  variations={variationsWithStockHandling}
                  syncPageWithUrl={SYNC_PAGE_WITH_URL}
                />
              </Section>
            </>
          )}
        </AsyncBoundary>
      </Section>
    </>
  );
}

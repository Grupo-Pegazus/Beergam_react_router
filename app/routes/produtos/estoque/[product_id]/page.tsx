import { useState, useCallback, useMemo, useEffect } from "react";
import { Alert } from "@mui/material";
import Section from "~/src/components/ui/Section";
import Grid from "~/src/components/ui/Grid";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import { Fields } from "~/src/components/utils/_fields";
import Loading from "~/src/assets/loading";
import { useBreadcrumbCustomization } from "~/features/system/context/BreadcrumbContext";
import { useStockTracking, useProductDetails } from "~/features/produtos/hooks";
import StockSummary from "~/features/produtos/components/StockControl/StockSummary";
import AverageCostCard from "~/features/produtos/components/StockControl/AverageCostCard";
import StockMovementForm from "~/features/produtos/components/StockControl/StockMovementForm";
import StockTrackingTable from "~/features/produtos/components/StockControl/StockTrackingTable";
import StockTrackingFilters from "~/features/produtos/components/StockControl/StockTrackingFilters";
import type { StockTrackingFilters as StockTrackingFiltersType } from "~/features/produtos/typings";

interface StockControlPageProps {
  productId: string;
}

export default function StockControlPage({
  productId,
}: StockControlPageProps) {
  const { setCustomLabel } = useBreadcrumbCustomization();
  const [filters, setFilters] = useState<Partial<StockTrackingFiltersType>>({
    page: 1,
    page_size: 50,
  });

  const {
    data: stockData,
    isLoading: isLoadingStock,
    error: stockError,
    refetch: refetchStock,
  } = useStockTracking(productId, filters);

  const {
    data: productData,
    isLoading: isLoadingProduct,
    error: productError,
  } = useProductDetails(productId);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<StockTrackingFiltersType>) => {
      setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    },
    []
  );

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setFilters((prev) => ({ ...prev, page_size: pageSize, page: 1 }));
  }, []);

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
    
    const numericId = Number(productVariationId);
    
    if (!isNaN(numericId) && numericId > 0) {
      return numericId;
    }
    
    return productVariationId;
  }, [hasVariations, variationsWithStockHandling]);

  useEffect(() => {
    if (product && hasVariations && firstVariationId && filters.variation_id === undefined) {
      setFilters((prev) => ({
        ...prev,
        variation_id: firstVariationId,
      }));
    }
  }, [product, hasVariations, firstVariationId, filters.variation_id]);

  const selectedVariationId = useMemo((): number | string | null => {
    if (hasVariations) {
      if (filters.variation_id !== undefined && filters.variation_id !== null) {
        return filters.variation_id;
      }
      if (firstVariationId) {
        return firstVariationId;
      }
    }
    return null;
  }, [filters.variation_id, hasVariations, firstVariationId]);
  
  console.log("selectedVariationId:", selectedVariationId, "hasVariations:", hasVariations, "firstVariationId:", firstVariationId, "filters.variation_id:", filters.variation_id);
  const handleVariationChange = useCallback((variationId: number | string | null) => {
    setFilters((prev) => ({
      ...prev,
      variation_id: variationId ?? undefined,
      page: 1,
    }));
  }, []);

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
        estoque nas configurações do produto ou de suas variações para acessar esta funcionalidade.
      </Alert>
    );
  }

  return (
    <>
      <Section>
        {product.sku && (
          <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
            SKU: {product.sku}
          </p>
        )}

        {hasVariations && (
          <Grid cols={{ base: 1, md: 2 }} className="mb-3 sm:mb-4">
            <Fields.wrapper>
              <Fields.label text="Variação" required />
              <Fields.select
                value={
                  selectedVariationId !== null && selectedVariationId !== undefined
                    ? String(selectedVariationId)
                    : firstVariationId !== null
                    ? String(firstVariationId)
                    : ""
                }
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const value = e.target.value;
                      if (value === "") {
                        const firstId = Number(variationsWithStockHandling[0]?.product_variation_id);
                        if (firstId && !isNaN(firstId)) {
                          handleVariationChange(firstId);
                        }
                      } else {
                        const numValue = Number(value);
                        if (!isNaN(numValue)) {
                          handleVariationChange(numValue);
                        }
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
                  variationId={hasVariations && selectedVariationId !== null ? String(selectedVariationId) : undefined}
                  variationSku={
                    hasVariations && selectedVariationId !== null
                      ? variationsWithStockHandling.find(
                          (v) => v.product_variation_id === String(selectedVariationId)
                        )?.sku ?? null
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
                />
              </Section>
            </>
          )}
        </AsyncBoundary>
      </Section>
    </>
  );
}


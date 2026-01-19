import { Alert, Box, Paper, Stack } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useBreadcrumbCustomization } from "~/features/system/context/BreadcrumbContext";
import { useProductDetails } from "../../hooks";
import ProductAdditionalInfo from "./ProductAdditionalInfo/ProductAdditionalInfo";
import ProductDetailsSkeleton from "./ProductDetailsSkeleton";
import ProductImageGallery from "./ProductImageGallery/ProductImageGallery";
import ProductInfo from "./ProductInfo/ProductInfo";
import ProductRelatedAds from "./ProductRelatedAds/ProductRelatedAds";
import ProductVariations from "./ProductVariations/ProductVariations";
import StockPreview from "./StockPreview/StockPreview";

interface ProductDetailsProps {
  productId: string;
}

/**
 * Componente principal que integra todos os componentes de detalhe do produto
 */
export default function ProductDetails({ productId }: ProductDetailsProps) {
  const { setCustomLabel } = useBreadcrumbCustomization();
  const { data, isLoading, error } = useProductDetails(productId);

  useEffect(() => {
    if (data?.data?.title) {
      setCustomLabel(`Detalhes do Produto: ${data.data.title}`);
    }
  }, [data?.data?.title, setCustomLabel]);

  const product = useMemo(() => {
    return data?.data;
  }, [data]);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (error) {
    return (
      <Alert severity="error">
        {error instanceof Error
          ? error.message
          : "Erro ao carregar detalhes do produto"}
      </Alert>
    );
  }

  if (!product) {
    return <Alert severity="warning">Produto não encontrado</Alert>;
  }

  return (
    <Stack spacing={3}>
      {/* Primeira linha: Galeria de imagens e informações principais */}
      <Box className="grid grid-cols-1 md:grid-cols-[38%_60%] gap-4 items-stretch">
        <ProductImageGallery product={product} />

        <Paper className="w-full flex flex-col bg-beergam-section-background!">
          <Stack spacing={2} sx={{ height: "100%" }}>
            <ProductInfo product={product} />
          </Stack>
        </Paper>
      </Box>

      {/* Segunda linha: Prévia de estoque */}
      <StockPreview product={product} />

      {/* Terceira linha: Variações */}
      {product.variations && product.variations.length > 0 && (
        <ProductVariations product={product} />
      )}

      {/* Quarta linha: Informações adicionais */}
      <ProductAdditionalInfo product={product} />

      {/* Quinta linha: Anúncios relacionados */}
      {product.related_ads && product.related_ads.length > 0 && (
        <ProductRelatedAds product={product} />
      )}
    </Stack>
  );
}

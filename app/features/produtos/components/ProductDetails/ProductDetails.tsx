import { useMemo } from "react";
import { Box, Stack, Alert } from "@mui/material";
import { useProductDetails } from "../../hooks";
import ProductInfo from "./ProductInfo/ProductInfo";
import ProductImageGallery from "./ProductImageGallery/ProductImageGallery";
import StockPreview from "./StockPreview/StockPreview";
import ProductVariations from "./ProductVariations/ProductVariations";
import ProductAdditionalInfo from "./ProductAdditionalInfo/ProductAdditionalInfo";
import ProductDetailsSkeleton from "./ProductDetailsSkeleton";

interface ProductDetailsProps {
  productId: string;
}

/**
 * Componente principal que integra todos os componentes de detalhe do produto
 */
export default function ProductDetails({ productId }: ProductDetailsProps) {
  const { data, isLoading, error } = useProductDetails(productId);

  const product = useMemo(() => {
    return data?.data;
  }, [data]);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (error) {
    return (
      <Alert severity="error">
        {error instanceof Error ? error.message : "Erro ao carregar detalhes do produto"}
      </Alert>
    );
  }

  if (!product) {
    return (
      <Alert severity="warning">
        Produto não encontrado
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Primeira linha: Galeria de imagens e informações principais */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "40%" },
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <ProductImageGallery product={product} />
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: "60%" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack spacing={2} sx={{ height: "100%" }}>
            <ProductInfo product={product} />
          </Stack>
        </Box>
      </Box>

      {/* Segunda linha: Prévia de estoque */}
      <StockPreview product={product} />

      {/* Terceira linha: Variações */}
      {product.variations && product.variations.length > 0 && (
        <ProductVariations product={product} />
      )}

      {/* Quarta linha: Informações adicionais */}
      <ProductAdditionalInfo product={product} />
    </Stack>
  );
}


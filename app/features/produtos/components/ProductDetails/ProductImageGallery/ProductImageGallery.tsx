import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import Svg from "~/src/assets/svgs/_index";
import { Fields } from "~/src/components/utils/_fields";
import BeergamButton from "~/src/components/utils/BeergamButton";
import type { ProductDetails } from "../../../typings";

interface ProductImageGalleryProps {
  product: ProductDetails;
}

type ImageType = "product" | "marketplace" | "shipping";

const imageTypeLabels: Record<ImageType, string> = {
  product: "Imagens do Produto",
  marketplace: "Imagens para Marketplace",
  shipping: "Imagens para Envio",
};

export default function ProductImageGallery({
  product,
}: ProductImageGalleryProps) {
  const [selectedTab, setSelectedTab] = useState<ImageType>("product");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(
    null
  );

  const hasVariations = product.variations && product.variations.length > 0;

  // Seleciona a primeira variação por padrão se houver variações
  const defaultVariationId = useMemo(() => {
    if (hasVariations && product.variations && product.variations.length > 0) {
      return product.variations[0].product_variation_id;
    }
    return null;
  }, [hasVariations, product.variations]);

  const activeVariationId = selectedVariationId || defaultVariationId;

  // Encontra a variação selecionada
  const selectedVariation = useMemo(() => {
    if (!hasVariations || !activeVariationId) return null;
    return (
      product.variations?.find(
        (v) => v.product_variation_id === activeVariationId
      ) || null
    );
  }, [hasVariations, activeVariationId, product.variations]);

  // Determina quais imagens usar: da variação selecionada ou do produto
  const imagesSource = useMemo(() => {
    if (hasVariations && selectedVariation) {
      return (
        selectedVariation.images || {
          product: [],
          marketplace: [],
          shipping: [],
        }
      );
    }
    return product.images;
  }, [hasVariations, selectedVariation, product.images]);

  const currentImages = useMemo(() => {
    return imagesSource[selectedTab] || [];
  }, [imagesSource, selectedTab]);

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: ImageType
  ) => {
    setSelectedTab(newValue);
    setSelectedIndex(0);
  };

  const handlePrevious = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? currentImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedIndex((prev) =>
      prev === currentImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
  };

  const getImageUrl = (imageId: string) => {
    return `${imageId}`;
  };

  return (
    <Paper>
      <Stack spacing={2} sx={{ width: "100%" }}>
        {/* Seletor de variações - apenas quando há variações */}
        {hasVariations &&
          product.variations &&
          product.variations.length > 0 && (
            <FormControl fullWidth size="small">
              {/* <InputLabel id="variation-select-label">Variação</InputLabel>
              <Select
                labelId="variation-select-label"
                value={activeVariationId || ""}
                label="Variação"
                onChange={(e) => {
                  setSelectedVariationId(e.target.value as string);
                  setSelectedIndex(0); // Reset para primeira imagem ao trocar variação
                }}
                sx={{
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  },
                }}
              >
                {product.variations.map((variation) => {
                  const variationImages = variation.images?.product || [];
                  const hasImages = variationImages.length > 0;
                  return (
                    <MenuItem
                      key={variation.product_variation_id}
                      value={variation.product_variation_id}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          width: "100%",
                        }}
                      >
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          {variation.title}
                        </Typography>
                        {variation.sku && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              fontFamily: "monospace",
                            }}
                          >
                            {variation.sku}
                          </Typography>
                        )}
                        {hasImages && (
                          <Chip
                            label={variationImages.length}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.65rem",
                              bgcolor: "primary.main",
                              color: "white",
                            }}
                          />
                        )}
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select> */}
              <Fields.wrapper>
                <Fields.label text="Variação" />
                <Fields.select
                  value={activeVariationId || ""}
                  onChange={(e) => {
                    setSelectedVariationId(e.target.value as string);
                    setSelectedIndex(0);
                  }}
                  options={product.variations.map((variation) => ({
                    value: variation.product_variation_id,
                    label: variation.title,
                  }))}
                  // required
                />
              </Fields.wrapper>
            </FormControl>
          )}

        {/* Tabs para selecionar tipo de imagem */}
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            minHeight: 48,
            "& .MuiTabs-list": {
              gridTemplateColumns: "1fr 1fr 1fr",
            },
          }}
          className="bg-beergam-section-background!"
        >
          {Object.entries(imageTypeLabels).map(([key, label]) => {
            const imageType = key as ImageType;
            const imageCount = product.images[imageType]?.length || 0;
            return (
              <Tab
                key={key}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {label}
                    </Typography>
                    {imageCount > 0 && (
                      <Typography
                        variant="caption"
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          px: 0.75,
                          py: 0.25,
                          borderRadius: 1,
                          fontSize: "0.65rem",
                          fontWeight: 600,
                        }}
                      >
                        {imageCount}
                      </Typography>
                    )}
                  </Box>
                }
                value={imageType}
                sx={{ textTransform: "none", minHeight: 48 }}
              />
            );
          })}
        </Tabs>

        {/* Conteúdo da galeria */}
        {currentImages.length > 0 ? (
          <>
            {/* Imagem principal */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
                margin: "0 auto !important",
                aspectRatio: "1",
                borderRadius: 2,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "grey.50",
              }}
            >
              <Box
                component="img"
                src={getImageUrl(currentImages[selectedIndex])}
                alt={`${imageTypeLabels[selectedTab]} - ${selectedIndex + 1}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              {currentImages.length > 1 && (
                <>
                  <IconButton
                    onClick={handlePrevious}
                    sx={{
                      position: "absolute",
                      left: { xs: 4, sm: 8 },
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                      "&:hover": { bgcolor: "rgba(255, 255, 255, 1)" },
                      width: { xs: 32, sm: 40 },
                      height: { xs: 32, sm: 40 },
                    }}
                  >
                    <Typography
                      sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 700 }}
                    >
                      ‹
                    </Typography>
                  </IconButton>
                  <IconButton
                    onClick={handleNext}
                    sx={{
                      position: "absolute",
                      right: { xs: 4, sm: 8 },
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                      "&:hover": { bgcolor: "rgba(255, 255, 255, 1)" },
                      width: { xs: 32, sm: 40 },
                      height: { xs: 32, sm: 40 },
                    }}
                  >
                    <Typography
                      sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 700 }}
                    >
                      ›
                    </Typography>
                  </IconButton>
                </>
              )}
            </Box>

            {/* Thumbnails */}
            {currentImages.length > 1 && (
              <Box
                sx={{
                  width: "100%",
                  overflowX: "auto",
                  overflowY: "hidden",
                  WebkitOverflowScrolling: "touch",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#c1c1c1 #f1f1f1",
                  position: "relative",
                  "&::-webkit-scrollbar": {
                    height: 6,
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                    borderRadius: 3,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#c1c1c1",
                    borderRadius: 3,
                    "&:hover": {
                      background: "#a8a8a8",
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    maxWidth: { xs: "85vw", sm: "100%" },
                    gap: 1,
                    pb: 0.5,
                    width: "100%",
                  }}
                >
                  {currentImages.map((imageId, index) => (
                    <Box
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      sx={{
                        width: { xs: 60, sm: 70, md: 80 },
                        height: { xs: 60, sm: 70, md: 80 },
                        minWidth: { xs: 60, sm: 70, md: 80 },
                        flexShrink: 0,
                        borderRadius: 1,
                        overflow: "hidden",
                        cursor: "pointer",
                        border: selectedIndex === index ? 2 : 1,
                        borderColor:
                          selectedIndex === index
                            ? "var(--color-beergam-orange)"
                            : "rgba(0, 0, 0, 0.1)",
                        opacity: selectedIndex === index ? 1 : 0.7,
                        transition: "all 0.2s",
                        "&:hover": {
                          opacity: 1,
                          transform: { xs: "none", sm: "scale(1.05)" },
                        },
                        "&:active": {
                          transform: { xs: "scale(0.95)", sm: "scale(1.05)" },
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={getImageUrl(imageId)}
                        alt={`${imageTypeLabels[selectedTab]} - ${index + 1}`}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center rounded-lg bg-beergam-section-background justify-center min-h-96 gap-2 p-3">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-beergam-primary/20 mb-1">
              <Svg.bag tailWindClasses="h-10 w-10 text-beergam-primary" />
            </div>
            <Typography
              variant="h6"
              className="text-beergam-typography-primary"
              sx={{
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              Nenhuma imagem disponível
            </Typography>
            <Typography
              variant="body2"
              className="text-beergam-typography-secondary text-center max-w-96"
            >
              Este produto não possui{" "}
              {imageTypeLabels[selectedTab].toLowerCase()} cadastradas. Adicione
              imagens editando o produto.
            </Typography>
            <Box sx={{ mt: 1 }}>
              <BeergamButton
                title="Editar Produto"
                animationStyle="slider"
                link={`/interno/produtos/editar/${product.product_id}`}
                icon="pencil"
              />
            </Box>
          </div>
        )}
      </Stack>
    </Paper>
  );
}

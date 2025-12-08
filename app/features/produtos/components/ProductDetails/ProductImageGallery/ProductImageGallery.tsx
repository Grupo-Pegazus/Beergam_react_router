import { useState, useMemo } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import type { ProductDetails } from "../../../typings";
import BeergamButton from "~/src/components/utils/BeergamButton";
import Svg from "~/src/assets/svgs/_index";

interface ProductImageGalleryProps {
  product: ProductDetails;
}

type ImageType = "product" | "marketplace" | "shipping";

const imageTypeLabels: Record<ImageType, string> = {
  product: "Imagens do Produto",
  marketplace: "Imagens para Marketplace",
  shipping: "Imagens para Envio",
};

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [selectedTab, setSelectedTab] = useState<ImageType>("product");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentImages = useMemo(() => {
    return product.images[selectedTab] || [];
  }, [product.images, selectedTab]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: ImageType) => {
    setSelectedTab(newValue);
    setSelectedIndex(0);
  };

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? currentImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === currentImages.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
  };

  const getImageUrl = (imageId: string) => {
    return `${imageId}`;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderRadius: 2,
        border: "1px solid rgba(15, 23, 42, 0.08)",
        height: "100%",
        width: "100%",
        maxWidth: "100%",
      }}
    >
      <Stack spacing={2} sx={{ width: "100%" }}>
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
          }}
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
                    <Typography sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 700 }}>‹</Typography>
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
                    <Typography sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 700 }}>›</Typography>
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
                        borderColor: selectedIndex === index ? "var(--color-beergam-orange)" : "rgba(0, 0, 0, 0.1)",
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 300,
              gap: 2,
              p: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "grey.100",
                mb: 1,
              }}
            >
              <Svg.bag tailWindClasses="h-10 w-10 text-slate-400" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", textAlign: "center" }}>
              Nenhuma imagem disponível
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", maxWidth: 300 }}>
              Este produto não possui {imageTypeLabels[selectedTab].toLowerCase()} cadastradas. Adicione imagens editando o produto.
            </Typography>
            <Box sx={{ mt: 1 }}>
              <BeergamButton
                title="Editar Produto"
                mainColor="beergam-blue-primary"
                animationStyle="slider"
                link={`/interno/produtos/editar/${product.product_id}`}
                icon="pencil"
              />
            </Box>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}


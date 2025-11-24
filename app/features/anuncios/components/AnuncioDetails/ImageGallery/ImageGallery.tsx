import { useState, useMemo } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { AnuncioDetails } from "../../../typings";

interface ImageGalleryProps {
  anuncio: AnuncioDetails;
}

export default function ImageGallery({ anuncio }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const images = useMemo(() => {
    if (anuncio.images.length > 0) {
      return anuncio.images;
    }
    return [{ url: anuncio.thumbnail, secure_url: anuncio.thumbnail, id: "thumbnail" }];
  }, [anuncio.images, anuncio.thumbnail]);

  const currentImage = images[selectedIndex];

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
  };

  if (images.length === 0) {
    return null;
  }

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
          }}
        >
          <Box
            component="img"
            src={currentImage.secure_url || currentImage.url}
            alt={anuncio.name}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
          {images.length > 1 && (
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
        {images.length > 1 && (
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
              {images.map((image, index) => (
                <Box
                  key={"id" in image ? image.id : index}
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
                    src={image.secure_url || image.url}
                    alt={`${anuncio.name} - ${index + 1}`}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}


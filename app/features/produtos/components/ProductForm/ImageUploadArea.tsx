import { useState } from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import Upload from "~/src/components/utils/upload";
import type { InternalUploadService } from "~/src/components/utils/upload/types";
import { getNestedValue } from "./utils";

interface ImageUploadAreaProps {
  values: Record<string, unknown>;
  onFieldChange: (name: string, value: unknown) => void;
  uploadService?: InternalUploadService;
}

export default function ImageUploadArea({
  values,
  onFieldChange,
  uploadService,
}: ImageUploadAreaProps) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"product" | "marketplace" | "shipping">("product");

  const productImages = (getNestedValue(values, "images.product") as string[]) || [];

  const handleUploadClick = (type: "product" | "marketplace" | "shipping") => {
    setUploadType(type);
    setUploadModalOpen(true);
  };

  const handleUploadSuccess = (ids: string[]) => {
    const fieldName = `images.${uploadType}`;
    onFieldChange(fieldName, ids);
    setUploadModalOpen(false);
  };

  const renderImageSlot = (imageId: string | undefined, index: number) => {
    if (imageId) {
      return (
        <Box
          key={index}
          sx={{
            aspectRatio: "1",
            bgcolor: "grey.200",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed",
            borderColor: "grey.300",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <img
            src={`${imageId}`}
            alt={`Imagem ${index + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
      );
    }

    return (
      <Box
        key={index}
        sx={{
          aspectRatio: "1",
          bgcolor: "grey.50",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "2px dashed",
          borderColor: "grey.300",
          color: "text.secondary",
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "grey.100",
          },
        }}
      >
        <Typography variant="caption" sx={{ textAlign: "center", px: 2 }}>
          Sem imagem
        </Typography>
        <Typography variant="caption" sx={{ textAlign: "center", px: 2, mt: 0.5 }}>
          Arraste ou Insira aqui
        </Typography>
      </Box>
    );
  };

  const renderAddButton = (type: "product" | "marketplace" | "shipping", label: string) => {
    return (
      <Box
        onClick={() => handleUploadClick(type)}
        sx={{
          aspectRatio: "1",
          bgcolor: "primary.main",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s",
          color: "white",
          "&:hover": {
            bgcolor: "primary.dark",
            transform: "scale(1.02)",
          },
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          +
        </Typography>
        <Typography variant="caption" sx={{ textAlign: "center", px: 2, fontSize: "0.7rem" }}>
          {label}
        </Typography>
      </Box>
    );
  };

  return (
    <Paper elevation={0} sx={{ p: 3, bgcolor: "primary.dark", borderRadius: 2, height: "fit-content" }}>
      <Typography variant="h6" sx={{ mb: 3, color: "white", fontWeight: 600 }}>
        Imagens do Produto
      </Typography>

      <Grid container spacing={2}>
        {/* Slots de imagens do produto */}
        {Array.from({ length: 8 }).map((_, index) => {
          if (index === 0) {
            return (
              <Grid size={6} key={index}>
                {renderAddButton("product", "Adicionar Novas fotos")}
              </Grid>
            );
          }
          return (
            <Grid size={6} key={index}>
              {renderImageSlot(productImages[index - 1], index)}
            </Grid>
          );
        })}
      </Grid>

      {/* Modal de Upload */}
      {uploadService && (
        <Upload
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          typeImport="internal"
          service={uploadService}
          maxFiles={8}
          accept="image/*"
          emptyStateLabel="Arraste e solte ou clique para selecionar imagens"
          draggingLabel="Solte para iniciar o upload"
          onChange={handleUploadSuccess}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </Paper>
  );
}


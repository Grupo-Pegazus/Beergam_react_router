import { useMemo } from "react";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { getLogisticTypeMeliInfo } from "~/src/constants/logistic-type-meli";
import type { AnuncioDetails } from "../../../typings";

interface AnuncioFeaturesProps {
  anuncio: AnuncioDetails;
}

export default function AnuncioFeatures({ anuncio }: AnuncioFeaturesProps) {
  const features = useMemo(() => {
    const featureList: string[] = [];

    if (anuncio.features && anuncio.features.length > 0) {
      featureList.push(...anuncio.features);
    } else {
      // Features padrão baseadas nos dados do anúncio
      if (anuncio.is_catalog) {
        featureList.push("CATALOGO");
      }
      if (anuncio.variations_count > 0) {
        featureList.push("VARIAÇÕES");
      }
      if (anuncio.status === "active") {
        featureList.push("ATIVO");
      }
    }

    return featureList;
  }, [anuncio]);

  // Tipo de entrega usando a função existente
  const logisticTypeInfo = anuncio.logistic_type
    ? getLogisticTypeMeliInfo(anuncio.logistic_type)
    : null;

  if (features.length === 0) {
    return null;
  }

  const getFeatureColor = (feature: string): { bg: string; color: string } => {
    const colors: Record<string, { bg: string; color: string }> = {
      CATALOGO: { bg: "var(--color-beergam-green-primary)", color: "#fff" },
      "FRETE GRÁTIS": { bg: "var(--color-beergam-orange-light)", color: "var(--color-beergam-orange-dark)" },
      VARIAÇÕES: { bg: "#f3e8ff", color: "#7c3aed" },
      ATIVO: { bg: "#d1fae5", color: "#065f46" },
    };

    return colors[feature] || { bg: "#f3f4f6", color: "#374151" };
  };

  if (features.length === 0 && !logisticTypeInfo && !anuncio.free_shipping) {
    return null;
  }

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
      {/* Chip de tipo de entrega */}
      {logisticTypeInfo && (
        <Chip
          label={logisticTypeInfo.label}
          size="small"
          sx={{
            bgcolor: logisticTypeInfo.backgroundColor,
            color: logisticTypeInfo.color,
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        />
      )}

      {/* Outras features */}
      {features.map((feature) => {
        const colors = getFeatureColor(feature);
        return (
          <Chip
            key={feature}
            label={feature}
            size="small"
            sx={{
              bgcolor: colors.bg,
              color: colors.color,
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        );
      })}
    </Stack>
  );
}


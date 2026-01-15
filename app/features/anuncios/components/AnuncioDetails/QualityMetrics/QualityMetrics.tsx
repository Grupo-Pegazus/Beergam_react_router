import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import type { AnuncioDetails } from "../../../typings";
import Speedometer from "../../Speedometer/Speedometer";

interface QualityMetricsProps {
  anuncio: AnuncioDetails;
}

export default function QualityMetrics({ anuncio }: QualityMetricsProps) {
  const qaScore =
    anuncio.quality_metrics?.qa_score ?? anuncio.health?.score ?? null;
  const ecScore = anuncio.quality_metrics?.ec_score ?? null;

  const qaLabel = useMemo(() => {
    if (qaScore === null) return "Não disponível";
    if (qaScore >= 80) return "Excelente";
    if (qaScore >= 60) return "Bom";
    return "Precisa melhorar";
  }, [qaScore]);

  const ecLabel = useMemo(() => {
    if (ecScore === null) return "Não disponível";
    if (ecScore >= 80) return "Excelente";
    if (ecScore >= 60) return "Bom";
    return "Precisa melhorar";
  }, [ecScore]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid rgba(15, 23, 42, 0.08)",
        backgroundColor: "var(--color-beergam-section-background)",
        height: "100%",
        overflowY: "auto",
        maxHeight: "350px",
      }}
    >
      <Stack spacing={3}>
        {/* Qualidade do Anúncio */}
        <Box>
          <Typography
            className="text-beergam-typography-primary!"
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 2 }}
          >
            Qualidade do Anúncio (QA)
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Speedometer value={qaScore} size={80} />
            <Box>
              <Typography
                className="text-beergam-typography-tertiary!"
                variant="body2"
              >
                {qaLabel}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Experiência de Compra */}
        <Box>
          <Typography
            className="text-beergam-typography-primary!"
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 2 }}
          >
            Experiência de Compra (EC)
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Speedometer value={ecScore} size={80} />
            <Box>
              <Typography
                className="text-beergam-typography-tertiary!"
                variant="body2"
              >
                {ecLabel}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}

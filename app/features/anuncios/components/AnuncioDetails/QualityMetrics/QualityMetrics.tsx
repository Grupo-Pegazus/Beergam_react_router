import { useMemo } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Speedometer from "../../Speedometer/Speedometer";
import type { AnuncioDetails } from "../../../typings";

interface QualityMetricsProps {
  anuncio: AnuncioDetails;
}

export default function QualityMetrics({ anuncio }: QualityMetricsProps) {
  const qaScore = anuncio.quality_metrics?.qa_score ?? anuncio.health?.score ?? null;
  const ecScore = anuncio.quality_metrics?.ec_score ?? null;

  console.log(qaScore, ecScore);

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
        height: "100%",
        overflowY: "auto",
        maxHeight: "350px",
      }}
    >
      <Stack spacing={3}>
        {/* Qualidade do Anúncio */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            Qualidade do Anúncio (QA)
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Speedometer value={qaScore} size={80} />
            <Box>
              <Typography variant="body2" color="text.primary">
                {qaLabel}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Experiência de Compra */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            Experiência de Compra (EC)
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Speedometer value={ecScore} size={80} />
            <Box>
              <Typography variant="body2" color="text.primary">
                {ecLabel}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}


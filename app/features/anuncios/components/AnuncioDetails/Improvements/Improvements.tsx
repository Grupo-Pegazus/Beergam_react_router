import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import type { AnuncioDetails } from "../../../typings";
import { Button } from "@mui/material";

interface ImprovementsProps {
  anuncio: AnuncioDetails;
}

export default function Improvements({ anuncio }: ImprovementsProps) {
  const opportunities = anuncio.improvements?.opportunities ?? [];
  const warnings = anuncio.improvements?.warnings ?? [];
  const totalCount = anuncio.improvements?.total_count ?? opportunities.length + warnings.length;

  const hasImprovements = totalCount > 0;

  if (!hasImprovements) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid rgba(15, 23, 42, 0.08)",
          height: "100%",
          maxHeight: "350px",
          overflowY: "auto",
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Melhorias
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Nenhuma melhoria disponível no momento.
          </Typography>
        </Stack>
      </Paper>
    );
  }

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
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Melhorias
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quantidade de melhorias: {totalCount}
          </Typography>
        </Box>

        {/* Oportunidades */}
        {opportunities.length > 0 && (
          <Card
            sx={{
              bgcolor: "#fef3c7",
              border: "1px solid #fbbf24",
            }}
          >
            <CardContent>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h6" sx={{ color: "#f59e0b" }}>💡</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Oportunidade
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Oportunidades para aumentar a qualidade da publicação e melhorar seu desempenho
                </Typography>
                <Stack spacing={1.5}>
                  {opportunities.map((opportunity) => (
                    <Box
                      key={opportunity.id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "#fff",
                        border: "1px solid rgba(251, 191, 36, 0.3)",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          borderColor: "rgba(251, 191, 36, 0.5)",
                        },
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: "#92400e" }}>
                          {opportunity.title}
                        </Typography>
                        {opportunity.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {opportunity.description}
                          </Typography>
                        )}
                        {opportunity.action && (
                          <Box sx={{ pt: 0.5 }}>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => window.open(opportunity.action, "_blank")}
                              sx={{
                                bgcolor: "#f59e0b",
                                color: "#fff",
                                fontWeight: 600,
                                textTransform: "none",
                                borderRadius: 1.5,
                                px: 2,
                                py: 0.75,
                                "&:hover": {
                                  bgcolor: "#d97706",
                                },
                              }}
                            >
                              {opportunity.label_action || "Ver mais"}
                            </Button>
                          </Box>
                        )}
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Avisos */}
        {warnings.length > 0 && (
          <Card
            sx={{
              bgcolor: "#fee2e2",
              border: "1px solid #f87171",
            }}
          >
            <CardContent>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h6" sx={{ color: "#ef4444" }}>⚠️</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Aviso
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Problemas com a qualidade que reduzem o score até que sejam resolvidos
                </Typography>
                <Stack spacing={1.5}>
                  {warnings.map((warning) => (
                    <Box
                      key={warning.id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "#fff",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          borderColor: "rgba(239, 68, 68, 0.5)",
                        },
                      }}
                    >
                      <Stack spacing={1}>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: "#dc2626" }}>
                          {warning.title}
                        </Typography>
                        {warning.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {warning.description}
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Paper>
  );
}


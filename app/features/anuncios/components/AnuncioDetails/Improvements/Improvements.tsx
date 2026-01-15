import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Svg from "~/src/assets/svgs/_index";
import BeergamButton from "~/src/components/utils/BeergamButton";
import type { AnuncioDetails } from "../../../typings";

interface ImprovementsProps {
  anuncio: AnuncioDetails;
}

export default function Improvements({ anuncio }: ImprovementsProps) {
  const opportunities = anuncio.improvements?.opportunities ?? [];
  const warnings = anuncio.improvements?.warnings ?? [];
  const totalCount =
    anuncio.improvements?.total_count ?? opportunities.length + warnings.length;

  const hasImprovements = totalCount > 0;

  if (!hasImprovements) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid rgba(15, 23, 42, 0.08)",
          backgroundColor: "var(--color-beergam-section-background)",
          height: "100%",
          maxHeight: "350px",
          overflowY: "auto",
        }}
      >
        <Stack spacing={2}>
          <Typography
            className="text-beergam-typography-primary!"
            variant="h6"
            sx={{ fontWeight: 700 }}
          >
            Melhorias
          </Typography>
          <Typography
            className="text-beergam-typography-secondary!"
            variant="body2"
          >
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
        backgroundColor: "var(--color-beergam-section-background)",
        height: "100%",
        overflowY: "auto",
        maxHeight: "350px",
      }}
    >
      <Stack spacing={3}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            className="text-beergam-typography-primary!"
            variant="h6"
            sx={{ fontWeight: 700 }}
          >
            Melhorias
          </Typography>
          <Typography
            className="text-beergam-typography-secondary!"
            variant="body2"
          >
            Quantidade de melhorias: {totalCount}
          </Typography>
        </Box>

        {/* Oportunidades */}
        {opportunities.length > 0 && (
          <Card
            sx={{
              bgcolor: "var(--color-beergam-menu-background)",
              border: "1px solid var(--color-beergam-primary)",
            }}
          >
            <CardContent>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Svg.warning_circle
                    width={24}
                    height={24}
                    tailWindClasses="text-beergam-yellow!"
                  />
                  <Typography
                    className="text-beergam-white!"
                    variant="subtitle1"
                    sx={{ fontWeight: 700 }}
                  >
                    Oportunidade
                  </Typography>
                </Box>
                <Typography variant="body2" className="text-beergam-white!">
                  Oportunidades para aumentar a qualidade da publicação e
                  melhorar seu desempenho
                </Typography>
                <Stack spacing={1.5}>
                  {opportunities.map((opportunity) => (
                    <Box
                      key={opportunity.id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "var(--color-beergam-mui-paper)",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Typography
                          variant="body1"
                          className="text-beergam-primary!"
                          sx={{ fontWeight: 700 }}
                        >
                          {opportunity.title}
                        </Typography>
                        {opportunity.description && (
                          <Typography
                            variant="body2"
                            className="text-beergam-typography-secondary!"
                            sx={{ lineHeight: 1.6 }}
                          >
                            {opportunity.description}
                          </Typography>
                        )}
                        {opportunity.action && (
                          <Box sx={{ pt: 0.5 }}>
                            <BeergamButton
                              title={opportunity.label_action || "Ver mais"}
                              animationStyle="slider"
                              onClick={() =>
                                window.open(opportunity.action, "_blank")
                              }
                              className="text-sm"
                            />
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
                  <Typography variant="h6" sx={{ color: "#ef4444" }}>
                    ⚠️
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Aviso
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Problemas com a qualidade que reduzem o score até que sejam
                  resolvidos
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
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 700, color: "#dc2626" }}
                        >
                          {warning.title}
                        </Typography>
                        {warning.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ lineHeight: 1.6 }}
                          >
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

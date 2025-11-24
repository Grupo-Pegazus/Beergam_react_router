import { Skeleton, Stack, Paper, Box } from "@mui/material";

/**
 * Skeleton para a página de detalhes do anúncio
 * Seguindo o padrão do projeto e a estrutura do AnuncioDetails
 */
export default function AnuncioDetailsSkeleton() {
  return (
    <Stack spacing={3}>
      {/* Seção de Update SKU */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: "2px dashed var(--color-beergam-orange)",
          bgcolor: "rgba(255, 138, 0, 0.05)",
        }}
      >
        <Stack spacing={2}>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="80%" height={16} />
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
          </Stack>
        </Stack>
      </Paper>

      {/* Primeira linha */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          alignItems: "stretch",
        }}
      >
        {/* Coluna esquerda - Galeria de imagens (40%) */}
        <Box
          sx={{
            width: { xs: "100%", md: "40%" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.5, sm: 2 },
              borderRadius: 2,
              border: "1px solid rgba(15, 23, 42, 0.08)",
              height: "100%",
            }}
          >
            <Stack spacing={2}>
              {/* Imagem principal */}
              <Skeleton
                variant="rectangular"
                width="100%"
                sx={{
                  aspectRatio: "1",
                  borderRadius: 2,
                  maxWidth: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
                  mx: "auto",
                }}
              />
              {/* Thumbnails */}
              <Box
                sx={{
                  width: "100%",
                  overflowX: "auto",
                  overflowY: "hidden",
                }}
              >
                <Stack direction="row" spacing={1} justifyContent="flex-start">
                  {[1, 2, 3, 4].map((index) => (
                    <Skeleton
                      key={index}
                      variant="rectangular"
                      width={{ xs: 60, sm: 70, md: 80 }}
                      height={{ xs: 60, sm: 70, md: 80 }}
                      sx={{ borderRadius: 1, flexShrink: 0 }}
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Box>

        {/* Coluna direita - Informações do produto (60%) */}
        <Box
          sx={{
            width: { xs: "100%", md: "60%" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack spacing={2} sx={{ height: "100%" }}>
            {/* AnuncioInfo Skeleton */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid rgba(15, 23, 42, 0.08)",
              }}
            >
              <Stack spacing={2}>
                {/* Título */}
                <Skeleton variant="text" width="80%" height={40} />
                
                {/* ID e SKU */}
                <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
                  <Box>
                    <Skeleton variant="text" width={40} height={14} />
                    <Skeleton variant="text" width={120} height={20} />
                  </Box>
                </Stack>

                {/* Tipo de anúncio e idade */}
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" gap={1}>
                  <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: 1 }} />
                  <Skeleton variant="text" width={150} height={16} />
                  <Skeleton variant="text" width={120} height={14} />
                </Stack>

                {/* Features */}
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {[1, 2, 3].map((index) => (
                    <Skeleton
                      key={index}
                      variant="rectangular"
                      width={100}
                      height={24}
                      sx={{ borderRadius: 1 }}
                    />
                  ))}
                </Stack>

                {/* Métricas de performance */}
                <Stack direction="row" spacing={3} flexWrap="wrap" gap={2}>
                  <Box>
                    <Skeleton variant="text" width={180} height={14} />
                    <Skeleton variant="text" width={60} height={28} />
                  </Box>
                  <Box>
                    <Skeleton variant="text" width={120} height={14} />
                    <Skeleton variant="text" width={60} height={28} />
                  </Box>
                </Stack>

                {/* Preço e Estoque */}
                <Stack direction="row" spacing={3} alignItems="center">
                  <Box>
                    <Skeleton variant="text" width={60} height={14} />
                    <Skeleton variant="text" width={100} height={36} />
                  </Box>
                  <Box>
                    <Skeleton variant="text" width={70} height={14} />
                    <Skeleton variant="text" width={80} height={36} />
                  </Box>
                </Stack>

                {/* Switch e Botão */}
                <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap" gap={1}>
                  <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
                  <Skeleton variant="rectangular" width={180} height={36} sx={{ borderRadius: 1 }} />
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Box>

      {/* Variações */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid rgba(15, 23, 42, 0.08)",
        }}
      >
        <Stack spacing={3}>
          <Skeleton variant="text" width={200} height={28} />
          <Stack spacing={2}>
            {[1, 2, 3].map((index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                  <Skeleton variant="text" width={200} height={20} />
                  <Skeleton variant="text" width={80} height={20} />
                  <Skeleton variant="text" width={100} height={20} />
                  <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
                </Stack>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Paper>

      {/* Segunda linha - Métricas de qualidade e financeiras */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          alignItems: "stretch",
        }}
      >
        {/* Container esquerdo (50%) com QualityMetrics e Improvements */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            alignItems: "stretch",
          }}
        >
          {/* QualityMetrics (50% do container esquerdo) */}
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid rgba(15, 23, 42, 0.08)",
                height: "100%",
              }}
            >
              <Stack spacing={3}>
                {/* QA Score */}
                <Box>
                  <Skeleton variant="text" width={200} height={20} sx={{ mb: 2 }} />
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Skeleton variant="circular" width={80} height={80} />
                    <Box>
                      <Skeleton variant="text" width={40} height={28} />
                      <Skeleton variant="text" width={120} height={16} />
                    </Box>
                  </Stack>
                </Box>

                {/* EC Score */}
                <Box>
                  <Skeleton variant="text" width={200} height={20} sx={{ mb: 2 }} />
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Skeleton variant="circular" width={80} height={80} />
                    <Box>
                      <Skeleton variant="text" width={40} height={28} />
                      <Skeleton variant="text" width={120} height={16} />
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Box>

          {/* Improvements (50% do container esquerdo) */}
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
            }}
          >
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
              <Stack spacing={3}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Skeleton variant="text" width={150} height={28} />
                  <Skeleton variant="text" width={180} height={16} />
                </Box>

                {/* Card de Oportunidades */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "#fff",
                    border: "1px solid rgba(251, 191, 36, 0.3)",
                  }}
                >
                  <Stack spacing={1.5}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Skeleton variant="circular" width={24} height={24} />
                      <Skeleton variant="text" width={120} height={20} />
                    </Box>
                    <Skeleton variant="text" width="90%" height={16} />
                    <Stack spacing={1.5}>
                      {[1, 2].map((index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#fff",
                            border: "1px solid rgba(251, 191, 36, 0.3)",
                          }}
                        >
                          <Skeleton variant="text" width="70%" height={20} />
                          <Skeleton variant="text" width="90%" height={16} />
                        </Box>
                      ))}
                    </Stack>
                  </Stack>
                </Box>

                {/* Card de Avisos */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "#fff",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                  }}
                >
                  <Stack spacing={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Skeleton variant="circular" width={24} height={24} />
                      <Skeleton variant="text" width={100} height={20} />
                    </Box>
                    <Skeleton variant="text" width="85%" height={16} />
                    <Stack spacing={1.5}>
                      {[1].map((index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#fff",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                          }}
                        >
                          <Skeleton variant="text" width="60%" height={20} />
                          <Skeleton variant="text" width="80%" height={16} />
                        </Box>
                      ))}
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Box>

        {/* FinancialMetrics (50%) */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid rgba(15, 23, 42, 0.08)",
            }}
          >
            <Stack spacing={3}>
              {/* Título */}
              <Skeleton variant="text" width={300} height={28} />

              {/* Lucro total e médio */}
              <Stack direction="row" spacing={4} flexWrap="wrap" gap={3}>
                <Box>
                  <Skeleton variant="text" width={180} height={14} />
                  <Skeleton variant="text" width={150} height={36} />
                </Box>
                <Box>
                  <Skeleton variant="text" width={180} height={14} />
                  <Skeleton variant="text" width={150} height={36} />
                </Box>
              </Stack>

              {/* Breakdown de custos */}
              <Stack spacing={2}>
                <Skeleton variant="text" width={150} height={20} />
                <Stack spacing={1.5}>
                  {[1, 2, 3, 4].map((index) => (
                    <Box key={index} display="flex" alignItems="center" justifyContent="space-between">
                      <Skeleton variant="text" width={100} height={16} />
                      <Skeleton variant="text" width={120} height={16} />
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Box>

      {/* Gráfico de visitas */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid rgba(15, 23, 42, 0.08)",
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="text" width={200} height={28} />
          <Skeleton variant="text" width={150} height={16} />
        </Box>
        <Skeleton variant="rectangular" width="100%" height={250} sx={{ borderRadius: 2 }} />
      </Paper>

      {/* Gráfico de vendas */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid rgba(15, 23, 42, 0.08)",
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="text" width={200} height={28} />
          <Skeleton variant="text" width={180} height={16} />
        </Box>
        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
          <Skeleton variant="rectangular" width={200} height={40} sx={{ borderRadius: 1 }} />
        </Box>
        <Skeleton variant="rectangular" width="100%" height={320} sx={{ borderRadius: 2 }} />
      </Paper>
    </Stack>
  );
}


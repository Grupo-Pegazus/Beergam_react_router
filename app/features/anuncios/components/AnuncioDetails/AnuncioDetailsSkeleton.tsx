import { Skeleton, Stack, Grid, Paper, Box } from "@mui/material";

/**
 * Skeleton para a página de detalhes do anúncio
 * Seguindo o padrão do projeto e a estrutura do AnuncioDetails
 */
export default function AnuncioDetailsSkeleton() {
  return (
    <Stack spacing={3}>
      {/* Grid principal com informações do produto e galeria */}
      <Grid container spacing={3}>
        {/* Coluna esquerda - Galeria de imagens */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid rgba(15, 23, 42, 0.08)",
            }}
          >
            <Stack spacing={2}>
              {/* Imagem principal */}
              <Skeleton
                variant="rectangular"
                width="100%"
                height={400}
                sx={{ borderRadius: 2 }}
              />
              {/* Thumbnails */}
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" gap={1}>
                {[1, 2, 3].map((index) => (
                  <Skeleton
                    key={index}
                    variant="rectangular"
                    width={80}
                    height={80}
                    sx={{ borderRadius: 1 }}
                  />
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        {/* Coluna direita - Informações do produto */}
        <Grid item xs={12} md={7}>
          <Stack spacing={2}>
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
                  <Box>
                    <Skeleton variant="text" width={50} height={14} />
                    <Skeleton variant="text" width={100} height={20} />
                  </Box>
                </Stack>

                {/* Tipo de anúncio e idade */}
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" gap={1}>
                  <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: 1 }} />
                  <Skeleton variant="text" width={150} height={16} />
                  <Skeleton variant="text" width={120} height={14} />
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
              </Stack>
            </Paper>

            {/* AnuncioFeatures Skeleton */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid rgba(15, 23, 42, 0.08)",
              }}
            >
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {[1, 2, 3, 4].map((index) => (
                  <Skeleton
                    key={index}
                    variant="rectangular"
                    width={100}
                    height={24}
                    sx={{ borderRadius: 1 }}
                  />
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      {/* Grid secundário com métricas */}
      <Grid container spacing={3}>
        {/* Coluna esquerda - Métricas de qualidade */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid rgba(15, 23, 42, 0.08)",
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
        </Grid>

        {/* Coluna direita - Métricas financeiras */}
        <Grid item xs={12} md={8}>
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
        </Grid>
      </Grid>

      {/* Seção de melhorias */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid rgba(15, 23, 42, 0.08)",
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
                  bgcolor: "#fef3c7",
                  border: "1px solid #fbbf24",
                }}
              >
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width={120} height={20} />
                  </Box>
                  <Skeleton variant="text" width="90%" height={16} />
                  <Stack spacing={1}>
                    {[1, 2].map((index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          bgcolor: "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        <Skeleton variant="text" width="70%" height={16} />
                        <Skeleton variant="text" width="90%" height={14} />
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
                  bgcolor: "#fee2e2",
                  border: "1px solid #f87171",
                }}
              >
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width={100} height={20} />
                  </Box>
                  <Skeleton variant="text" width="85%" height={16} />
                  <Stack spacing={1}>
                    {[1].map((index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          bgcolor: "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        <Skeleton variant="text" width="60%" height={16} />
                        <Skeleton variant="text" width="80%" height={14} />
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}


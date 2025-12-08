import { Skeleton, Stack, Paper, Box } from "@mui/material";

/**
 * Skeleton para a página de detalhes do produto
 * Seguindo o padrão do projeto e a estrutura do ProductDetails
 */
export default function ProductDetailsSkeleton() {
  return (
    <Stack spacing={3}>
      {/* Primeira linha: Galeria de imagens e informações principais */}
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
              {/* Tabs skeleton */}
              <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 1 }} />
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
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid rgba(15, 23, 42, 0.08)",
                height: "100%",
              }}
            >
              <Stack spacing={2}>
                <Skeleton variant="text" width="80%" height={40} />
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1 }} />
                <Stack direction="row" spacing={2}>
                  <Skeleton variant="text" width="30%" height={32} />
                  <Skeleton variant="text" width="30%" height={32} />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Skeleton variant="text" width="25%" height={40} />
                  <Skeleton variant="text" width="25%" height={40} />
                </Stack>
                <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Box>

      {/* Segunda linha: Prévia de estoque */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid rgba(15, 23, 42, 0.08)",
        }}
      >
        <Stack spacing={2}>
          <Skeleton variant="text" width="40%" height={32} />
          <Stack direction="row" spacing={3} flexWrap="wrap" gap={2}>
            <Skeleton variant="text" width="20%" height={48} />
            <Skeleton variant="text" width="20%" height={48} />
            <Skeleton variant="text" width="20%" height={48} />
            <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 1 }} />
          </Stack>
        </Stack>
      </Paper>

      {/* Terceira linha: Variações */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid rgba(15, 23, 42, 0.08)",
        }}
      >
        <Stack spacing={2}>
          <Skeleton variant="text" width="30%" height={32} />
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 1 }} />
        </Stack>
      </Paper>

      {/* Quarta linha: Informações adicionais */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid rgba(15, 23, 42, 0.08)",
        }}
      >
        <Stack spacing={2}>
          <Skeleton variant="text" width="40%" height={32} />
          <Stack direction="row" spacing={3} flexWrap="wrap">
            <Skeleton variant="rectangular" width="100%" height={150} sx={{ borderRadius: 1, maxWidth: { xs: "100%", md: "48%" } }} />
            <Skeleton variant="rectangular" width="100%" height={150} sx={{ borderRadius: 1, maxWidth: { xs: "100%", md: "48%" } }} />
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}


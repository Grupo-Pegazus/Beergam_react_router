import { useState, useMemo } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useUpdateSku } from "../../../hooks";
import type { AnuncioDetails, UpdateSkuRequest } from "../../../typings";
import toast from "~/src/utils/toast";

interface UpdateSkuSectionProps {
  anuncio: AnuncioDetails;
}

export default function UpdateSkuSection({ anuncio }: UpdateSkuSectionProps) {
  const [skuValue, setSkuValue] = useState(anuncio.sku || "");
  const updateSkuMutation = useUpdateSku();

  // Verifica se há SKU principal ou se todas as variações têm SKU
  const hasNoMainSku = !anuncio.sku || anuncio.sku.trim() === "";
  const hasVariations = anuncio.variations && anuncio.variations.length > 0;
  const variationsWithoutSku = useMemo(() => {
    if (!hasVariations) return [];
    return anuncio.variations!.filter((v) => !v.sku || v.sku.trim() === "");
  }, [hasVariations, anuncio.variations]);

  const shouldShowUpdateSku = hasNoMainSku && (!hasVariations || variationsWithoutSku.length > 0);

  const handleSaveSku = async () => {
    if (!skuValue.trim()) {
      toast.error("Por favor, informe um SKU");
      return;
    }

    // Para anúncios sem variações, atualiza o SKU principal
    if (!hasVariations) {
      const request: UpdateSkuRequest = {
        ad_id: anuncio.mlb,
        variations: [
          {
            id: 0, // ID especial para anúncio sem variações
            attributes: [
              {
                id: "SELLER_SKU",
                value_name: skuValue.trim(),
              },
            ],
          },
        ],
      };

    await updateSkuMutation.mutateAsync(request);
    toast.success("SKU atualizado com sucesso");
    setSkuValue(""); // Limpa o campo após salvar
    } else {
      toast.error("Este anúncio possui variações. Use a seção de variações para atualizar os SKUs.");
    }
  };

  if (!shouldShowUpdateSku) {
    return null;
  }

  return (
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
        <Alert severity="warning" sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
            {hasVariations ? "Variações sem SKU cadastrado" : "SKU não cadastrado"}
          </Typography>
          <Typography variant="body2">
            {hasVariations
              ? `Este anúncio possui ${variationsWithoutSku.length} de ${anuncio.variations!.length} variação(ões) sem SKU cadastrado. Cadastre os SKUs individualmente para cada variação na seção abaixo.`
              : "Este anúncio não possui SKU cadastrado. Cadastre um SKU para facilitar o gerenciamento do estoque."}
          </Typography>
        </Alert>

        {!hasVariations && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Cadastrar SKU
            </Typography>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <TextField
                label="SKU"
                value={skuValue}
                onChange={(e) => setSkuValue(e.target.value)}
                placeholder="Ex: PROD-001"
                fullWidth
                size="small"
                disabled={updateSkuMutation.isPending}
                helperText="Código único para identificar este produto no seu estoque"
              />
              <Button
                variant="contained"
                onClick={handleSaveSku}
                disabled={updateSkuMutation.isPending || !skuValue.trim()}
                startIcon={updateSkuMutation.isPending ? <CircularProgress size={16} /> : null}
                sx={{
                  bgcolor: "var(--color-beergam-orange)",
                  "&:hover": {
                    bgcolor: "var(--color-beergam-orange-dark)",
                  },
                  minWidth: 120,
                  mt: 0.5,
                }}
              >
                {updateSkuMutation.isPending ? "Salvando..." : "Salvar SKU"}
              </Button>
            </Stack>
          </Box>
        )}

        {hasVariations && (
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Importante:</strong> Cada variação precisa de seu próprio SKU. 
              Role até a seção &quot;Variações do Produto&quot; abaixo para cadastrar os SKUs individualmente para cada variação.
            </Typography>
          </Alert>
        )}
      </Stack>
    </Paper>
  );
}


import { useState, useMemo } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import { useUpdateSku } from "../../../hooks";
import type { AnuncioDetails, Variation, UpdateSkuRequest } from "../../../typings";
import { groupVariationsByCommonAttributes } from "../../AnuncioList/Variations/utils";
import toast from "react-hot-toast";
import Svg from "~/src/assets/svgs/_index";

interface VariationsSelectorProps {
  anuncio: AnuncioDetails;
}

export default function VariationsSelector({ anuncio }: VariationsSelectorProps) {
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);
  const [skuValues, setSkuValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    anuncio.variations?.forEach((v) => {
      if (v.sku) {
        initial[v.variation_id] = v.sku;
      }
    });
    return initial;
  });
  const [savingVariationId, setSavingVariationId] = useState<string | null>(null);
  const updateSkuMutation = useUpdateSku();

  const variations = anuncio.variations || [];

  // Agrupa variações usando a função utilitária existente
  const groupedVariations = useMemo(() => {
    return groupVariationsByCommonAttributes(variations);
  }, [variations]);

  // Extrai os atributos variantes para exibição
  const varyingAttributes = useMemo(() => {
    if (groupedVariations.length === 0) return [];
    return groupedVariations[0].varyingAttributeIds.map((attrId) => {
      const attr = variations[0]?.attributes.find((a) => a.id === attrId);
      return {
        id: attrId,
        name: attr?.name || attrId,
      };
    });
  }, [groupedVariations, variations]);

  const handleSelectVariation = (variation: Variation) => {
    setSelectedVariation(variation);
  };

  const handleSkuChange = (variationId: string, value: string) => {
    setSkuValues((prev) => ({
      ...prev,
      [variationId]: value,
    }));
  };

  const handleSaveSku = async (variation: Variation) => {
    const skuValue = skuValues[variation.variation_id]?.trim();
    if (!skuValue) {
      toast.error("Por favor, informe um SKU");
      return;
    }

    setSavingVariationId(variation.variation_id);

    try {
      const request: UpdateSkuRequest = {
        ad_id: anuncio.mlb,
        variations: [
          {
            id: Number(variation.variation_id),
            attributes: [
              {
                id: "SELLER_SKU",
                value_name: skuValue,
              },
            ],
          },
        ],
      };

      await updateSkuMutation.mutateAsync(request);
      // Limpa o campo após sucesso
      setSkuValues((prev) => {
        const next = { ...prev };
        delete next[variation.variation_id];
        return next;
      });
    } catch {
      // Erro já é tratado pelo hook
    } finally {
      // Sempre reseta o loading, mesmo em caso de erro
      setSavingVariationId(null);
    }
  };

  if (variations.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid rgba(15, 23, 42, 0.08)",
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Variações do Produto
        </Typography>

        {/* Seletores de atributos variantes */}
        {varyingAttributes.map((varyingAttr) => {
          // Pega TODOS os valores únicos deste atributo de TODAS as variações
          // Usa um Set para garantir que não há duplicatas
          const uniqueValueIds = new Set<string>();
          const uniqueValuesMap = new Map<string, { valueName: string; valueId: string }>();
          
          // Itera sobre TODAS as variações para pegar TODOS os valores únicos
          variations.forEach((variation) => {
            const attr = variation.attributes.find((a) => a.id === varyingAttr.id);
            if (attr && attr.value_id && attr.value_name) {
              // Se ainda não vimos este value_id, adiciona
              if (!uniqueValueIds.has(attr.value_id)) {
                uniqueValueIds.add(attr.value_id);
                uniqueValuesMap.set(attr.value_id, {
                  valueName: attr.value_name,
                  valueId: attr.value_id,
                });
              }
            }
          });
          
          const uniqueValues = uniqueValuesMap;

          // Converte para array e ordena por nome para melhor UX
          const values = Array.from(uniqueValues.values()).sort((a, b) => {
            // Tenta ordenar numericamente se ambos forem números
            const numA = Number(a.valueName);
            const numB = Number(b.valueName);
            if (!isNaN(numA) && !isNaN(numB)) {
              return numA - numB;
            }
            // Caso contrário, ordena alfabeticamente
            return a.valueName.localeCompare(b.valueName);
          });

          return (
            <Box key={varyingAttr.id}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                {varyingAttr.name}:{" "}
                {selectedVariation?.attributes.find((a) => a.id === varyingAttr.id)?.value_name || "Escolha"}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {values.map((value) => {
                  // Encontra uma variação que tenha este valor para este atributo
                  const matchingVariation = variations.find((variation) => {
                    const attr = variation.attributes.find((a) => a.id === varyingAttr.id);
                    return attr?.value_id === value.valueId;
                  });

                  // Verifica se este valor está selecionado
                  const isSelected = selectedVariation
                    ? selectedVariation.attributes.find((a) => a.id === varyingAttr.id)?.value_id === value.valueId
                    : false;

                  return (
                    <Button
                      key={value.valueId}
                      variant={isSelected ? "contained" : "outlined"}
                      onClick={() => {
                        if (matchingVariation) {
                          handleSelectVariation(matchingVariation);
                        }
                      }}
                      disabled={!matchingVariation}
                      sx={{
                        minWidth: "auto",
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        borderColor: isSelected ? "var(--color-beergam-orange)" : "rgba(0, 0, 0, 0.23)",
                        bgcolor: isSelected ? "var(--color-beergam-orange)" : "transparent",
                        color: isSelected ? "#fff" : "inherit",
                        "&:hover": {
                          bgcolor: isSelected ? "var(--color-beergam-orange-dark)" : "rgba(0, 0, 0, 0.04)",
                          borderColor: isSelected ? "var(--color-beergam-orange-dark)" : "rgba(0, 0, 0, 0.23)",
                        },
                        "&:disabled": {
                          opacity: 0.5,
                        },
                      }}
                    >
                      {value.valueName}
                    </Button>
                  );
                })}
              </Stack>
            </Box>
          );
        })}

        {/* Informações da variação selecionada */}
        {selectedVariation && (
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: "rgba(255, 138, 0, 0.05)",
              border: "1px solid rgba(255, 138, 0, 0.2)",
            }}
          >
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Variação Selecionada
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Preço
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    R$ {parseFloat(selectedVariation.price).toFixed(2).replace(".", ",")}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Estoque
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {selectedVariation.stock} unidades
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Vendas
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {selectedVariation.sold_quantity}
                  </Typography>
                </Box>
                {selectedVariation.sku && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      SKU
                    </Typography>
                    <Chip
                      label={selectedVariation.sku}
                      size="small"
                      sx={{
                        fontFamily: "monospace",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                )}
              </Stack>
            </Stack>
          </Box>
        )}

        {/* Lista completa de variações */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
            Todas as Variações ({variations.length})
          </Typography>
          <Stack spacing={1}>
            {variations.map((variation) => {
              const isSelected = selectedVariation?.variation_id === variation.variation_id;
              const varyingAttrs = variation.attributes.filter((attr) =>
                varyingAttributes.some((va) => va.id === attr.id)
              );

              return (
                <Box
                  key={variation.variation_id}
                  onClick={() => handleSelectVariation(variation)}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    border: isSelected ? 2 : 1,
                    borderColor: isSelected ? "var(--color-beergam-orange)" : "rgba(0, 0, 0, 0.1)",
                    bgcolor: isSelected ? "rgba(255, 138, 0, 0.05)" : "transparent",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: isSelected ? "rgba(255, 138, 0, 0.1)" : "rgba(0, 0, 0, 0.02)",
                    },
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                    <Box>
                      {varyingAttrs.length > 0 ? (
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5}>
                          {varyingAttrs.map((attr, idx) => (
                            <Typography key={attr.id} variant="body2">
                              <strong>{attr.name}:</strong> {attr.value_name}
                              {idx < varyingAttrs.length - 1 && <span className="mx-1">|</span>}
                            </Typography>
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Variação ID: {variation.variation_id}
                        </Typography>
                      )}
                    </Box>
                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" gap={1}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        R$ {parseFloat(variation.price).toFixed(2).replace(".", ",")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Estoque: {variation.stock}
                      </Typography>
                      {variation.sku ? (
                        <Chip
                          label={`SKU: ${variation.sku}`}
                          size="small"
                          sx={{
                            fontFamily: "monospace",
                            fontSize: "0.7rem",
                          }}
                        />
                      ) : (
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                          <TextField
                            label="SKU"
                            value={skuValues[variation.variation_id] || ""}
                            onChange={(e) => handleSkuChange(variation.variation_id, e.target.value)}
                            placeholder="Digite o SKU"
                            size="small"
                            sx={{ minWidth: 150 }}
                            disabled={savingVariationId === variation.variation_id}
                          />
                            <span>
                              <button
                                onClick={() => handleSaveSku(variation)}
                                disabled={savingVariationId === variation.variation_id || !skuValues[variation.variation_id]?.trim()}
                                className="bg-beergam-orange text-white hover:bg-beergam-orange-dark disabled:bg-gray-100 p-2 rounded-md flex items-center justify-center gap-2"
                              >
                                {savingVariationId === variation.variation_id ? (
                                  <Svg.arrow_path tailWindClasses="size-4 stroke-beergam-blue-primary animate-spin" />
                                ) : (
                                  <Svg.check tailWindClasses="size-4 stroke-beergam-white" />
                                )}
                              </button>
                            </span>
                        </Box>
                      )}
                    </Stack>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}


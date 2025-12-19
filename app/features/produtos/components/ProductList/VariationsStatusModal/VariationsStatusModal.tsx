import { useState, useEffect } from "react";
import { Typography, Stack, Divider } from "@mui/material";
import { ProductStatusToggle } from "../../ProductStatusToggle";
import { useChangeVariationStatus } from "../../../hooks";
import type { Product, ProductDetails } from "../../../typings";
import ProductImage from "../../ProductImage/ProductImage";

interface VariationsStatusModalProps {
  product: Product | ProductDetails;
  onClose: () => void;
  productId?: string; // Para ProductDetails, pode precisar do product_id separado
}

/**
 * Modal para gerenciar o status de todas as variações de um produto
 * Permite alterar o status de cada variação individualmente
 */
export default function VariationsStatusModal({
  product,
  productId,
}: VariationsStatusModalProps) {
  const [localVariations, setLocalVariations] = useState(product.variations || []);
  const changeStatusMutation = useChangeVariationStatus();
  const productIdToUse = productId || product.product_id;

  // Estado para controlar quais variações estão em processo de mutação
  const [mutatingVariations, setMutatingVariations] = useState<Set<string>>(
    new Set()
  );

  // Atualiza as variações locais quando o produto prop mudar (após invalidação de queries)
  useEffect(() => {
    if (product.variations) {
      setLocalVariations(product.variations);
    }
  }, [product.variations]);

  const handleToggleStatus = (
    variationId: string,
    currentStatus: string
  ) => {
    const normalizedStatus = currentStatus.toLowerCase().trim();
    const nextStatus = normalizedStatus === "ativo" ? "Inativo" : "Ativo";

    setMutatingVariations((prev) => new Set(prev).add(variationId));

    // Atualiza o estado local imediatamente para feedback visual
    setLocalVariations((prev) =>
      prev.map((variation) =>
        variation.product_variation_id === variationId
          ? { ...variation, status: nextStatus }
          : variation
      )
    );

    changeStatusMutation.mutate(
      {
        productId: productIdToUse,
        variationId,
        status: nextStatus as "Ativo" | "Inativo",
      },
      {
        onSuccess: () => {
          // Remove do conjunto de mutações
          setMutatingVariations((prev) => {
            const next = new Set(prev);
            next.delete(variationId);
            return next;
          });
        },
        onError: () => {
          // Reverte a mudança local em caso de erro
          setLocalVariations((prev) =>
            prev.map((variation) =>
              variation.product_variation_id === variationId
                ? { ...variation, status: currentStatus }
                : variation
            )
          );
          setMutatingVariations((prev) => {
            const next = new Set(prev);
            next.delete(variationId);
            return next;
          });
        },
        onSettled: () => {
          // Garante que o estado de mutação seja limpo
          setMutatingVariations((prev) => {
            const next = new Set(prev);
            next.delete(variationId);
            return next;
          });
        },
      }
    );
  };

  const variations = localVariations;

  if (variations.length === 0) {
    return (
      <div className="p-4">
        <Typography variant="body2" color="text.secondary">
          Este produto não possui variações.
        </Typography>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4">
      <div className="mb-4">
        <Typography variant="h6" className="text-slate-900 mb-1">
          Gerenciar Status das Variações
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Produto: <strong>{product.title}</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary" className="block mt-1">
          Total de variações: {variations.length}
        </Typography>
      </div>

      <Divider className="mb-4" />

      <Stack spacing={2}>
        {variations.map((variation) => {
          const variationImageUrl = variation.images?.product?.[0];
          const isActive = variation.status.toLowerCase().trim() === "ativo";
          const isMutating = mutatingVariations.has(
            variation.product_variation_id
          );

          return (
            <div
              key={variation.product_variation_id}
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              {/* Imagem da variação */}
              {variationImageUrl && (
                <div className="shrink-0">
                  <ProductImage
                    imageUrl={variationImageUrl}
                    alt={variation.title}
                    size="small"
                  />
                </div>
              )}

              {/* Informações da variação */}
              <div className="flex-1 min-w-0">
                <Typography
                  variant="body2"
                  fontWeight={600}
                  className="text-slate-900 mb-1"
                >
                  {variation.title}
                </Typography>
                {variation.sku && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    className="font-mono text-xs"
                  >
                    SKU: {variation.sku}
                  </Typography>
                )}
                {variation.attributes && variation.attributes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {variation.attributes.map((attr, attrIndex) => (
                      <Typography
                        key={attrIndex}
                        variant="caption"
                        className="text-xs text-slate-600"
                      >
                        {attr.name}: {attr.value.join(", ")}
                      </Typography>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggle de status */}
              <div className="shrink-0">
                <ProductStatusToggle
                  status={variation.status}
                  isActive={isActive}
                  isMutating={isMutating}
                  onToggle={() =>
                    handleToggleStatus(
                      variation.product_variation_id,
                      variation.status
                    )
                  }
                />
              </div>
            </div>
          );
        })}
      </Stack>
    </div>
  );
}

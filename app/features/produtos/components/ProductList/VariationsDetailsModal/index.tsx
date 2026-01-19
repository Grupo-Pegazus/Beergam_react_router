import { Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { BeergamSlider } from "~/src/components/ui/BeergamSlider";
import { useChangeVariationStatus } from "../../../hooks";
import type { Product, ProductDetails } from "../../../typings";
import VariationCardNew from "../Variations/VariationCardNew";

interface VariationsDetailsModalProps {
  product: Product | ProductDetails;
  onClose: () => void;
  productId?: string;
}

/**
 * Modal para exibir detalhes completos de todas as variações de um produto
 * Usa os mesmos componentes de célula do ProductCard para manter consistência visual
 */
export default function VariationsDetailsModal({
  product,
  productId,
}: VariationsDetailsModalProps) {
  const [localVariations, setLocalVariations] = useState(
    product.variations || []
  );
  const changeStatusMutation = useChangeVariationStatus();
  const productIdToUse = productId || product.product_id;

  // Estado para controlar quais variações estão em processo de mutação
  const [mutatingVariations, setMutatingVariations] = useState<Set<string>>(
    new Set()
  );

  // Atualiza as variações locais quando o produto prop mudar
  useEffect(() => {
    if (product.variations) {
      setLocalVariations(product.variations);
    }
  }, [product.variations]);

  const handleToggleStatus = (variationId: string, currentStatus: string) => {
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
    <Paper className="bg-beergam-section-background!">
      <div className="mb-4">
        <p>
          Produto:{" "}
          <span className="text-beergam-typography-primary!">
            {product.title}
          </span>
        </p>
        <p>
          Total de variações:{" "}
          <span className="text-beergam-typography-primary!">
            {variations.length}
          </span>
        </p>
      </div>

      <BeergamSlider
        slidesPerView={1}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
        }}
        slides={variations.map((variation) => {
          const isMutating = mutatingVariations.has(
            variation.product_variation_id
          );
          return (
            <VariationCardNew
              key={variation.product_variation_id}
              variation={variation}
              isMutating={isMutating}
              onToggleStatus={() =>
                handleToggleStatus(
                  variation.product_variation_id,
                  variation.status
                )
              }
            />
          );
        })}
      />
    </Paper>
  );
}

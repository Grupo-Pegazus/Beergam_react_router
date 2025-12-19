import { useMemo, useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { useChangeProductStatus } from "../../../hooks";
import type { ProductDetails } from "../../../typings";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useQueryClient } from "@tanstack/react-query";
import { ProductStatusToggle } from "../../ProductStatusToggle";
import VariationsStatusModal from "../../ProductList/VariationsStatusModal/VariationsStatusModal";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { useModal } from "~/src/components/utils/Modal/useModal";

interface ProductInfoProps {
  product: ProductDetails;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const queryClient = useQueryClient();
  const [isMutating, setIsMutating] = useState(false);
  const changeStatusMutation = useChangeProductStatus();
  const { openModal, closeModal } = useModal();
  
  const hasVariations = product.variations && product.variations.length > 0;
  const variationsCount = product.variations?.length || 0;

  const formattedCreatedAt = useMemo(() => {
    return dayjs(product.created_at).locale("pt-br").format("DD [de] MMM [de] YYYY [às] HH:mm");
  }, [product.created_at]);

  const formattedUpdatedAt = useMemo(() => {
    return dayjs(product.updated_at).locale("pt-br").format("DD [de] MMM [de] YYYY [às] HH:mm");
  }, [product.updated_at]);

  const isActive = product.status.toLowerCase().trim() === "ativo";

  const handleToggleStatus = () => {
    const nextStatus = isActive ? "Inativo" : "Ativo";
    setIsMutating(true);
    changeStatusMutation.mutate(
      { productId: product.product_id, status: nextStatus as "Ativo" | "Inativo" },
      {
        onSettled: () => {
          setIsMutating(false);
          queryClient.invalidateQueries({ queryKey: ["products", "details", product.product_id] });
        },
      }
    );
  };

  const handleOpenVariationsStatusModal = () => {
    openModal(
      <VariationsStatusModal product={product} onClose={closeModal} />,
      {
        title: "Gerenciar Status das Variações",
        className: "z-[1000]",
      }
    );
  };

  const registrationTypeLabel = product.product_registration_type === "Completo" ? "Completo" : "Simplificado";

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid rgba(15, 23, 42, 0.08)",
      }}
    >
      <Stack spacing={2}>
        {/* Título do produto */}
        <Typography variant="h4" sx={{ fontWeight: 700, fontSize: "1.5rem" }}>
          {product.title}
        </Typography>

        {/* ID e SKU */}
        <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              ID:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {product.product_id}
            </Typography>
          </Box>
          {product.sku && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                SKU:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {product.sku}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Tipo de registro e status */}
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" gap={1}>
          <Chip
            label={registrationTypeLabel}
            size="small"
            sx={{
              bgcolor: "var(--color-beergam-orange-light)",
              color: "var(--color-beergam-orange-dark)",
              fontWeight: 600,
            }}
            icon={
              <Box
                component="span"
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "var(--color-beergam-orange)",
                }}
              />
            }
          />
          <Typography variant="caption" color="text.secondary">
            Criado em {formattedCreatedAt}
          </Typography>
          {formattedUpdatedAt !== formattedCreatedAt && (
            <Typography variant="caption" color="text.secondary">
              Atualizado em {formattedUpdatedAt}
            </Typography>
          )}
        </Stack>

        {/* Descrição */}
        {product.description && (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
              Descrição:
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {product.description}
            </Typography>
          </Box>
        )}

        {/* Categorias */}
        {product.categories && product.categories.length > 0 && (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
              Categorias:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {product.categories.map((category, index) => (
                <Chip
                  key={index}
                  label={category.name}
                  size="small"
                  sx={{
                    bgcolor: "grey.100",
                    color: "text.primary",
                    fontWeight: 500,
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {hasVariations && (
          <Chip
            label={`Verifique informações de preço e estoque nas variações abaixo`}
            size="small"
            onClick={handleOpenVariationsStatusModal}
            sx={{
              height: 32,
              fontSize: "0.75rem",
              fontWeight: 600,
              width: "100%",
              backgroundColor: "#dbeafe",
              color: "#1e40af",
            }}
          />
        )}

        {/* Preços */}
        {!hasVariations && (
          <Stack direction="row" spacing={3} flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Preço de Custo
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {formatCurrency(product.price_cost)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Preço de Venda
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "var(--color-beergam-orange)" }}>
                {formatCurrency(product.price_sale)}
              </Typography>
            </Box>
          </Stack>
        )}

        {/* Estoque */}
        {!hasVariations && (
          <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Estoque Disponível
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {product.available_quantity.toLocaleString("pt-BR")}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Estoque Inicial
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {product.initial_quantity.toLocaleString("pt-BR")}
              </Typography>
            </Box>
          </Stack>
        )}

        {/* Status Toggle e Botão de Editar */}
        <Stack direction="row" spacing={3} alignItems="flex-end" flexWrap="wrap" gap={2}>
          <Box className="flex flex-col items-baseline gap-2">
            <Typography variant="caption" color="text.secondary">Status:</Typography>
            {!hasVariations ? (
              <ProductStatusToggle
                status={product.status}
                isActive={isActive}
                isMutating={isMutating}
                onToggle={handleToggleStatus}
              />
            ) : (
              <Chip
                label={`Veja as variações`}
                size="small"
                onClick={handleOpenVariationsStatusModal}
                sx={{
                  height: 32,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  backgroundColor: "#dbeafe",
                  color: "#1e40af",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#bfdbfe",
                  },
                  "& .MuiChip-label": {
                    px: 1.5,
                  },
                }}
                title={`Clique para gerenciar status de ${variationsCount} variação${variationsCount > 1 ? "ões" : ""}`}
                aria-label={`Abrir modal para gerenciar status das variações`}
              />
            )}
          </Box>
          <BeergamButton
            title="Editar Produto"
            mainColor="beergam-blue-primary"
            animationStyle="slider"
            link={`/interno/produtos/editar/${product.product_id}`}
            icon="pencil"
          />
        </Stack>
      </Stack>
    </Paper>
  );
}


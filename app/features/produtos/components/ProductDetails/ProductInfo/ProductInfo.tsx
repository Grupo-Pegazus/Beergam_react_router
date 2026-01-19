import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useMemo } from "react";
import { getStockStatus } from "~/features/produtos/utils/getStockStatus";
import { BeergamSlider } from "~/src/components/ui/BeergamSlider";
import BeergamButton from "~/src/components/utils/BeergamButton";
import {
  CensorshipWrapper,
  TextCensored,
} from "~/src/components/utils/Censorship";
import { useModal } from "~/src/components/utils/Modal/useModal";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import { useChangeStatus } from "../../../hooks";
import type { ProductDetails } from "../../../typings";
import VariationCardNew from "../../ProductList/Variations/VariationCardNew";
import VariationsStatusModal from "../../ProductList/VariationsStatusModal/VariationsStatusModal";
import { ProductStatusToggle } from "../../ProductStatusToggle";

interface ProductInfoProps {
  product: ProductDetails;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const queryClient = useQueryClient();
  const changeStatusMutation = useChangeStatus();
  const { openModal, closeModal } = useModal();

  const hasVariations = product.variations && product.variations.length > 0;
  const variationsCount = product.variations?.length || 0;

  const formattedCreatedAt = useMemo(() => {
    return dayjs(product.created_at)
      .locale("pt-br")
      .format("DD [de] MMM [de] YYYY [às] HH:mm");
  }, [product.created_at]);

  const formattedUpdatedAt = useMemo(() => {
    return dayjs(product.updated_at)
      .locale("pt-br")
      .format("DD [de] MMM [de] YYYY [às] HH:mm");
  }, [product.updated_at]);

  const isActive = product.status.toLowerCase().trim() === "ativo";

  const handleToggleStatus = (variationId?: string, currentStatus?: string) => {
    const nextStatus =
      variationId && currentStatus
        ? currentStatus.toLowerCase().trim() === "ativo"
          ? "Inativo"
          : "Ativo"
        : isActive
          ? "Inativo"
          : "Ativo";

    changeStatusMutation.mutate(
      {
        productId: product.product_id,
        variationId,
        status: nextStatus as "Ativo" | "Inativo",
      },
      {
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: ["products", "details", product.product_id],
          });
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

  const registrationTypeLabel =
    product.product_registration_type === "Completo"
      ? "Completo"
      : "Simplificado";

  return (
    <CensorshipWrapper controlChildren censorshipKey="produtos_list_details">
      <div className="flex flex-col gap-4">
        <div className="flex items-baseline gap-2">
          {/* ID e SKU */}
          <div className="flex items-center gap-2">
            <div className="flex items-baseline gap-2">
              <Typography
                variant="caption"
                className="text-beergam-typography-tertiary!"
              >
                ID:
              </Typography>
              <Typography variant="body2" className="font-medium">
                {product.product_id}
              </Typography>
            </div>
            {product.sku && (
              <div className="flex items-baseline gap-2">
                <Typography
                  variant="caption"
                  className="text-beergam-typography-tertiary!"
                >
                  SKU:
                </Typography>
                <TextCensored
                  className="flex!"
                  maxCharacters={3}
                  censorshipKey="produtos_list_details"
                >
                  <Typography variant="body2" className="font-medium">
                    {product.sku}
                  </Typography>
                </TextCensored>
              </div>
            )}
            <Chip
              label={registrationTypeLabel}
              size="small"
              sx={{
                bgcolor: "var(--color-beergam-orange-light)",
                color: "var(--color-beergam-orange-dark)",
                fontWeight: 600,
                maxWidth: "fit-content",
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
          </div>
        </div>
        {/* Tipo de registro e status */}
        <div className="flex items-center gap-2">
          <div className="flex items-baseline gap-2">
            <Typography
              variant="caption"
              className="text-beergam-typography-tertiary!"
            >
              Criado em:
            </Typography>
            <Typography variant="body2" className="font-medium">
              {formattedCreatedAt}
            </Typography>
          </div>
          {formattedUpdatedAt !== formattedCreatedAt && (
            <div className="flex items-baseline gap-2">
              <Typography
                variant="caption"
                className="text-beergam-typography-tertiary!"
              >
                Atualizado em:
              </Typography>
              <Typography variant="body2" className="font-medium">
                {formattedUpdatedAt}
              </Typography>
            </div>
          )}
        </div>
        {/* Descrição */}
        {product.description && (
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 0.5 }}
            >
              Descrição:
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {product.description}
            </Typography>
          </Box>
        )}

        {/* Categorias */}
        {product.categories && product.categories.length > 0 && (
          <div className="flex items-baseline gap-2">
            <Typography
              variant="caption"
              className="text-beergam-typography-tertiary!"
            >
              Categoria:
            </Typography>
            <div className="flex items-center gap-2">
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
            </div>
          </div>
        )}

        {/* Preços */}
        {!hasVariations && (
          <div className="flex items-center gap-2">
            <div className="flex items-baseline gap-2">
              <Typography
                variant="caption"
                className="text-beergam-typography-tertiary!"
              >
                Preço de Custo:
              </Typography>
              <TextCensored
                className="flex!"
                maxCharacters={3}
                censorshipKey="produtos_list_details"
              >
                <Typography variant="h6" className="font-medium">
                  {formatCurrency(product.price_cost)}
                </Typography>
              </TextCensored>
            </div>
            <div className="flex items-baseline gap-2">
              <Typography
                variant="caption"
                className="text-beergam-typography-tertiary!"
              >
                Preço de Venda:
              </Typography>
              <TextCensored
                className="flex!"
                maxCharacters={3}
                censorshipKey="produtos_list_details"
              >
                <Typography variant="h6" className="font-medium">
                  {formatCurrency(product.price_sale)}
                </Typography>
              </TextCensored>
            </div>
          </div>
        )}
        {product.variations && product.variations.length > 0 && (
          <>
            <div className="flex items-center gap-2">
              <Typography
                variant="caption"
                className="text-beergam-typography-tertiary!"
              >
                Variações cadastradas:
              </Typography>
              <p>{variationsCount}</p>
            </div>
            <BeergamSlider
              slidesPerView={1}
              slides={product.variations.map((variation) => (
                <VariationCardNew
                  key={variation.product_variation_id}
                  variation={variation}
                  isMutating={changeStatusMutation.isPending}
                  onToggleStatus={(variationId, currentStatus) =>
                    handleToggleStatus(variationId, currentStatus)
                  }
                />
              ))}
              breakpoints={{
                768: {
                  slidesPerView: 3,
                },
              }}
            />
          </>
        )}
        {/* Estoque */}
        {!hasVariations && (
          <>
            <div className="flex items-center gap-2">
              <div className="flex items-baseline gap-2">
                <Typography
                  variant="caption"
                  className="text-beergam-typography-tertiary!"
                >
                  Estoque Disponível:
                </Typography>
                <h3>{product.available_quantity.toLocaleString("pt-BR")}</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <Typography
                  variant="caption"
                  className="text-beergam-typography-tertiary!"
                >
                  Estoque Inicial:
                </Typography>
                <h3>{product.initial_quantity.toLocaleString("pt-BR")}</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <Typography
                  variant="caption"
                  className="text-beergam-typography-tertiary!"
                >
                  Estoque Mínimo:
                </Typography>
                <h3>{product.minimum_quantity.toLocaleString("pt-BR")}</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <Typography
                  variant="caption"
                  className="text-beergam-typography-tertiary!"
                >
                  Estoque Máximo:
                </Typography>
                <h3>{product.maximum_quantity.toLocaleString("pt-BR")}</h3>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <Typography
                variant="caption"
                className="text-beergam-typography-tertiary!"
              >
                Status do Estoque:
              </Typography>
              <Chip
                label={
                  getStockStatus(
                    product.available_quantity,
                    product.minimum_quantity
                  ).label
                }
                size="small"
                sx={{
                  bgcolor: getStockStatus(
                    product.available_quantity,
                    product.minimum_quantity
                  ).bgColor,
                  color: getStockStatus(
                    product.available_quantity,
                    product.minimum_quantity
                  ).textColor,
                }}
              />
            </div>
          </>
        )}

        {/* Status Toggle e Botão de Editar */}
        <div className="flex items-center gap-2">
          {!hasVariations && (
            <div className="flex items-center gap-2">
              <Typography
                variant="caption"
                className="text-beergam-typography-tertiary!"
              >
                Status:
              </Typography>
              <ProductStatusToggle
                status={product.status}
                isActive={isActive}
                isMutating={changeStatusMutation.isPending}
                onToggle={handleToggleStatus}
              />
            </div>
          )}
          <BeergamButton
            title="Editar Produto"
            animationStyle="slider"
            link={`/interno/produtos/editar/${product.product_id}`}
            icon="pencil"
          />
        </div>
      </div>
    </CensorshipWrapper>
  );
}

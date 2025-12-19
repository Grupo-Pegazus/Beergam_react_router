import { useState } from "react";
import {
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Link } from "react-router";
import toast from "~/src/utils/toast";
import MainCards from "~/src/components/ui/MainCards";
import Svg from "~/src/assets/svgs/_index";
import Alert from "~/src/components/utils/Alert";
import { useModal } from "~/src/components/utils/Modal/useModal";
import ProductImage from "../ProductImage/ProductImage";
import type { Product } from "../../typings";
import VariationsList from "./Variations/VariationsList";
import { ProductStatusToggle } from "../ProductStatusToggle";
import VariationsStatusModal from "./VariationsStatusModal/VariationsStatusModal";
import { useChangeProductStatus, useDeleteProduct } from "../../hooks";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";

function formatNumber(value: number | null | undefined) {
  return (value ?? 0).toLocaleString("pt-BR");
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const hasVariations = product.variations && product.variations.length > 0;
  const changeStatusMutation = useChangeProductStatus();
  const deleteProductMutation = useDeleteProduct();
  const { openModal, closeModal } = useModal();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleExpansion = () => {
    setIsExpanded((prev) => !prev);
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

  const handleToggleStatus = () => {
    const normalizedStatus = product.status.toLowerCase().trim();
    const nextStatus = normalizedStatus === "ativo" ? "Inativo" : "Ativo";
    setIsMutating(true);
    changeStatusMutation.mutate(
      { productId: product.product_id, status: nextStatus as "Ativo" | "Inativo" },
      {
        onSettled: () => {
          setIsMutating(false);
        },
      }
    );
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    openModal(
      <Alert
        type="warning"
        confirmText="Excluir"
        onClose={closeModal}
        mutation={deleteProductMutation}
        onConfirm={() => {
          deleteProductMutation.mutate(product.product_id, {
            onSuccess: (data) => {
              if (!data.success) {
                toast.error(data.message || "Erro ao excluir produto");
                return;
              }
              closeModal();
              toast.success(data.message || "Produto excluído com sucesso");
            },
            onError: (error) => {
              toast.error(error instanceof Error ? error.message : "Erro ao excluir produto");
            },
          });
        }}
      >
        <h3>Tem certeza que deseja excluir o produto?</h3>
        <p>
          O produto <strong>{product.title}</strong> será excluído permanentemente.
          Esta ação não pode ser desfeita.
        </p>
      </Alert>,
      {
        title: "Confirmar exclusão",
      }
    );
  };

  const mainImageUrl =
    product.images?.product?.[0] ||
    product.variations?.[0]?.images?.product?.[0];

  const variationsCount = product.variations?.length || 0;
  const relatedAdsCount = product.related_ads?.length || 0;
  const isActive = product.status.toLowerCase().trim() === "ativo";

  // Calcula o estoque total: se tem variações, soma o estoque de todas elas
  const totalStock = hasVariations
    ? (product.variations || []).reduce((sum, variation) => {
        return sum + (variation.available_quantity || 0);
      }, 0)
    : product.available_quantity;

  return (
    <>
      <MainCards className="hover:bg-slate-50/50 transition-colors">
        {/* Layout Desktop */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4 py-2 lg:py-3 px-2 lg:px-4">
          {/* Toggle Switch ou Botão de Variações */}
          <div className="shrink-0 w-12 lg:w-16 flex justify-center">
            {!hasVariations ? (
              <ProductStatusToggle
                status={product.status}
                isActive={isActive}
                isMutating={isMutating}
                onToggle={handleToggleStatus}
              />
            ) : (
              <Chip
                label={variationsCount}
                size="small"
                onClick={handleOpenVariationsStatusModal}
                sx={{
                  height: 24,
                  fontSize: "0.7rem",
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
          </div>

          {/* Imagem */}
          <div className="shrink-0 relative">
            <ProductImage imageUrl={mainImageUrl} alt={product.title} size="small" />
            {hasVariations && (
              <button
                onClick={handleToggleExpansion}
                className="absolute -right-1 -top-1 flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 active:bg-blue-700 transition-colors z-10"
                aria-label={isExpanded ? "Recolher variações" : "Expandir variações"}
              >
                <Svg.chevron
                  tailWindClasses={`h-3 w-3 transition-transform duration-200 ${
                    isExpanded ? "rotate-270" : "rotate-90"
                  }`}
                />
              </button>
            )}
          </div>

          {/* Produto */}
          <div className="flex-1 min-w-0">
            <Typography
              variant="body2"
              fontWeight={600}
              className="text-slate-900 truncate text-sm lg:text-base"
            >
              {product.title}
            </Typography>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <Chip
                label={product.registration_type}
                size="small"
                sx={{
                  height: 18,
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  backgroundColor:
                    product.registration_type === "Completo"
                      ? "#dbeafe"
                      : "#f3e8ff",
                  color:
                    product.registration_type === "Completo"
                      ? "#1e40af"
                      : "#7c3aed",
                  "& .MuiChip-label": {
                    px: 0.75,
                  },
                }}
              />
              {product.categories && product.categories.length > 0 && (
                <Chip
                  label={product.categories[0].name}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.6rem",
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                    "& .MuiChip-label": {
                      px: 0.75,
                    },
                  }}
                />
              )}
            </div>
          </div>

          {/* Variações */}
          <div className="shrink-0 w-16 lg:w-20 text-center">
            {variationsCount > 0 ? (
              <Chip
                label={variationsCount}
                size="small"
                sx={{
                  height: 22,
                  fontSize: "0.7rem",
                  backgroundColor: "#f1f5f9",
                  color: "#475569",
                  fontWeight: 600,
                  "& .MuiChip-label": {
                    px: 1,
                  },
                }}
              />
            ) : (
              <Typography variant="caption" color="text.secondary">
                —
              </Typography>
            )}
          </div>

          {/* Preço - Não mostra se tiver variações */}
          <div className="shrink-0 w-20 lg:w-28">
            {hasVariations ? (
              <Typography variant="caption" color="text.secondary">
                —
              </Typography>
            ) : product.price_sale ? (
              <Typography variant="body2" fontWeight={600} className="text-slate-900 text-sm lg:text-base">
                {formatCurrency(product.price_sale)}
              </Typography>
            ) : (
              <Typography variant="caption" color="text.secondary">
                —
              </Typography>
            )}
          </div>

          {/* SKU - Oculto em tablet, visível em desktop */}
          <div className="shrink-0 w-24 lg:w-32 hidden lg:block">
            {product.sku ? (
              <Chip
                label={product.sku}
                size="small"
                sx={{
                  height: 22,
                  fontSize: "0.7rem",
                  backgroundColor: "#f1f5f9",
                  color: "#475569",
                  fontWeight: 500,
                  "& .MuiChip-label": {
                    px: 1,
                    maxWidth: "120px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />
            ) : (
              <Typography variant="caption" color="text.secondary">
                —
              </Typography>
            )}
          </div>

          {/* Anúncios */}
          <div className="shrink-0 w-16 lg:w-20 text-center">
            {relatedAdsCount > 0 ? (
              <Chip
                label={relatedAdsCount}
                size="small"
                sx={{
                  height: 22,
                  fontSize: "0.7rem",
                  backgroundColor: "#f1f5f9",
                  color: "#475569",
                  fontWeight: 600,
                  "& .MuiChip-label": {
                    px: 1,
                  },
                }}
              />
            ) : (
              <Typography variant="caption" color="text.secondary">
                —
              </Typography>
            )}
          </div>

          {/* Vendas - Oculto em tablet, visível em desktop */}
          <div className="shrink-0 w-20 lg:w-24 items-center gap-1 justify-center hidden lg:flex">
            {product.sales_quantity !== undefined ? (
              <>
                <Svg.bag tailWindClasses="h-4 w-4 text-slate-500" />
                <Typography variant="body2" fontWeight={600} className="text-slate-900 text-sm">
                  {formatNumber(product.sales_quantity)}
                </Typography>
              </>
            ) : (
              <Typography variant="caption" color="text.secondary">
                —
              </Typography>
            )}
          </div>

          {/* Estoque */}
          <div className="shrink-0 w-20 lg:w-28 flex items-center gap-1 lg:gap-1.5 justify-center">
            {totalStock !== undefined ? (
              <>
                <Typography variant="caption" color="text.secondary" className="text-xs hidden xl:block">
                  Qt:
                </Typography>
                <Chip
                  label={formatNumber(totalStock)}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: "0.7rem",
                    backgroundColor: "#d1fae5",
                    color: "#065f46",
                    fontWeight: 600,
                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                />
                <div className="w-2 h-2 rounded-full bg-green-500 hidden xl:block" />
              </>
            ) : (
              <Typography variant="caption" color="text.secondary">
                —
              </Typography>
            )}
          </div>

          {/* Configurações */}
          <div className="shrink-0">
            <IconButton size="small" onClick={handleMenuOpen}>
              <Svg.cog_8_tooth tailWindClasses="h-4 w-4 lg:h-5 lg:w-5 text-slate-500" />
            </IconButton>
          </div>
        </div>

        {/* Layout Mobile */}
        <div className="md:hidden p-3">
          <div className="flex items-start gap-3 mb-3">
            {/* Status e Imagem */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              {!hasVariations ? (
                <ProductStatusToggle
                  status={product.status}
                  isActive={isActive}
                  isMutating={isMutating}
                  onToggle={handleToggleStatus}
                />
              ) : (
                <Chip
                  label={variationsCount}
                  size="small"
                  onClick={handleOpenVariationsStatusModal}
                  sx={{
                    height: 22,
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    backgroundColor: "#dbeafe",
                    color: "#1e40af",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#bfdbfe",
                    },
                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                  title={`Clique para gerenciar status de ${variationsCount} variação${variationsCount > 1 ? "ões" : ""}`}
                  aria-label={`Abrir modal para gerenciar status das variações`}
                />
              )}
              <div className="relative">
                <ProductImage imageUrl={mainImageUrl} alt={product.title} size="small" />
                {hasVariations && (
                  <button
                    onClick={handleToggleExpansion}
                    className="absolute -right-1 -top-1 flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white shadow-md active:bg-blue-700 transition-colors z-10"
                    aria-label={isExpanded ? "Recolher variações" : "Expandir variações"}
                  >
                    <Svg.chevron
                      tailWindClasses={`h-3 w-3 transition-transform duration-200 ${
                        isExpanded ? "rotate-270" : "rotate-90"
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Informações do Produto */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Typography
                  variant="body2"
                  fontWeight={600}
                  className="text-slate-900 text-sm leading-tight"
                >
                  {product.title}
                </Typography>
                <IconButton size="small" onClick={handleMenuOpen} className="shrink-0">
                  <Svg.cog_8_tooth tailWindClasses="h-4 w-4 text-slate-500" />
                </IconButton>
              </div>
              
              <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                <Chip
                  label={product.registration_type}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    backgroundColor:
                      product.registration_type === "Completo"
                        ? "#dbeafe"
                        : "#f3e8ff",
                    color:
                      product.registration_type === "Completo"
                        ? "#1e40af"
                        : "#7c3aed",
                    "& .MuiChip-label": {
                      px: 0.75,
                    },
                  }}
                />
                {product.categories && product.categories.length > 0 && (
                  <Chip
                    label={product.categories[0].name}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "0.6rem",
                      backgroundColor: "#f1f5f9",
                      color: "#475569",
                      "& .MuiChip-label": {
                        px: 0.75,
                      },
                    }}
                  />
                )}
              </div>

              {/* Grid de informações em mobile */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Typography variant="caption" color="text.secondary" className="text-xs">
                    Preço:
                  </Typography>
                  {hasVariations ? (
                    <Typography variant="caption" color="text.secondary" className="text-xs">
                      —
                    </Typography>
                  ) : product.price_sale ? (
                    <Typography variant="body2" fontWeight={600} className="text-slate-900 text-xs">
                      {formatCurrency(product.price_sale)}
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="text.secondary" className="text-xs">
                      —
                    </Typography>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Typography variant="caption" color="text.secondary" className="text-xs">
                    Estoque:
                  </Typography>
                  {totalStock !== undefined ? (
                    <div className="flex items-center gap-1">
                      <Chip
                        label={formatNumber(totalStock)}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: "0.65rem",
                          backgroundColor: "#d1fae5",
                          color: "#065f46",
                          fontWeight: 600,
                          "& .MuiChip-label": {
                            px: 0.5,
                          },
                        }}
                      />
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    </div>
                  ) : (
                    <Typography variant="caption" color="text.secondary" className="text-xs">
                      —
                    </Typography>
                  )}
                </div>
                {variationsCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Typography variant="caption" color="text.secondary" className="text-xs">
                      Variações:
                    </Typography>
                    <Chip
                      label={variationsCount}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: "0.65rem",
                        backgroundColor: "#f1f5f9",
                        color: "#475569",
                        fontWeight: 600,
                        "& .MuiChip-label": {
                          px: 0.5,
                        },
                      }}
                    />
                  </div>
                )}
                {relatedAdsCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Typography variant="caption" color="text.secondary" className="text-xs">
                      Anúncios:
                    </Typography>
                    <Chip
                      label={relatedAdsCount}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: "0.65rem",
                        backgroundColor: "#f1f5f9",
                        color: "#475569",
                        fontWeight: 600,
                        "& .MuiChip-label": {
                          px: 0.5,
                        },
                      }}
                    />
                  </div>
                )}
                {product.sku && (
                  <div className="flex items-center gap-1 col-span-2">
                    <Typography variant="caption" color="text.secondary" className="text-xs">
                      SKU:
                    </Typography>
                    <Chip
                      label={product.sku}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: "0.65rem",
                        backgroundColor: "#f1f5f9",
                        color: "#475569",
                        fontWeight: 500,
                        "& .MuiChip-label": {
                          px: 0.5,
                          maxWidth: "150px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        },
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </MainCards>

      {/* Seção de Variações Expandida */}
      {hasVariations && isExpanded && (
        <div className="mt-2 pt-2 border-t border-slate-200">
          <div className="mb-2 px-2 md:px-4">
            <Typography variant="caption" fontWeight={600} className="text-slate-600 uppercase tracking-wide text-xs sm:text-sm">
              Variações ({variationsCount})
            </Typography>
          </div>
          <VariationsList
            variations={product.variations || []}
            product={product}
          />
        </div>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          component={Link}
          to={`/interno/produtos/gestao/${product.product_id}`}
          onClick={handleMenuClose}
        >
          <Svg.eye tailWindClasses="w-4 h-4 mr-2" />
          Ver detalhes
        </MenuItem>
        {(totalStock !== undefined || hasVariations) && (
          <MenuItem
            component={Link}
            to={`/interno/produtos/estoque/${product.product_id}`}
            onClick={handleMenuClose}
          >
            <Svg.box tailWindClasses="w-4 h-4 mr-2" />
            Controle de estoque
          </MenuItem>
        )}
        <MenuItem
          component={Link}
          to={`/interno/produtos/editar/${product.product_id}`}
          onClick={handleMenuClose}
        >
          <Svg.pencil tailWindClasses="w-4 h-4 mr-2" />
          Editar produto
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          <Svg.trash tailWindClasses="w-4 h-4 mr-2" />
          Excluir produto
        </MenuItem>
      </Menu>

    </>
  );
}

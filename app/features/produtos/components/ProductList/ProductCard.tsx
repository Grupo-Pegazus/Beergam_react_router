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
import ProductImage from "../ProductImage/ProductImage";
import type { Product } from "../../typings";
import VariationsList from "./Variations/VariationsList";
import { ProductStatusToggle } from "../ProductStatusToggle";
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
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const hasVariations = product.variations && product.variations.length > 0;
  const changeStatusMutation = useChangeProductStatus();
  const deleteProductMutation = useDeleteProduct();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleExpansion = () => {
    setIsExpanded((prev) => !prev);
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
    setShowDeleteAlert(true);
    handleMenuClose();
  };

  const handleConfirmDelete = () => {
    toast.promise(deleteProductMutation.mutateAsync(product.product_id), {
      loading: "Excluindo produto...",
      success: (data) => {
        if (!data.success) {
          throw new Error(data.message);
        }
        setShowDeleteAlert(false);
        return data.message || "Produto excluído com sucesso";
      },
      error: "Erro ao excluir produto",
    });
  };

  const mainImageId =
    product.images?.product?.[0] ||
    product.variations?.[0]?.images?.product?.[0];

  const variationsCount = product.variations?.length || 0;
  const relatedAdsCount = product.related_ads?.length || 0;
  const isActive = product.status.toLowerCase().trim() === "ativo";

  return (
    <>
      <MainCards className="hover:bg-slate-50/50 transition-colors">
        <div className="flex items-center gap-4 py-3 px-4">
          {/* Toggle Switch ou Status */}
          <div className="shrink-0 w-16 flex justify-center">
            {!hasVariations ? (
              <ProductStatusToggle
                status={product.status}
                isActive={isActive}
                isMutating={isMutating}
                onToggle={handleToggleStatus}
              />
            ) : (
              <Chip
                label={product.status}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  backgroundColor: isActive ? "#d1fae5" : "#fee2e2",
                  color: isActive ? "#065f46" : "#991b1b",
                  "& .MuiChip-label": {
                    px: 1,
                  },
                }}
              />
            )}
          </div>

          {/* Imagem */}
          <div className="shrink-0 relative">
            <ProductImage imageId={mainImageId} alt={product.title} size="small" />
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
              className="text-slate-900 truncate"
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
          <div className="shrink-0 w-20 text-center">
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

          {/* Preço */}
          <div className="shrink-0 w-28">
            {product.price_sale ? (
              <Typography variant="body2" fontWeight={600} className="text-slate-900">
                {formatCurrency(product.price_sale)}
              </Typography>
            ) : (
              <Typography variant="caption" color="text.secondary">
                —
              </Typography>
            )}
          </div>

          {/* SKU */}
          <div className="shrink-0 w-32">
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
          <div className="shrink-0 w-20 text-center">
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

          {/* Vendas */}
          <div className="shrink-0 w-24 flex items-center gap-1 justify-center">
            {product.sales_quantity !== undefined ? (
              <>
                <Svg.bag tailWindClasses="h-4 w-4 text-slate-500" />
                <Typography variant="body2" fontWeight={600} className="text-slate-900">
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
          <div className="shrink-0 w-28 flex items-center gap-1.5 justify-center">
            {product.available_quantity !== undefined ? (
              <>
                <Typography variant="caption" color="text.secondary" className="text-xs">
                  Qt:
                </Typography>
                <Chip
                  label={formatNumber(product.available_quantity)}
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
                <div className="w-2 h-2 rounded-full bg-green-500" />
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
              <Svg.cog_8_tooth tailWindClasses="h-5 w-5 text-slate-500" />
            </IconButton>
          </div>
        </div>
      </MainCards>

      {/* Seção de Variações Expandida */}
      {hasVariations && isExpanded && (
        <div className="mt-2 pt-2 border-t border-slate-200">
          <div className="mb-2 px-4">
            <Typography variant="caption" fontWeight={600} className="text-slate-600 uppercase tracking-wide">
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
          to={`/interno/produtos/${product.product_id}`}
          onClick={handleMenuClose}
        >
          Ver detalhes
        </MenuItem>
        {product.available_quantity !== undefined && (
          <MenuItem
            component={Link}
            to={`/interno/produtos/estoque/${product.product_id}`}
            onClick={handleMenuClose}
          >
            Controle de estoque
          </MenuItem>
        )}
        <MenuItem onClick={handleMenuClose}>Editar produto</MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          Excluir produto
        </MenuItem>
      </Menu>

      <Alert
        isOpen={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        onConfirm={handleConfirmDelete}
        type="warning"
        title="Confirmar exclusão"
      >
        <h3>Tem certeza que deseja excluir o produto?</h3>
        <p>
          O produto <strong>{product.title}</strong> será excluído permanentemente.
          Esta ação não pode ser desfeita.
        </p>
      </Alert>
    </>
  );
}

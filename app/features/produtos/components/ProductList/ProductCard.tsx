import { useState } from "react";
import {
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Link } from "react-router";
import MainCards from "~/src/components/ui/MainCards";
import Svg from "~/src/assets/svgs/_index";
import ProductImage from "../ProductImage/ProductImage";
import type { Product } from "../../typings";
import toast from "~/src/utils/toast";
import VariationsList from "./Variations/VariationsList";
import { ProductStatusToggle } from "../ProductStatusToggle";
import { useChangeProductStatus } from "../../hooks";
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

  const mainImageId =
    product.images?.product?.[0] ||
    product.variations?.[0]?.images?.product?.[0];

  const variationsCount = product.variations?.length || 0;
  const relatedAdsCount = product.related_ads?.length || 0;

  return (
    <MainCards>
      <div className="grid grid-cols-12 gap-4">
        {/* Coluna Esquerda: Produto */}
        <div className="col-span-12 md:col-span-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="relative shrink-0">
              <ProductImage imageId={mainImageId} alt={product.title} />
              {hasVariations && (
                <button
                  onClick={handleToggleExpansion}
                  className="absolute -right-1 -top-1 md:flex hidden items-center justify-center w-6 h-6 md:w-5 md:h-5 rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 active:bg-blue-700 transition-colors z-10 touch-manipulation"
                  aria-label={isExpanded ? "Recolher variações" : "Expandir variações"}
                >
                  <Svg.chevron
                    tailWindClasses={`h-3.5 w-3.5 md:h-3 md:w-3 transition-transform duration-200 ${
                      isExpanded ? "rotate-270" : "rotate-90"
                    }`}
                  />
                </button>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex md:items-center items-start md:flex-row flex-col gap-2 mb-1">
                {product.sku && (
                  <>
                    <div className="flex items-center gap-2">
                      <Typography variant="caption" color="text.secondary">
                        SKU {product.sku}
                      </Typography>
                      <button
                        className="flex items-center gap-1 text-slate-500 hover:text-slate-700"
                        onClick={() => {
                          if (product.sku) {
                            navigator.clipboard.writeText(product.sku);
                            toast.success("SKU copiado para a área de transferência");
                          }
                        }}
                      >
                        <Svg.copy tailWindClasses="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
              <Typography
                variant="body2"
                fontWeight={600}
                className="text-slate-900 mb-2 truncate max-w-[90%]"
              >
                {product.title}
              </Typography>
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <Chip
                  label={product.registration_type}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    backgroundColor:
                      product.registration_type === "Completo"
                        ? "#dbeafe"
                        : "#f3e8ff",
                    color:
                      product.registration_type === "Completo"
                        ? "#1e40af"
                        : "#7c3aed",
                  }}
                />
                {product.status.toLowerCase().trim() === "ativo" && (
                  <Chip
                    label="Ativo"
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      backgroundColor: "#d1fae5",
                      color: "#065f46",
                    }}
                  />
                )}
                {product.categories && product.categories.length > 0 && (
                  <Chip
                    label={product.categories[0].name}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.65rem",
                      backgroundColor: "#f1f5f9",
                      color: "#475569",
                    }}
                  />
                )}
              </div>
              <Typography variant="caption" color="text.secondary">
                Cadastrado em {new Date(product.created_at).toLocaleDateString("pt-BR")}
              </Typography>
            </div>
          </div>
        </div>

        {/* Coluna do Meio: Informações */}
        <div className="col-span-12 md:col-span-4 space-y-2">
          {product.price_sale && (
            <div>
              <Typography variant="caption" color="text.secondary" className="block mb-0.5">
                Preço de venda
              </Typography>
              <Typography variant="h6" fontWeight={700} className="text-slate-900">
                {formatCurrency(product.price_sale)}
              </Typography>
            </div>
          )}

          <div>
            <Typography variant="caption" color="text.secondary" className="block mb-0.5">
              Variações
            </Typography>
            <Typography variant="body2" fontWeight={600} className="text-slate-900">
              {variationsCount} variação{variationsCount !== 1 ? "ões" : ""}
            </Typography>
          </div>

          {product.available_quantity !== undefined && (
            <div>
              <Typography variant="caption" color="text.secondary" className="block mb-0.5">
                Estoque disponível
              </Typography>
              <Typography variant="body2" fontWeight={600} className="text-slate-900">
                {formatNumber(product.available_quantity)} unidades
              </Typography>
            </div>
          )}

          {product.sales_quantity !== undefined && (
            <div>
              <Typography variant="caption" color="text.secondary" className="block mb-0.5">
                Vendas
              </Typography>
              <Typography variant="body2" fontWeight={600} className="text-slate-900">
                {formatNumber(product.sales_quantity)} unidades vendidas
              </Typography>
            </div>
          )}

          <div>
            <Typography variant="caption" color="text.secondary" className="block mb-0.5">
              Anúncios relacionados
            </Typography>
            <Typography variant="body2" fontWeight={600} className="text-slate-900">
              {relatedAdsCount} anúncio{relatedAdsCount !== 1 ? "s" : ""}
            </Typography>
          </div>

          {product.categories && product.categories.length > 1 && (
            <div>
              <Typography variant="caption" color="text.secondary" className="block mb-0.5">
                Categorias
              </Typography>
              <Typography variant="body2" className="text-slate-700">
                {product.categories.map((cat) => cat.name).join(", ")}
              </Typography>
            </div>
          )}
        </div>

        {/* Coluna Direita: Status e Ações */}
        <div className="col-span-12 md:col-span-3 space-y-3">
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              {!hasVariations ? (
                <ProductStatusToggle
                  status={product.status}
                  isActive={product.status.toLowerCase().trim() === "ativo"}
                  isMutating={isMutating}
                  onToggle={handleToggleStatus}
                />
              ) : (
                <Chip
                  label={product.status}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    backgroundColor: product.status.toLowerCase().trim() === "ativo" ? "#d1fae5" : "#fee2e2",
                    color: product.status.toLowerCase().trim() === "ativo" ? "#065f46" : "#991b1b",
                    "& .MuiChip-label": {
                      px: 1.5,
                    },
                  }}
                />
              )}
              <IconButton size="small" onClick={handleMenuOpen}>
                <Svg.elipsis_horizontal tailWindClasses="h-5 w-5" />
              </IconButton>
            </div>
          </div>
          {hasVariations && (
            <button
              onClick={handleToggleExpansion}
              className="mt-2 flex items-center gap-2 w-full md:w-auto px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 transition-colors touch-manipulation md:hidden"
              aria-label={isExpanded ? "Recolher variações" : "Expandir variações"}
            >
              <Svg.chevron
                tailWindClasses={`h-4 w-4 transition-transform duration-200 ${
                  isExpanded ? "rotate-270" : "rotate-90"
                }`}
              />
              <Typography variant="caption" className="text-blue-700 font-semibold">
                {isExpanded ? "Ocultar" : "Ver"} {variationsCount} variaç{variationsCount === 1 ? "ão" : "ões"}
              </Typography>
            </button>
          )}
        </div>
      </div>

      {/* Seção de Variações Expandida */}
      {hasVariations && isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-200">
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
        <MenuItem onClick={handleMenuClose}>Editar produto</MenuItem>
      </Menu>
    </MainCards>
  );
}


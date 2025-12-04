import { useState } from "react";
import { Chip, Typography } from "@mui/material";
import Svg from "~/src/assets/svgs/_index";
import CopyButton from "~/src/components/ui/CopyButton";
import type { Product } from "../../../typings";
import { ProductStatusToggle } from "../../ProductStatusToggle";
import { useChangeVariationStatus } from "../../../hooks";
import MainCards from "~/src/components/ui/MainCards";
import ProductImage from "../../ProductImage/ProductImage";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";

function formatNumber(value: number | null | undefined) {
  return (value ?? 0).toLocaleString("pt-BR");
}

interface VariationCardProps {
  variation: Product["variations"][0];
  productId: string;
}

export default function VariationCard({ variation, productId }: VariationCardProps) {
  const [isMutating, setIsMutating] = useState(false);
  const changeStatusMutation = useChangeVariationStatus();
  const variationImageId = variation.images?.product?.[0];

  const handleToggleStatus = () => {
    const normalizedStatus = variation.status.toLowerCase().trim();
    const nextStatus = normalizedStatus === "ativo" ? "Inativo" : "Ativo";
    setIsMutating(true);
    changeStatusMutation.mutate(
      {
        productId,
        variationId: variation.product_variation_id,
        status: nextStatus as "Ativo" | "Inativo",
      },
      {
        onSettled: () => {
          setIsMutating(false);
        },
      }
    );
  };

  return (
    <div className="ml-4 md:ml-8 relative">
      {/* Linha conectora visual */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-200" />
      
      <MainCards className="hover:bg-blue-50/30 transition-colors border-l-2 border-blue-300 bg-slate-50/30">
        {/* Layout Desktop */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4 py-2 lg:py-2 px-2 lg:px-4">
          {/* Toggle Switch */}
          <div className="shrink-0 w-12 lg:w-16 flex justify-center">
            <ProductStatusToggle
              status={variation.status}
              isActive={variation.status.toLowerCase().trim() === "ativo"}
              isMutating={isMutating}
              onToggle={handleToggleStatus}
            />
          </div>

          {/* Imagem */}
          {variationImageId && (
            <div className="shrink-0">
              <ProductImage imageId={variationImageId} alt={variation.title} size="small" />
            </div>
          )}

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Chip
                label="Variação"
                size="small"
                sx={{
                  height: 18,
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  backgroundColor: "#dbeafe",
                  color: "#1e40af",
                  "& .MuiChip-label": {
                    px: 0.75,
                  },
                }}
              />
              <Typography
                variant="body2"
                fontWeight={600}
                className="text-slate-900 text-sm lg:text-base"
              >
                {variation.title}
              </Typography>
            </div>
            {variation.attributes && variation.attributes.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 mb-1">
                {variation.attributes.map((attr, index) => (
                  <Chip
                    key={index}
                    label={`${attr.name}: ${attr.value.join(", ")}`}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "0.6rem",
                      fontWeight: 500,
                      backgroundColor: "#e0e7ff",
                      color: "#4338ca",
                      "& .MuiChip-label": {
                        px: 0.75,
                      },
                    }}
                  />
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              {variation.sku && (
                <div className="flex items-center gap-1">
                  <Typography variant="caption" color="text.secondary" className="font-mono text-xs">
                    SKU {variation.sku}
                  </Typography>
                  <CopyButton
                    textToCopy={variation.sku}
                    successMessage="SKU copiado"
                    iconSize="h-3 w-3"
                    ariaLabel="Copiar SKU"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Preço */}
          <div className="shrink-0 w-20 lg:w-28">
            {variation.price_sale ? (
              <Typography variant="body2" fontWeight={600} className="text-slate-900 text-sm lg:text-base">
                {formatCurrency(variation.price_sale)}
              </Typography>
            ) : (
              <Typography variant="caption" color="text.secondary">
                —
              </Typography>
            )}
          </div>

          {/* Vendas */}
          <div className="shrink-0 w-20 lg:w-24 items-center gap-1 justify-center hidden lg:flex">
            {variation.sales_quantity !== undefined ? (
              <>
                <Svg.bag tailWindClasses="h-4 w-4 text-slate-500" />
                <Typography variant="body2" fontWeight={600} className="text-slate-900 text-sm">
                  {formatNumber(variation.sales_quantity)}
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
            {variation.available_quantity !== undefined ? (
              <>
                <Typography variant="caption" color="text.secondary" className="text-xs hidden xl:block">
                  Qt:
                </Typography>
                <Chip
                  label={formatNumber(variation.available_quantity)}
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
        </div>

        {/* Layout Mobile */}
        <div className="md:hidden p-3">
          <div className="flex items-start gap-3">
            {/* Status e Imagem */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <ProductStatusToggle
                status={variation.status}
                isActive={variation.status.toLowerCase().trim() === "ativo"}
                isMutating={isMutating}
                onToggle={handleToggleStatus}
              />
              {variationImageId && (
                <ProductImage imageId={variationImageId} alt={variation.title} size="small" />
              )}
            </div>

            {/* Informações da Variação */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Chip
                  label="Variação"
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    backgroundColor: "#dbeafe",
                    color: "#1e40af",
                    "& .MuiChip-label": {
                      px: 0.75,
                    },
                  }}
                />
                <Typography
                  variant="body2"
                  fontWeight={600}
                  className="text-slate-900 text-sm leading-tight"
                >
                  {variation.title}
                </Typography>
              </div>

              {variation.attributes && variation.attributes.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 mb-2">
                  {variation.attributes.map((attr, index) => (
                    <Chip
                      key={index}
                      label={`${attr.name}: ${attr.value.join(", ")}`}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: "0.6rem",
                        fontWeight: 500,
                        backgroundColor: "#e0e7ff",
                        color: "#4338ca",
                        "& .MuiChip-label": {
                          px: 0.5,
                        },
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Grid de informações em mobile */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {variation.sku && (
                  <div className="flex items-center gap-1 col-span-2">
                    <Typography variant="caption" color="text.secondary" className="text-xs">
                      SKU:
                    </Typography>
                    <Typography variant="caption" color="text.secondary" className="font-mono text-xs">
                      {variation.sku}
                    </Typography>
                    <CopyButton
                      textToCopy={variation.sku}
                      successMessage="SKU copiado"
                      iconSize="h-3 w-3"
                      ariaLabel="Copiar SKU"
                    />
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Typography variant="caption" color="text.secondary" className="text-xs">
                    Preço:
                  </Typography>
                  {variation.price_sale ? (
                    <Typography variant="body2" fontWeight={600} className="text-slate-900 text-xs">
                      {formatCurrency(variation.price_sale)}
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
                  {variation.available_quantity !== undefined ? (
                    <div className="flex items-center gap-1">
                      <Chip
                        label={formatNumber(variation.available_quantity)}
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
                {variation.sales_quantity !== undefined && (
                  <div className="flex items-center gap-1 col-span-2">
                    <Typography variant="caption" color="text.secondary" className="text-xs">
                      Vendas:
                    </Typography>
                    <Svg.bag tailWindClasses="h-3 w-3 text-slate-500" />
                    <Typography variant="body2" fontWeight={600} className="text-slate-900 text-xs">
                      {formatNumber(variation.sales_quantity)}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </MainCards>
    </div>
  );
}

import { useState } from "react";
import { Chip, Typography } from "@mui/material";
import Svg from "~/src/assets/svgs/_index";
import toast from "~/src/utils/toast";
import type { Product } from "../../../typings";
import ProductImage from "../../ProductImage/ProductImage";
import { ProductStatusToggle } from "../../ProductStatusToggle";
import { useChangeVariationStatus } from "../../../hooks";

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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 px-3 sm:py-2 sm:px-2 border-b border-slate-200 last:border-b-0 hover:bg-white sm:hover:bg-slate-50 transition-colors gap-2 sm:gap-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {variationImageId && (
          <ProductImage
            imageId={variationImageId}
            alt={variation.title}
            size="small"
            className="hidden sm:block"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Typography
              variant="body2"
              fontWeight={600}
              className="text-slate-900"
            >
              {variation.title}
            </Typography>
            {variation.status && (
              <span
                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  variation.status.toLowerCase().trim() === "ativo"
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {variation.status}
              </span>
            )}
          </div>
          {variation.description && (
            <Typography variant="caption" color="text.secondary" className="block mb-1">
              {variation.description}
            </Typography>
          )}
          {variation.categories && variation.categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mb-1">
              {variation.categories.map((category, index) => (
                <Chip
                  key={index}
                  label={category.name}
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
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            {variation.sku && (
              <>
                <div className="flex items-center gap-1">
                  <Typography variant="caption" color="text.secondary" className="font-mono">
                    SKU {variation.sku}
                  </Typography>
                  <button
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-700"
                    onClick={() => {
                      if (variation.sku) {
                        navigator.clipboard.writeText(variation.sku);
                        toast.success("SKU copiado");
                      }
                    }}
                    aria-label="Copiar SKU"
                  >
                    <Svg.copy tailWindClasses="h-3 w-3" />
                  </button>
                </div>
              </>
            )}
            {variation.product_variation_id && (
              <>
                <span className="text-slate-300 hidden sm:inline">|</span>
                <div className="flex items-center gap-1">
                  <Typography variant="caption" color="text.secondary" className="font-mono text-[10px]">
                    ID: {variation.product_variation_id.slice(0, 8)}
                  </Typography>
                  <button
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-700"
                    onClick={() => {
                      navigator.clipboard.writeText(variation.product_variation_id);
                      toast.success("ID copiado");
                    }}
                    aria-label="Copiar ID"
                  >
                    <Svg.copy tailWindClasses="h-3 w-3" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-600 sm:ml-auto sm:shrink-0">
        <div className="flex flex-col items-end gap-2">
          {variation.images?.product && variation.images.product.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              {variation.images.product.length} imagem{variation.images.product.length !== 1 ? "s" : ""}
            </Typography>
          )}
          <ProductStatusToggle
            status={variation.status}
            isActive={variation.status.toLowerCase().trim() === "ativo"}
            isMutating={isMutating}
            onToggle={handleToggleStatus}
          />
        </div>
      </div>
    </div>
  );
}

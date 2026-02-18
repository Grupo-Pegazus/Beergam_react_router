import { Typography, Chip } from "@mui/material";
import { Fields } from "~/src/components/utils/_fields";
import type { Variation } from "../../../typings";
import { formatCurrency } from "../utils";

interface VariationSkuInputProps {
  variation: Variation;
  value: string;
  onChange: (value: string) => void;
  varyingAttributeIds: string[];
  onUseMlbAsSku: () => void;
}

export default function VariationSkuInput({
  variation,
  value,
  onChange,
  varyingAttributeIds,
  onUseMlbAsSku,
}: VariationSkuInputProps) {
  // Pega todos os atributos que variam
  const varyingAttributes =
    varyingAttributeIds.length > 0
      ? variation.attributes.filter((attr) =>
          varyingAttributeIds.includes(attr.id)
        )
      : variation.attributes;

  const stockColor = variation.stock === 0 
    ? "text-beergam-red!" 
    : variation.stock < 10 
    ? "text-beergam-orange!" 
    : "text-beergam-green!";

  return (
    <div className="bg-beergam-section-background! dark:bg-beergam-gray-blueish-dark! rounded-xl p-4 border border-black/10 dark:border-white/15!">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Informações da Variação */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Atributos da Variação */}
          {varyingAttributes.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {varyingAttributes.map((attr) => (
                <div
                  key={attr.id}
                  className="flex items-center gap-1.5 bg-beergam-section-background! px-2.5 py-1 rounded-md"
                >
                  <span className="text-xs text-beergam-typography-secondary! font-medium">
                    {attr.name}:
                  </span>
                  <span className="text-sm text-beergam-typography-primary! font-semibold">
                    {attr.value_name || "-"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <Typography
              variant="body2"
              className="text-beergam-typography-secondary! font-medium"
            >
              Variação ID: {variation.variation_id}
            </Typography>
          )}

          {/* Preço e Estoque */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-beergam-typography-secondary!">Preço:</span>
              <span className="text-sm font-semibold text-beergam-typography-primary!">
                {formatCurrency(variation.price)}
              </span>
            </div>
            <span className="text-beergam-typography-secondary!">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-beergam-typography-secondary!">Estoque:</span>
              <span className={`text-sm font-semibold ${stockColor}`}>
                {variation.stock}
              </span>
            </div>
          </div>
        </div>

        {/* Campo de SKU */}
        <div className="flex items-end gap-2 lg:w-[320px] shrink-0">
          <Fields.wrapper tailWindClasses="flex-1 min-w-0">
            <Fields.label text="SKU" />
            <Fields.input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Digite o SKU"
              className="text-sm"
            />
          </Fields.wrapper>
          <button
            type="button"
            onClick={() => {
              onChange(variation.mlb);
              onUseMlbAsSku();
            }}
            className="px-3 py-2 text-xs font-medium text-beergam-blue-primary! bg-beergam-blue-light! dark:bg-beergam-blue-primary/20! border border-beergam-blue-primary! rounded-lg hover:opacity-80 transition-opacity whitespace-nowrap shrink-0 h-[42px] flex items-center"
          >
            Usar MLB
          </button>
        </div>
      </div>
    </div>
  );
}

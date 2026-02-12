import { Typography } from "@mui/material";
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

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-beergam-border-secondary! bg-beergam-section-background p-3">
      <div className="flex-1 min-w-0">
        {varyingAttributes.length > 0 ? (
          <>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
              {varyingAttributes.map((attr, idx) => (
                <Typography
                  key={attr.id}
                  variant="body2"
                  className="text-beergam-typography-secondary! font-medium wrap-break-word"
                >
                  {attr.name}:{" "}
                  <span className="text-beergam-typography-primary! font-semibold">
                    {attr.value_name || "-"}
                  </span>
                  {idx < varyingAttributes.length - 1 && (
                    <span className="text-beergam-typography-secondary! mx-1 hidden sm:inline">
                      |
                    </span>
                  )}
                </Typography>
              ))}
            </div>
            <Typography
              variant="caption"
              className="block"
            >
              Preço: {formatCurrency(variation.price)} | Estoque:{" "}
              {variation.stock}
            </Typography>
          </>
        ) : (
          <>
            <Typography
              variant="caption"
              className="block mb-1 break-all"
            >
              Variação ID: {variation.variation_id}
            </Typography>
            <Typography variant="body2" className="text-beergam-typography-secondary!">
              Preço: {formatCurrency(variation.price)} | Estoque:{" "}
              {variation.stock}
            </Typography>
          </>
        )}
      </div>
      <Fields.wrapper tailWindClasses="w-full sm:w-auto sm:min-w-[260px]">
        <Fields.label text="SKU" />
        <div className="flex items-center gap-2">
          <Fields.input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Digite o SKU"
          />
          <button
            type="button"
            onClick={() => {
              onChange(variation.mlb);
              onUseMlbAsSku();
            }}
            className="px-2 py-1 text-xs font-medium text-beergam-blue-primary border border-beergam-blue-primary rounded hover:bg-beergam-blue-primary/5 whitespace-nowrap"
          >
            Usar MLB
          </button>
        </div>
      </Fields.wrapper>
    </div>
  );
}

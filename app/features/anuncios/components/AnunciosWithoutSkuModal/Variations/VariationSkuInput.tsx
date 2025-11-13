import { TextField, Typography } from "@mui/material";
import type { Variation } from "../../../typings";
import { formatCurrency } from "../utils";

interface VariationSkuInputProps {
  variation: Variation;
  value: string;
  onChange: (value: string) => void;
  varyingAttributeId: string | null;
}

export default function VariationSkuInput({
  variation,
  value,
  onChange,
  varyingAttributeId,
}: VariationSkuInputProps) {
  const varyingAttribute = varyingAttributeId
    ? variation.attributes.find((attr) => attr.id === varyingAttributeId)
    : null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
      <div className="flex-1 min-w-0">
        {varyingAttribute ? (
          <>
            <Typography variant="body2" className="text-slate-700 font-medium mb-1 wrap-break-word">
              {varyingAttribute.name}:{" "}
              <span className="text-slate-900 font-semibold">
                {varyingAttribute.value_name}
              </span>
            </Typography>
            <Typography variant="caption" color="text.secondary" className="block">
              Preço: {formatCurrency(variation.price)} | Estoque: {variation.stock}
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="caption" color="text.secondary" className="block mb-1 break-all">
              Variação ID: {variation.variation_id}
            </Typography>
            <Typography variant="body2" className="text-slate-700">
              Preço: {formatCurrency(variation.price)} | Estoque: {variation.stock}
            </Typography>
          </>
        )}
      </div>
      <TextField
        label="SKU"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        size="small"
        placeholder="Digite o SKU"
        sx={{ minWidth: { xs: "100%", sm: 200 }, width: { xs: "100%", sm: "auto" } }}
        className="w-full sm:w-auto"
      />
    </div>
  );
}


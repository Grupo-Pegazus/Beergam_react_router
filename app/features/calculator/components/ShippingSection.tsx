import { Paper } from "@mui/material";
import { Fields } from "~/src/components/utils/_fields";

interface ShippingSectionProps {
  freeShipping: boolean;
  shippingCost: string;
  onFreeShippingChange: (value: boolean) => void;
  onShippingCostChange: (value: string) => void;
}

export default function ShippingSection({
  freeShipping,
  shippingCost,
  onFreeShippingChange,
  onShippingCostChange,
}: ShippingSectionProps) {
  return (
    <Paper className="space-y-4">
      <h2 className="text-lg font-semibold text-beergam-typography-primary">
        Envio
      </h2>

      <Fields.wrapper>
        <Fields.checkbox
          name="freeShipping"
          checked={freeShipping}
          onChange={(e) => onFreeShippingChange(e.target.checked)}
          label="Frete grátis"
        />
      </Fields.wrapper>

      {!freeShipping && (
        <Fields.wrapper>
          <Fields.label
            text="Custo de envio"
            hint="Custo do envio do produto"
          />
          <Fields.numericInput
            prefix="R$"
            format="currency"
            value={shippingCost === "" ? undefined : Number(shippingCost)}
            onChange={(v) => onShippingCostChange(v === undefined ? "" : String(v))}
            placeholder="0,00"
            min={0}
          />
          <p className="text-xs text-beergam-gray mt-1.5">Opcional</p>
        </Fields.wrapper>
      )}
    </Paper>
  );
}

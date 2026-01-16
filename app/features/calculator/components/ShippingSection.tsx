import { Paper } from "@mui/material";
import { Fields } from "~/src/components/utils/_fields";
import RadioGroup from "./RadioGroup";

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
        <Fields.label
          text="Frete grátis"
          hint="Se o frete será grátis para o comprador"
        />
        <RadioGroup
          name="freeShipping"
          value={freeShipping ? "sim" : "nao"}
          options={[
            { value: "nao", label: "Não" },
            { value: "sim", label: "Sim" },
          ]}
          onChange={(value) => onFreeShippingChange(value === "sim")}
        />
      </Fields.wrapper>

      {!freeShipping && (
        <Fields.wrapper>
          <Fields.label
            text="Custo de envio"
            hint="Custo do envio do produto"
          />
          <Fields.input
            type="number"
            value={shippingCost}
            onChange={(e) => onShippingCostChange(e.target.value)}
            placeholder="0,00"
            prefix="R$"
            step={0.01}
            min={0}
          />
          <p className="text-xs text-beergam-typography-secondary mt-1.5">
            Opcional
          </p>
        </Fields.wrapper>
      )}
    </Paper>
  );
}

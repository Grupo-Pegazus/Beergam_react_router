import React from "react";
import { Fields } from "~/src/components/utils/_fields";
import RadioGroup from "./RadioGroup";
import NumberInput from "./NumberInput";

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
    <div className="space-y-5 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-beergam-blue-primary">
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
          <NumberInput
            value={shippingCost}
            onChange={onShippingCostChange}
            placeholder="0,00"
            prefix="R$"
            step={0.01}
            min={0}
          />
          <p className="text-xs text-beergam-gray mt-1.5">Opcional</p>
        </Fields.wrapper>
      )}
    </div>
  );
}

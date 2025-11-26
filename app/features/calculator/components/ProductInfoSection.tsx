import React from "react";
import { Fields } from "~/src/components/utils/_fields";
import NumberInput from "./NumberInput";

interface ProductInfoSectionProps {
  salePrice: string;
  costPrice: string;
  weeklySales: string;
  onSalePriceChange: (value: string) => void;
  onCostPriceChange: (value: string) => void;
  onWeeklySalesChange: (value: string) => void;
}

export default function ProductInfoSection({
  salePrice,
  costPrice,
  weeklySales,
  onSalePriceChange,
  onCostPriceChange,
  onWeeklySalesChange,
}: ProductInfoSectionProps) {
  return (
    <div className="space-y-5 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-beergam-blue-primary">
        Informações sobre o produto
      </h2>

      <Fields.wrapper>
        <Fields.label
          text="Preço de venda"
          hint="Preço de venda do produto no marketplace"
        />
        <NumberInput
          value={salePrice}
          onChange={onSalePriceChange}
          placeholder="0,00"
          prefix="R$"
          step={0.01}
          min={0}
        />
        <p className="text-xs text-beergam-gray mt-1.5">Obrigatório</p>
      </Fields.wrapper>

      <Fields.wrapper>
        <Fields.label
          text="Preço de compra"
          hint="Preço de compra do produto"
        />
        <NumberInput
          value={costPrice}
          onChange={onCostPriceChange}
          placeholder="0,00"
          prefix="R$"
          step={0.01}
          min={0}
        />
        <p className="text-xs text-beergam-gray mt-1.5">Obrigatório</p>
      </Fields.wrapper>

      <Fields.wrapper>
        <Fields.label
          text="Média semanal de vendas"
          hint="Número médio de vendas por semana"
        />
        <NumberInput
          value={weeklySales}
          onChange={onWeeklySalesChange}
          placeholder="0"
          step={1}
          min={0}
        />
        <p className="text-xs text-beergam-gray mt-1.5">Opcional</p>
      </Fields.wrapper>
    </div>
  );
}

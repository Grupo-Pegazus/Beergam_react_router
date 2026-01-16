import { Paper } from "@mui/material";
import { Fields } from "~/src/components/utils/_fields";

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
    <Paper>
      <h2 className="text-lg font-semibold text-beergam-typography-primary">
        Informações sobre o produto
      </h2>

      <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Fields.wrapper>
          <Fields.label
            text="Preço de venda"
            hint="Preço de venda do produto no marketplace"
          />
          <Fields.input
            type="number"
            value={salePrice}
            onChange={(e) => onSalePriceChange(e.target.value)}
            placeholder="0,00"
            prefix="R$"
            step={0.01}
            min={0}
          />
        </Fields.wrapper>

        <Fields.wrapper>
          <Fields.label
            text="Preço de compra"
            hint="Preço de compra do produto"
          />
          <Fields.input
            type="number"
            value={costPrice}
            onChange={(e) => onCostPriceChange(e.target.value)}
            placeholder="0,00"
            prefix="R$"
            step={0.01}
            min={0}
          />
        </Fields.wrapper>

        <Fields.wrapper>
          <Fields.label
            text="Média semanal de vendas"
            hint="Número médio de vendas por semana"
          />
          <Fields.input
            type="number"
            value={weeklySales}
            onChange={(e) => onWeeklySalesChange(e.target.value)}
            placeholder="0"
            step={1}
            min={0}
          />
          <p className="text-xs text-beergam-gray mt-2">Opcional</p>
        </Fields.wrapper>
      </div>
    </Paper>
  );
}

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
          <Fields.numericInput
            prefix="R$"
            format="currency"
            value={salePrice === "" ? undefined : Number(salePrice)}
            onChange={(v) => onSalePriceChange(v === undefined ? "" : String(v))}
            placeholder="0,00"
            min={0}
          />
        </Fields.wrapper>

        <Fields.wrapper>
          <Fields.label
            text="Preço de compra"
            hint="Preço de compra do produto"
          />
          <Fields.numericInput
            prefix="R$"
            format="currency"
            value={costPrice === "" ? undefined : Number(costPrice)}
            onChange={(v) => onCostPriceChange(v === undefined ? "" : String(v))}
            placeholder="0,00"
            min={0}
          />
        </Fields.wrapper>

        <Fields.wrapper>
          <Fields.label
            text="Média semanal de vendas"
            hint="Número médio de vendas por semana"
          />
          <Fields.numericInput
            format="integer"
            value={weeklySales === "" ? undefined : Number(weeklySales)}
            onChange={(v) => onWeeklySalesChange(v === undefined ? "" : String(v))}
            placeholder="0"
            min={0}
          />
          <p className="text-xs text-beergam-gray mt-2">Opcional</p>
        </Fields.wrapper>
      </div>
    </Paper>
  );
}

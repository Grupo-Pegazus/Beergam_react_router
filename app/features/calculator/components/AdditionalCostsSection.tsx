import { Paper } from "@mui/material";
import { useRef } from "react";
import { Fields } from "~/src/components/utils/_fields";

interface AdditionalCostsSectionProps {
  additionalCostsAmount: string;
  additionalCostsPercentage: string;
  salePrice: string;
  onAdditionalCostsAmountChange: (value: string) => void;
  onAdditionalCostsPercentageChange: (value: string) => void;
}

export default function AdditionalCostsSection({
  additionalCostsAmount,
  additionalCostsPercentage,
  salePrice,
  onAdditionalCostsAmountChange,
  onAdditionalCostsPercentageChange,
}: AdditionalCostsSectionProps) {
  const isUpdatingFromAmount = useRef(false);
  const isUpdatingFromPercentage = useRef(false);

  const handleAmountChange = (value: string) => {
    if (isUpdatingFromPercentage.current) {
      onAdditionalCostsAmountChange(value);
      return;
    }

    isUpdatingFromAmount.current = true;
    onAdditionalCostsAmountChange(value);

    const salePriceNum = parseFloat(salePrice) || 0;
    const amountNum = parseFloat(value) || 0;

    if (salePriceNum > 0 && amountNum >= 0) {
      const calculatedPercentage = ((amountNum / salePriceNum) * 100).toFixed(
        2
      );
      const currentPercentage = parseFloat(additionalCostsPercentage) || 0;
      const calculatedPercentageNum = parseFloat(calculatedPercentage);

      if (Math.abs(calculatedPercentageNum - currentPercentage) > 0.01) {
        onAdditionalCostsPercentageChange(calculatedPercentage);
      }
    } else if (amountNum === 0 && additionalCostsPercentage !== "0") {
      onAdditionalCostsPercentageChange("0");
    }

    setTimeout(() => {
      isUpdatingFromAmount.current = false;
    }, 0);
  };

  const handlePercentageChange = (value: string) => {
    if (isUpdatingFromAmount.current) {
      onAdditionalCostsPercentageChange(value);
      return;
    }

    isUpdatingFromPercentage.current = true;
    onAdditionalCostsPercentageChange(value);

    const salePriceNum = parseFloat(salePrice) || 0;
    const percentageNum = parseFloat(value) || 0;

    if (salePriceNum > 0 && percentageNum >= 0) {
      const calculatedAmount = ((salePriceNum * percentageNum) / 100).toFixed(
        2
      );
      const currentAmount = parseFloat(additionalCostsAmount) || 0;
      const calculatedAmountNum = parseFloat(calculatedAmount);

      if (Math.abs(calculatedAmountNum - currentAmount) > 0.01) {
        onAdditionalCostsAmountChange(calculatedAmount);
      }
    } else if (percentageNum === 0 && additionalCostsAmount !== "0") {
      onAdditionalCostsAmountChange("0");
    }

    setTimeout(() => {
      isUpdatingFromPercentage.current = false;
    }, 0);
  };

  return (
    <Paper className="space-y-4">
      <h2 className="text-lg font-semibold text-beergam-typography-primary">
        Custos adicionais
      </h2>

      <Fields.wrapper>
        <Fields.label
          text="Custo adicional"
          hint="Custos adicionais em valor fixo ou percentual"
        />
        <div className="flex gap-4">
          <div className="flex-1">
            <Fields.numericInput
              value={additionalCostsAmount}
              onChange={(v) => handleAmountChange(v === undefined ? "" : String(v))}
              placeholder="0,00"
              prefix="R$"
              format="currency"
              min={0}
            />
          </div>
          <div className="flex-1">
            <Fields.numericInput
              value={additionalCostsPercentage}
              onChange={(v) => handlePercentageChange(v === undefined ? "" : String(v))}
              placeholder="0"
              prefix="%"
              format="decimal"
              decimalScale={2}
              min={0}
              max={100}
            />
          </div>
        </div>
        <p className="text-xs text-beergam-gray mt-1.5">Opcional</p>
      </Fields.wrapper>
    </Paper>
  );
}

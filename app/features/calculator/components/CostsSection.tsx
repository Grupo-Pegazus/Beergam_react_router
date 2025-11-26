import React from "react";
import { Fields } from "~/src/components/utils/_fields";
import RadioGroup from "./RadioGroup";
import NumberInput from "./NumberInput";

interface CostsSectionProps {
  adType: "classico" | "premium";
  commissionPercentage: string;
  commissionAmount: string;
  salePrice: string;
  onAdTypeChange: (value: "classico" | "premium") => void;
  onCommissionPercentageChange: (value: string) => void;
  onCommissionAmountChange: (value: string) => void;
}

export default function CostsSection({
  adType,
  commissionPercentage,
  commissionAmount,
  salePrice,
  onAdTypeChange,
  onCommissionPercentageChange,
  onCommissionAmountChange,
}: CostsSectionProps) {
  const calculatedCommission = React.useMemo(() => {
    if (!salePrice || !commissionPercentage) return "0,00";
    const price = parseFloat(salePrice) || 0;
    const percentage = parseFloat(commissionPercentage) || 0;
    return (price * (percentage / 100)).toFixed(2);
  }, [salePrice, commissionPercentage]);

  return (
    <div className="space-y-5 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-beergam-blue-primary">
        Custos
      </h2>

      <Fields.wrapper>
        <Fields.label
          text="Tipo de anúncio"
          hint="Tipo de anúncio no marketplace"
        />
        <RadioGroup
          name="adType"
          value={adType}
          options={[
            { value: "classico", label: "Clássico" },
            { value: "premium", label: "Premium" },
          ]}
          onChange={(value) => onAdTypeChange(value as "classico" | "premium")}
        />
      </Fields.wrapper>

      <Fields.wrapper>
        <Fields.label
          text="Comissão"
          hint="Porcentagem de comissão do marketplace"
        />
        <div className="flex gap-4">
          <div className="flex-1">
            <NumberInput
              value={commissionPercentage}
              onChange={onCommissionPercentageChange}
              placeholder="0"
              suffix="%"
              step={0.01}
              min={0}
            />
          </div>
          <div className="flex-1">
            <div className="px-4 py-3.5 border-2 border-gray-200 rounded-lg bg-gray-50 text-sm">
              <span className="text-beergam-gray text-xs block mb-1">
                Comissão em R$
              </span>
              <div className="text-beergam-blue-primary font-semibold text-base">
                R$ {calculatedCommission}
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-beergam-gray mt-1.5">
          É aplicada uma média de comissão
        </p>
      </Fields.wrapper>
    </div>
  );
}

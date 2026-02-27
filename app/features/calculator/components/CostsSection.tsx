import { Paper } from "@mui/material";
import { useEffect, useMemo, useRef } from "react";
import { Fields } from "~/src/components/utils/_fields";
import RadioGroup from "./RadioGroup";

interface CostsSectionProps {
  adType: "classico" | "premium" | "sem_frete_gratis" | "com_frete_gratis";
  commissionPercentage: string;
  salePrice: string;
  calculatorType: "ml" | "shopee";
  classicCommission?: number;
  premiumCommission?: number;
  onAdTypeChange: (
    value: "classico" | "premium" | "sem_frete_gratis" | "com_frete_gratis"
  ) => void;
  onCommissionPercentageChange: (value: string) => void;
}

const ML_AD_TYPE_OPTIONS = [
  { value: "classico", label: "Clássico" },
  { value: "premium", label: "Premium" },
];

export default function CostsSection({
  adType,
  commissionPercentage,
  salePrice,
  calculatorType,
  classicCommission,
  premiumCommission,
  onAdTypeChange,
  onCommissionPercentageChange,
}: CostsSectionProps) {
  const isMeli = calculatorType === "ml";
  const prevAdTypeRef = useRef(adType);

  useEffect(() => {
    if (!isMeli || !salePrice) return;

    const price = parseFloat(salePrice) || 0;
    if (price <= 0) return;

    const commissionValue =
      adType === "classico" ? classicCommission :
      adType === "premium" ? premiumCommission :
      undefined;

    if (commissionValue === undefined || commissionValue <= 0) return;

    const calculatedPercentage = ((commissionValue / price) * 100).toFixed(2);
    const shouldUpdate =
      adType !== prevAdTypeRef.current ||
      commissionPercentage !== calculatedPercentage;

    if (shouldUpdate) {
      onCommissionPercentageChange(calculatedPercentage);
    }

    prevAdTypeRef.current = adType;
  }, [
    isMeli,
    adType,
    salePrice,
    classicCommission,
    premiumCommission,
    commissionPercentage,
    onCommissionPercentageChange,
  ]);

  const calculatedCommission = useMemo(() => {
    if (!salePrice) return "0,00";
    const price = parseFloat(salePrice) || 0;

    if (isMeli && price > 0) {
      if (adType === "classico" && classicCommission !== undefined) {
        return classicCommission.toFixed(2);
      }
      if (adType === "premium" && premiumCommission !== undefined) {
        return premiumCommission.toFixed(2);
      }
    }

    if (!commissionPercentage) return "0,00";
    const percentage = parseFloat(commissionPercentage) || 0;
    return (price * (percentage / 100)).toFixed(2);
  }, [salePrice, commissionPercentage, isMeli, adType, classicCommission, premiumCommission]);

  const isCommissionFromLink =
    isMeli &&
    (classicCommission !== undefined || premiumCommission !== undefined);

  if (!isMeli) return null;

  return (
    <Paper className="space-y-4">
      <h2 className="text-lg font-semibold text-beergam-typography-primary">
        Custos
      </h2>

      <Fields.wrapper>
        <Fields.label text="Tipo de anúncio" />
        <RadioGroup
          name="adType"
          value={adType}
          options={ML_AD_TYPE_OPTIONS}
          onChange={(value) =>
            onAdTypeChange(value as "classico" | "premium")
          }
        />
      </Fields.wrapper>

      <Fields.wrapper>
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <Fields.wrapper>
              <Fields.label
                hint={
                  isCommissionFromLink
                    ? "Comissão obtida automaticamente do Mercado Livre"
                    : "É aplicada uma média de comissão"
                }
                text="Comissão"
              />
              <Fields.numericInput
                prefix="%"
                format="decimal"
                decimalScale={2}
                value={commissionPercentage === "" ? undefined : Number(commissionPercentage)}
                onChange={(v) => onCommissionPercentageChange(v === undefined ? "" : String(v))}
                placeholder="0,00"
                min={0}
                disabled={isCommissionFromLink}
              />
            </Fields.wrapper>
            <p className="text-xs text-beergam-gray mt-1.5">
              {isCommissionFromLink ? "Obtido do link do produto" : "Opcional"}
            </p>
          </div>
          <div className="flex-1">
            <Paper className="bg-beergam-section-background! flex items-center gap-2">
              <span className="text-beergam-typography-tertiary!">
                Comissão em R$
              </span>
              <div className="text-beergam-typography-primary font-semibold text-base">
                {calculatedCommission}
              </div>
            </Paper>
          </div>
        </div>
      </Fields.wrapper>
    </Paper>
  );
}

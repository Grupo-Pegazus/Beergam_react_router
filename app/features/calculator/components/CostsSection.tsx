import { useRef, useEffect, useMemo } from "react";
import { Fields } from "~/src/components/utils/_fields";
import RadioGroup from "./RadioGroup";
import NumberInput from "./NumberInput";

interface CostsSectionProps {
  adType: "classico" | "premium" | "normal" | "indicado";
  commissionPercentage: string;
  salePrice: string;
  calculatorType: "ml" | "shopee";
  classicCommission?: number;
  premiumCommission?: number;
  onAdTypeChange: (value: "classico" | "premium" | "normal" | "indicado") => void;
  onCommissionPercentageChange: (value: string) => void;
}

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
  const isShopee = calculatorType === "shopee";
  const isMeli = calculatorType === "ml";
  const prevAdTypeRef = useRef(adType);
  const prevCalculatorTypeRef = useRef(calculatorType);

  // Para Shopee, definir porcentagem fixa baseada no tipo de taxa
  useEffect(() => {
    if (isShopee) {
      const fixedPercentage = adType === "normal" ? "14" : adType === "indicado" ? "20" : "14";
      // Só atualizar se o adType ou calculatorType mudou
      if (
        adType !== prevAdTypeRef.current ||
        calculatorType !== prevCalculatorTypeRef.current
      ) {
        if (commissionPercentage !== fixedPercentage) {
          onCommissionPercentageChange(fixedPercentage);
        }
      }
    }
    prevAdTypeRef.current = adType;
    prevCalculatorTypeRef.current = calculatorType;
  }, [isShopee, adType, calculatorType, commissionPercentage, onCommissionPercentageChange]);

  // Para Meli, quando há comissões salvas e o usuário muda o tipo de anúncio,
  // atualizar automaticamente a porcentagem baseada na comissão em R$
  useEffect(() => {
    if (isMeli && salePrice) {
      const price = parseFloat(salePrice) || 0;
      if (price > 0) {
        let commissionValue: number | undefined;

        // Seleciona a comissão baseada no tipo de anúncio atual
        if (adType === "classico" && classicCommission !== undefined) {
          commissionValue = classicCommission;
        } else if (adType === "premium" && premiumCommission !== undefined) {
          commissionValue = premiumCommission;
        }

        // Se temos uma comissão salva para o tipo selecionado, atualiza a porcentagem automaticamente
        if (commissionValue !== undefined && commissionValue > 0) {
          const calculatedPercentage = ((commissionValue / price) * 100).toFixed(2);
          
          // Atualiza quando:
          // 1. Mudou o tipo de anúncio OU
          // 2. A porcentagem atual é diferente da calculada (caso o preço tenha mudado)
          const shouldUpdate =
            adType !== prevAdTypeRef.current ||
            commissionPercentage !== calculatedPercentage;

          if (shouldUpdate) {
            onCommissionPercentageChange(calculatedPercentage);
          }
        }
      }
    }
    // Atualiza a referência após processar
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
    
    // Se temos comissão salva para o tipo selecionado, usar ela diretamente
    if (isMeli && price > 0) {
      if (adType === "classico" && classicCommission !== undefined) {
        return classicCommission.toFixed(2);
      }
      if (adType === "premium" && premiumCommission !== undefined) {
        return premiumCommission.toFixed(2);
      }
    }
    
    // Caso contrário, calcular pela porcentagem
    if (!commissionPercentage) return "0,00";
    const percentage = parseFloat(commissionPercentage) || 0;
    return (price * (percentage / 100)).toFixed(2);
  }, [salePrice, commissionPercentage, isMeli, adType, classicCommission, premiumCommission]);

  const getAdTypeOptions = () => {
    if (isShopee) {
      return [
        { value: "normal", label: "Normal" },
        { value: "indicado", label: "Indicado" },
      ];
    }
    return [
      { value: "classico", label: "Clássico" },
      { value: "premium", label: "Premium" },
    ];
  };

  const getAdTypeLabel = () => {
    return isShopee ? "Tipo de taxa" : "Tipo de anúncio";
  };

  const getCommissionLabel = () => {
    return isShopee ? "Taxa" : "Comissão";
  };
  return (
    <div className="space-y-5 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-beergam-blue-primary">
        Custos
      </h2>

      <Fields.wrapper>
        <Fields.label
          text={getAdTypeLabel()}
        />
        <RadioGroup
          name="adType"
          value={adType}
          options={getAdTypeOptions()}
          onChange={(value) => onAdTypeChange(value as "classico" | "premium" | "normal" | "indicado")}
        />
      </Fields.wrapper>

      <Fields.wrapper>
        <Fields.label
          text={getCommissionLabel()}
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
              disabled={isShopee}
            />
          </div>
          <div className="flex-1">
            <div className="px-4 py-3.5 border-2 border-gray-200 rounded-lg bg-gray-50 text-sm">
              <span className="text-beergam-gray text-xs block mb-1">
                {isShopee ? "Taxa em R$" : "Comissão em R$"}
              </span>
              <div className="text-beergam-blue-primary font-semibold text-base">
                R$ {calculatedCommission}
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-beergam-gray mt-1.5">
          {isShopee 
            ? "A taxa é fixa conforme o tipo selecionado" 
            : (classicCommission !== undefined || premiumCommission !== undefined)
            ? "Comissão obtida automaticamente do Mercado Livre"
            : "É aplicada uma média de comissão"}
        </p>
      </Fields.wrapper>
    </div>
  );
}

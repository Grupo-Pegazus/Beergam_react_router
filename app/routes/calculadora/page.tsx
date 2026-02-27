import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router";
import CalculatorForm from "~/features/calculator/components/CalculatorForm";
import CalculatorResults from "~/features/calculator/components/CalculatorResults";
import { calculatorService } from "~/features/calculator/service";
import type {
  CalculatorFormData,
  CalculatorRequest,
  CalculatorResponse,
  ISavedCalculation,
} from "~/features/calculator/typings";
import BeergamButton from "~/src/components/utils/BeergamButton";

const initialFormData: CalculatorFormData = {
  productLink: "",
  salePrice: "",
  costPrice: "",
  weeklySales: "",
  freeShipping: true,
  shippingCost: "",
  adType: "classico",
  commissionPercentage: "",
  taxRegime: "",
  annualRevenue: "",
  taxesPercentage: "",
  additionalCostsAmount: "",
  additionalCostsPercentage: "",
  calculatorType: "ml",
  classicCommission: undefined,
  premiumCommission: undefined,
  sellerType: "cnpj",
  paymentMethod: "outros",
  ordersLast90Days: "",
  highlightCampaign: false,
  freightCouponValue: "",
};

function numToStr(value: number | undefined | null): string {
  return value != null && value !== 0 ? String(value) : "";
}

function restoreFormData(saved: ISavedCalculation): CalculatorFormData {
  const input = saved.input_payload as CalculatorRequest;
  const type = saved.type_calculator === "meli" ? "ml" : "shopee";
  return {
    ...initialFormData,
    calculatorType: type,
    salePrice: numToStr(input.sale_price),
    costPrice: numToStr(input.cost_price),
    weeklySales: numToStr(input.weekly_sales),
    shippingCost: numToStr(input.shipping_cost),
    freeShipping: !input.shipping_cost,
    adType: input.typeAd ?? (type === "ml" ? "classico" : "sem_frete_gratis"),
    commissionPercentage: numToStr(input.ml_fee_percentage),
    taxesPercentage: numToStr(input.fiscal_tributes),
    additionalCostsAmount: numToStr(input.additional_costs_amount),
    additionalCostsPercentage: numToStr(input.additional_costs_percentage),
    sellerType: input.seller_type ?? "cnpj",
    paymentMethod: input.payment_method ?? "outros",
    ordersLast90Days: numToStr(input.orders_last_90_days),
    highlightCampaign: input.highlight_campaign ?? false,
    freightCouponValue: numToStr(input.freight_coupon_value),
  };
}

export default function CalculadoraPage() {
  const location = useLocation();
  const initialSaved = (location.state as { savedCalculation?: ISavedCalculation } | null)
    ?.savedCalculation;

  const [savedCalculation, setSavedCalculation] = useState<ISavedCalculation | undefined>(initialSaved);
  const [formData, setFormData] = useState<CalculatorFormData>(initialFormData);
  const [restoredResult, setRestoredResult] = useState<CalculatorResponse | null>(null);

  // Restaurar dados do cálculo salvo ao montar (dependência vazia intencional: só executa uma vez)
  useEffect(() => {
    if (initialSaved) {
      setFormData(restoreFormData(initialSaved));
      setRestoredResult(initialSaved.output_payload as CalculatorResponse);
    }
  }, []);

  // Ajustar adType quando mudar de ML para Shopee ou vice-versa
  useEffect(() => {
    if (formData.calculatorType === "shopee") {
      if (formData.adType === "classico" || formData.adType === "premium") {
        setFormData((prev) => ({ ...prev, adType: "sem_frete_gratis" }));
      }
    } else {
      if (
        formData.adType === "sem_frete_gratis" ||
        formData.adType === "com_frete_gratis"
      ) {
        setFormData((prev) => ({ ...prev, adType: "classico" }));
      }
    }
  }, [formData.calculatorType]);

  const calculateMutation = useMutation({
    mutationFn: (data: CalculatorRequest) =>
      calculatorService.calculateFullListing(data),
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Erro ao calcular");
        return;
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao calcular");
    },
  });

  const handleFormDataChange = useCallback(
    (data: Partial<CalculatorFormData>) => {
      setFormData((prev) => ({ ...prev, ...data }));
    },
    []
  );

  const calculateCommissionAmount = useMemo(() => {
    if (!formData.salePrice || !formData.commissionPercentage) {
      return "0";
    }
    const salePrice = parseFloat(formData.salePrice) || 0;
    const percentage = parseFloat(formData.commissionPercentage) || 0;
    return (salePrice * (percentage / 100)).toFixed(2);
  }, [formData.salePrice, formData.commissionPercentage]);

  const handleCalculate = useCallback(() => {
    const salePrice = parseFloat(formData.salePrice);
    const costPrice = parseFloat(formData.costPrice);
    const mlFeePercentage = parseFloat(formData.commissionPercentage) || 0;
    const mlFeeAmount = parseFloat(calculateCommissionAmount) || 0;
    const weeklySales = parseInt(formData.weeklySales) || 0;
    const shippingCost = formData.freeShipping
      ? 0
      : parseFloat(formData.shippingCost) || 0;
    const fiscalTributes = parseFloat(formData.taxesPercentage) || 0;
    const additionalCostsAmount =
      parseFloat(formData.additionalCostsAmount) || 0;
    const additionalCostsPercentage =
      parseFloat(formData.additionalCostsPercentage) || 0;

    if (!salePrice || !costPrice) {
      toast.error(
        "Preencha os campos obrigatórios: Preço de venda e Preço de compra"
      );
      return;
    }

    const isShopee = formData.calculatorType === "shopee";

    if (!isShopee && !mlFeePercentage && !mlFeeAmount) {
      toast.error("Preencha a comissão (porcentagem ou valor)");
      return;
    }

    const requestData: CalculatorRequest = {
      sale_price: salePrice,
      cost_price: costPrice,
      ml_fee_percentage: mlFeePercentage,
      ml_fee_amount: mlFeeAmount,
      weekly_sales: weeklySales,
      shipping_cost: shippingCost,
      fiscal_tributes: fiscalTributes,
      additional_costs_amount: additionalCostsAmount,
      additional_costs_percentage: additionalCostsPercentage,
      calculator_type: formData.calculatorType,
      typeAd: formData.adType,
      ...(isShopee && {
        seller_type: formData.sellerType,
        payment_method: formData.paymentMethod,
        orders_last_90_days: parseInt(formData.ordersLast90Days) || 0,
        highlight_campaign: formData.highlightCampaign,
        freight_coupon_value: parseFloat(formData.freightCouponValue) || 0,
      }),
    };

    setRestoredResult(null);
    calculateMutation.mutate(requestData);
  }, [formData, calculateCommissionAmount, calculateMutation]);

  return (
    <>
      <p className="text-sm text-beergam-typography-secondary! mb-6">
        Avalie a rentabilidade dos produtos com a nossa calculadora para
        aumentar seu lucro em cada venda
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 items-start">
        <div className="space-y-4">
          <CalculatorForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />
          <div className="sticky bottom-0 py-3 flex justify-end bg-beergam-layout-background z-10">
            <BeergamButton
              title={calculateMutation.isPending ? "Calculando..." : "Calcular"}
              animationStyle="slider"
              onClick={handleCalculate}
              disabled={calculateMutation.isPending}
              fetcher={{
                fecthing: calculateMutation.isPending,
                completed: false,
                error: false,
                mutation: calculateMutation,
              }}
            />
          </div>
        </div>

        <CalculatorResults
          results={calculateMutation.data?.data ?? restoredResult}
          formData={{
            salePrice: formData.salePrice,
            weeklySales: formData.weeklySales,
          }}
          calculatorType={formData.calculatorType}
          inputPayload={calculateMutation.variables ?? (savedCalculation?.input_payload as CalculatorRequest | undefined)}
          savedCalculation={savedCalculation}
          onSavedCalculationUpdate={setSavedCalculation}
        />
      </div>
    </>
  );
}

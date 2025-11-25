import { useState, useCallback, useMemo, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Grid from "~/src/components/ui/Grid";
import CalculatorForm from "~/features/calculator/components/CalculatorForm";
import CalculatorResults from "~/features/calculator/components/CalculatorResults";
import { calculatorService } from "~/features/calculator/service";
import type {
  CalculatorFormData,
  CalculatorRequest,
} from "~/features/calculator/typings";

const initialFormData: CalculatorFormData = {
  productLink: "",
  salePrice: "",
  costPrice: "",
  weeklySales: "",
  freeShipping: true,
  shippingCost: "",
  adType: "classico",
  commissionPercentage: "",
  commissionAmount: "",
  taxRegime: "",
  annualRevenue: "",
  taxesPercentage: "",
  additionalCostsAmount: "",
  additionalCostsPercentage: "",
  calculatorType: "ml",
};

export default function CalculadoraPage() {
  const [formData, setFormData] = useState<CalculatorFormData>(initialFormData);

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

    if (!mlFeePercentage && !mlFeeAmount) {
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
    };

    calculateMutation.mutate(requestData);
  }, [formData, calculateCommissionAmount, calculateMutation]);

  useEffect(() => {
    if (calculateCommissionAmount !== formData.commissionAmount) {
      setFormData((prev) => ({
        ...prev,
        commissionAmount: calculateCommissionAmount,
      }));
    }
  }, [calculateCommissionAmount]);

  return (
    <>
      <p className="text-sm text-beergam-gray mb-6">
        Avalie a rentabilidade dos produtos com a nossa calculadora para
        aumentar seu lucro em cada venda
      </p>

      <Grid cols={{ base: 1, lg: 2 }} gap={6}>
        <div className="relative">
          <CalculatorForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />
          <div className="sticky bottom-4 mt-6 flex justify-end z-10">
            <button
              type="button"
              onClick={handleCalculate}
              disabled={calculateMutation.isPending}
              className="px-8 py-3 bg-beergam-orange text-white rounded-lg hover:bg-beergam-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
            >
              {calculateMutation.isPending ? "Calculando..." : "Calcular"}
            </button>
          </div>
        </div>

        <div>
          <CalculatorResults
            results={calculateMutation.data?.data || null}
            formData={{
              salePrice: formData.salePrice,
              weeklySales: formData.weeklySales,
            }}
          />
        </div>
      </Grid>
    </>
  );
}

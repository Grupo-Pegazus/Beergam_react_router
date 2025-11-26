import type { CalculatorFormData } from "../typings";
import MarketplaceSelector from "./MarketplaceSelector";
import ProductInfoSection from "./ProductInfoSection";
import CostsSection from "./CostsSection";
import ShippingSection from "./ShippingSection";
import TaxesSection from "./TaxesSection";
import AdditionalCostsSection from "./AdditionalCostsSection";

interface CalculatorFormProps {
  formData: CalculatorFormData;
  onFormDataChange: (data: Partial<CalculatorFormData>) => void;
}

export default function CalculatorForm({
  formData,
  onFormDataChange,
}: CalculatorFormProps) {
  const updateField = <K extends keyof CalculatorFormData>(
    field: K,
    value: CalculatorFormData[K]
  ) => {
    onFormDataChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <MarketplaceSelector
          value={formData.calculatorType}
          onChange={(value) => updateField("calculatorType", value)}
        />
      </div>

      <ProductInfoSection
        salePrice={formData.salePrice}
        costPrice={formData.costPrice}
        weeklySales={formData.weeklySales}
        onSalePriceChange={(value) => updateField("salePrice", value)}
        onCostPriceChange={(value) => updateField("costPrice", value)}
        onWeeklySalesChange={(value) => updateField("weeklySales", value)}
      />

      <CostsSection
        adType={formData.adType}
        commissionPercentage={formData.commissionPercentage}
        commissionAmount={formData.commissionAmount}
        salePrice={formData.salePrice}
        onAdTypeChange={(value) => updateField("adType", value)}
        onCommissionPercentageChange={(value) =>
          updateField("commissionPercentage", value)
        }
        onCommissionAmountChange={(value) =>
          updateField("commissionAmount", value)
        }
      />

      <ShippingSection
        freeShipping={formData.freeShipping}
        shippingCost={formData.shippingCost}
        onFreeShippingChange={(value) => updateField("freeShipping", value)}
        onShippingCostChange={(value) => updateField("shippingCost", value)}
      />

      <TaxesSection
        taxRegime={formData.taxRegime}
        annualRevenue={formData.annualRevenue}
        taxesPercentage={formData.taxesPercentage}
        onTaxRegimeChange={(value) => updateField("taxRegime", value)}
        onAnnualRevenueChange={(value) => updateField("annualRevenue", value)}
        onTaxesPercentageChange={(value) =>
          updateField("taxesPercentage", value)
        }
      />

      <AdditionalCostsSection
        additionalCostsAmount={formData.additionalCostsAmount}
        additionalCostsPercentage={formData.additionalCostsPercentage}
        salePrice={formData.salePrice}
        onAdditionalCostsAmountChange={(value) =>
          updateField("additionalCostsAmount", value)
        }
        onAdditionalCostsPercentageChange={(value) =>
          updateField("additionalCostsPercentage", value)
        }
      />
    </div>
  );
}

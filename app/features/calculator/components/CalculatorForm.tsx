import type { CalculatorFormData } from "../typings";
import MarketplaceSelector from "./MarketplaceSelector";
import MeliProductLinkSection from "./MeliProductLinkSection";
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

      {formData.calculatorType === "ml" && (
        <MeliProductLinkSection
          productLink={formData.productLink}
          onProductLinkChange={(value) => updateField("productLink", value)}
          onProductDataLoaded={(data) => {
            // Atualiza preço de venda
            updateField("salePrice", data.salePrice);
            
            // Atualiza comissões salvas (essas serão aplicadas automaticamente no CostsSection)
            if (data.classicCommission !== undefined) {
              updateField("classicCommission", data.classicCommission);
            }
            if (data.premiumCommission !== undefined) {
              updateField("premiumCommission", data.premiumCommission);
            }
            
            // A porcentagem será calculada automaticamente no CostsSection
            // baseada no tipo de anúncio selecionado e nas comissões salvas
          }}
        />
      )}

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
        salePrice={formData.salePrice}
        calculatorType={formData.calculatorType}
        classicCommission={formData.classicCommission}
        premiumCommission={formData.premiumCommission}
        onAdTypeChange={(value) => updateField("adType", value)}
        onCommissionPercentageChange={(value) =>
          updateField("commissionPercentage", value)
        }
      />

        {formData.calculatorType === "ml" && (
          <ShippingSection
            freeShipping={formData.freeShipping}
            shippingCost={formData.shippingCost}
            onFreeShippingChange={(value) => updateField("freeShipping", value)}
            onShippingCostChange={(value) => updateField("shippingCost", value)}
          />
        )}

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

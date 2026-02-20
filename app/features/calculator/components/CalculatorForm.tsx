import type { CalculatorFormData } from "../typings";
import AdditionalCostsSection from "./AdditionalCostsSection";
import CostsSection from "./CostsSection";
import MarketplaceSelector from "./MarketplaceSelector";
import MeliProductLinkSection from "./MeliProductLinkSection";
import ProductInfoSection from "./ProductInfoSection";
import ShippingSection from "./ShippingSection";
import TaxesSection from "./TaxesSection";

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
    <>
      <MarketplaceSelector
        value={formData.calculatorType}
        onChange={(value) => updateField("calculatorType", value)}
      />

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </>
  );
}

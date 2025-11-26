import React from "react";
import { Fields } from "~/src/components/utils/_fields";
import NumberInput from "./NumberInput";

interface TaxesSectionProps {
  taxRegime: string;
  annualRevenue: string;
  taxesPercentage: string;
  onTaxRegimeChange: (value: string) => void;
  onAnnualRevenueChange: (value: string) => void;
  onTaxesPercentageChange: (value: string) => void;
}

const TAX_REGIME_OPTIONS = [
  { value: "", label: "Selecione" },
  { value: "simples_nacional", label: "Simples Nacional" },
  { value: "lucro_presumido", label: "Lucro Presumido" },
  { value: "lucro_real", label: "Lucro Real" },
];

const ANNUAL_REVENUE_OPTIONS = [
  { value: "", label: "Selecione" },
  { value: "1", label: "Até R$ 180.000,00" },
  { value: "2", label: "De R$ 180.000,01 a R$ 360.000,00" },
  { value: "3", label: "De R$ 360.000,01 a R$ 720.000,00" },
  { value: "4", label: "De R$ 720.000,01 a R$ 1.800.000,00" },
  { value: "5", label: "De R$ 1.800.000,01 a R$ 3.600.000,00" },
  { value: "6", label: "De R$ 3.600.000,01 a R$ 4.800.000,00" },
];

function getTaxPercentageByAnnualRevenue(value: string): string {
  switch (value) {
    case "1":
      return "4"; // Até R$ 180.000,00
    case "2":
      return "7.30"; // De R$ 180.000,01 a R$ 360.000,00
    case "3":
      return "9.50"; // De R$ 360.000,01 a R$ 720.000,00
    case "4":
      return "10.70"; // De R$ 720.000,01 a R$ 1.800.000,00
    case "5":
      return "14.30"; // De R$ 1.800.000,01 a R$ 3.600.000,00
    case "6":
      return "19"; // De R$ 3.600.000,01 a R$ 4.800.000,00
    default:
      return "";
  }
}

export default function TaxesSection({
  taxRegime,
  annualRevenue,
  taxesPercentage,
  onTaxRegimeChange,
  onAnnualRevenueChange,
  onTaxesPercentageChange,
}: TaxesSectionProps) {
  const isSimplesNacional = taxRegime === "simples_nacional";
  const showAnnualRevenue = isSimplesNacional;

  const handleTaxRegimeChange = (value: string) => {
    onTaxRegimeChange(value);

    if (value !== "simples_nacional") {
      // Se não for Simples Nacional, limpa os campos
      onAnnualRevenueChange("");
      onTaxesPercentageChange("");
    } else if (annualRevenue) {
      // Se for Simples Nacional e já tiver faturamento selecionado, atualiza impostos
      const taxValue = getTaxPercentageByAnnualRevenue(annualRevenue);
      if (taxValue) {
        onTaxesPercentageChange(taxValue);
      }
    }
  };

  const handleAnnualRevenueChange = (value: string) => {
    onAnnualRevenueChange(value);

    if (value) {
      const taxValue = getTaxPercentageByAnnualRevenue(value);
      if (taxValue) {
        onTaxesPercentageChange(taxValue);
      }
    } else {
      onTaxesPercentageChange("");
    }
  };

  return (
    <div className="space-y-5 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-beergam-blue-primary">
        Impostos
      </h2>

      <Fields.wrapper>
        <Fields.label
          text="Regime Fiscal"
          hint="Regime fiscal da empresa"
        />
        <Fields.select
          value={taxRegime}
          options={TAX_REGIME_OPTIONS}
          onChange={(e) => handleTaxRegimeChange(e.target.value)}
        />
        <p className="text-xs text-beergam-gray mt-1.5">Opcional</p>
      </Fields.wrapper>

      {showAnnualRevenue && (
        <Fields.wrapper>
          <Fields.label
            text="Faturamento bruto anual"
            hint="Faturamento bruto anual da empresa"
          />
          <Fields.select
            value={annualRevenue}
            options={ANNUAL_REVENUE_OPTIONS}
            onChange={(e) => handleAnnualRevenueChange(e.target.value)}
          />
          <p className="text-xs text-beergam-gray mt-1.5">Opcional</p>
        </Fields.wrapper>
      )}

      <Fields.wrapper>
        <Fields.label
          text="Impostos"
          hint="Porcentagem de impostos sobre a venda"
        />
        <NumberInput
          value={taxesPercentage}
          onChange={onTaxesPercentageChange}
          placeholder="0"
          suffix="%"
          step={0.01}
          min={0}
        />
        <p className="text-xs text-beergam-gray mt-1.5">
          {isSimplesNacional ? "Preenchido automaticamente" : "Opcional"}
        </p>
      </Fields.wrapper>
    </div>
  );
}
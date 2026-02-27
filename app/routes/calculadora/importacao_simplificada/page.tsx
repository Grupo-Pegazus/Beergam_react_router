import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import type { ISavedCalculation } from "~/features/calculator/typings";
import ImportacaoSimplificadaForm from "~/features/importacao_simplificada/components/ImportacaoSimplificadaForm";
import ImportacaoSimplificadaResults from "~/features/importacao_simplificada/components/ImportacaoSimplificadaResults";
import { calculateImportacaoSimplificada } from "~/features/importacao_simplificada/utils/calculateImportacao";
import type { ImportacaoSimplificadaFormData } from "~/features/importacao_simplificada/typings";

const createInitialProduct = () => ({
  id: `product-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  name: "",
  quantity: "30",
  unitPriceUsd: "15",
});

const initialFormData: ImportacaoSimplificadaFormData = {
  products: [createInitialProduct()],
  exchangeRate: "5",
  cargoWeightKg: "30",
  freightCostPerKgUsd: "20",
  icmsPercentage: "18",
  declarationType: "100",
  declarationCustomPercentage: "50",
};

function restoreFormData(saved: ISavedCalculation): ImportacaoSimplificadaFormData {
  const input = saved.input_payload as unknown as ImportacaoSimplificadaFormData;
  return {
    products: input.products ?? initialFormData.products,
    exchangeRate: input.exchangeRate ?? initialFormData.exchangeRate,
    cargoWeightKg: input.cargoWeightKg ?? initialFormData.cargoWeightKg,
    freightCostPerKgUsd: input.freightCostPerKgUsd ?? initialFormData.freightCostPerKgUsd,
    icmsPercentage: input.icmsPercentage ?? initialFormData.icmsPercentage,
    declarationType: input.declarationType ?? initialFormData.declarationType,
    declarationCustomPercentage: input.declarationCustomPercentage ?? initialFormData.declarationCustomPercentage,
  };
}

export default function ImportacaoSimplificadaPage() {
  const location = useLocation();
  const initialSaved = (location.state as { savedCalculation?: ISavedCalculation } | null)
    ?.savedCalculation;

  const [savedCalculation, setSavedCalculation] = useState<ISavedCalculation | undefined>(undefined);
  const [formData, setFormData] = useState<ImportacaoSimplificadaFormData>(initialFormData);

  // Restaurar dados do cálculo salvo ao montar (dependência vazia intencional: só executa uma vez)
  useEffect(() => {
    if (initialSaved) {
      setSavedCalculation(initialSaved);
      setFormData(restoreFormData(initialSaved));
    }
  }, []);

  const handleFormDataChange = useCallback(
    (data: Partial<ImportacaoSimplificadaFormData>) => {
      setFormData((prev) => ({ ...prev, ...data }));
    },
    []
  );

  const result = useMemo(
    () => calculateImportacaoSimplificada(formData),
    [formData]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 items-start">
      <ImportacaoSimplificadaForm
        formData={formData}
        onFormDataChange={handleFormDataChange}
      />
      <ImportacaoSimplificadaResults
        result={result}
        formData={formData}
        savedCalculation={savedCalculation}
        onSavedCalculationUpdate={setSavedCalculation}
      />
    </div>
  );
}

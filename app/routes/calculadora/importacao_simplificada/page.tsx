import { useCallback, useMemo, useState } from "react";
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

export default function ImportacaoSimplificadaPage() {
  const [formData, setFormData] = useState<ImportacaoSimplificadaFormData>(initialFormData);

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
    <>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        <div>
          <ImportacaoSimplificadaForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />
        </div>

        <div>
          <ImportacaoSimplificadaResults result={result} />
        </div>
      </div>
    </>
  );
}

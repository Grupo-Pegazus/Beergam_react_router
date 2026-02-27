import { Paper } from "@mui/material";
import Svg from "~/src/assets/svgs/_index";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { Fields } from "~/src/components/utils/_fields";
import RadioGroup from "~/features/calculator/components/RadioGroup";
import type {
  ImportacaoSimplificadaFormData,
  ImportacaoSimplificadaProduct,
} from "../typings";

interface ImportacaoSimplificadaFormProps {
  formData: ImportacaoSimplificadaFormData;
  onFormDataChange: (data: Partial<ImportacaoSimplificadaFormData>) => void;
}

const DECLARATION_TYPE_OPTIONS = [
  { value: "100", label: "100% do Valor (Recomendado)" },
  { value: "custom", label: "Valor Personalizado" },
];

function generateProductId(): string {
  return `product-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function ImportacaoSimplificadaForm({
  formData,
  onFormDataChange,
}: ImportacaoSimplificadaFormProps) {
  const updateField = <K extends keyof ImportacaoSimplificadaFormData>(
    field: K,
    value: ImportacaoSimplificadaFormData[K]
  ) => {
    onFormDataChange({ [field]: value });
  };

  const updateProduct = (
    productId: string,
    updates: Partial<ImportacaoSimplificadaProduct>
  ) => {
    const products = (formData.products || []).map((p) =>
      p.id === productId ? { ...p, ...updates } : p
    );
    updateField("products", products);
  };

  const addProduct = () => {
    updateField("products", [
      ...(formData.products || []),
      { id: generateProductId(), name: "", quantity: "1", unitPriceUsd: "" },
    ]);
  };

  const removeProduct = (productId: string) => {
    updateField(
      "products",
      (formData.products || []).filter((p) => p.id !== productId)
    );
  };

  const products = formData.products || [];

  return (
    <div className="space-y-4">
      <Paper className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-beergam-typography-primary">
            Produtos da importação
          </h2>
          <BeergamButton
            title="Adicionar produto"
            animationStyle="fade"
            onClick={addProduct}
            icon="plus"
          />
        </div>

        <div className="space-y-3">
          {products.length === 0 ? (
            <p className="text-sm text-beergam-typography-secondary py-2">
              Nenhum produto adicionado. Clique em &quot;Adicionar produto&quot; para começar.
            </p>
          ) : (
            products.map((product, index) => {
              const qty = parseInt(product.quantity, 10) || 0;
              const price = parseFloat(product.unitPriceUsd) || 0;
              const totalUsd = qty * price;

              return (
                <div
                  key={product.id}
                  className="p-3 rounded-lg border border-beergam-input-border bg-beergam-section-background/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-beergam-typography-primary">
                      Produto {index + 1}
                    </span>
                    {products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProduct(product.id)}
                        className="p-1.5 rounded text-beergam-gray hover:text-beergam-red hover:bg-beergam-red/10 transition-colors"
                        aria-label="Remover produto"
                      >
                        <Svg.trash width={16} height={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Fields.wrapper>
                      <Fields.label text="Nome do produto" />
                      <Fields.input
                        type="text"
                        value={product.name}
                        onChange={(e) =>
                          updateProduct(product.id, { name: e.target.value })
                        }
                        placeholder="Ex: Camiseta Básica"
                      />
                    </Fields.wrapper>

                    <Fields.wrapper>
                      <Fields.label text="Quantidade" />
                      <Fields.numericInput
                        format="integer"
                        value={product.quantity === "" ? undefined : Number(product.quantity)}
                        onChange={(v) =>
                          updateProduct(product.id, { quantity: v === undefined ? "" : String(v) })
                        }
                        placeholder="Ex: 10"
                        min={1}
                      />
                    </Fields.wrapper>

                    <Fields.wrapper>
                      <Fields.label text="Preço unit. (USD)" />
                      <Fields.numericInput
                        format="decimal"
                        decimalScale={2}
                        value={product.unitPriceUsd === "" ? undefined : product.unitPriceUsd}
                        onChange={(v) =>
                          updateProduct(product.id, { unitPriceUsd: v === undefined ? "" : String(v) })
                        }
                        placeholder="Ex: 1,50"
                        min={0}
                      />
                    </Fields.wrapper>
                  </div>

                  {totalUsd > 0 && (
                    <p className="text-xs text-beergam-typography-secondary">
                      Total: ${totalUsd.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </Paper>

      <Paper className="space-y-4">
        <h2 className="text-lg font-semibold text-beergam-typography-primary">
          Frete e impostos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Fields.wrapper>
            <Fields.label text="Taxa de câmbio (R$/USD)" hint="Cotação do dólar em reais" />
            <Fields.numericInput
              format="decimal"
              decimalScale={2}
              value={formData.exchangeRate === "" ? undefined : formData.exchangeRate}
              onChange={(v) => updateField("exchangeRate", v === undefined ? "" : String(v))}
              placeholder="Ex: 5,55"
              min={0}
            />
          </Fields.wrapper>

          <Fields.wrapper>
            <Fields.label text="Peso da carga (kg)" hint="Peso total em quilogramas" />
            <Fields.numericInput
              format="decimal"
              decimalScale={2}
              value={formData.cargoWeightKg === "" ? undefined : formData.cargoWeightKg}
              onChange={(v) => updateField("cargoWeightKg", v === undefined ? "" : String(v))}
              placeholder="Ex: 30"
              min={0}
            />
          </Fields.wrapper>

          <Fields.wrapper>
            <Fields.label text="Custo do frete/kg (USD)" hint="Custo por quilograma em dólares" />
            <Fields.numericInput
              format="decimal"
              decimalScale={2}
              value={formData.freightCostPerKgUsd === "" ? undefined : formData.freightCostPerKgUsd}
              onChange={(v) => updateField("freightCostPerKgUsd", v === undefined ? "" : String(v))}
              placeholder="Ex: 20"
              min={0}
            />
          </Fields.wrapper>

          <Fields.wrapper>
            <Fields.label text="ICMS de destino (%)" hint="Alíquota de ICMS do estado de destino" />
            <Fields.numericInput
              prefix="%"
              format="decimal"
              decimalScale={2}
              value={formData.icmsPercentage === "" ? undefined : Number(formData.icmsPercentage)}
              onChange={(v) => updateField("icmsPercentage", v === undefined ? "" : String(v))}
              placeholder="Ex: 18"
              min={0}
              max={100}
            />
          </Fields.wrapper>
        </div>

        <Fields.wrapper>
          <Fields.label
            text="Tipo de declaração"
            hint="Valor declarado na alfândega para cálculo dos impostos"
          />
          <RadioGroup
            name="declarationType"
            value={formData.declarationType}
            options={DECLARATION_TYPE_OPTIONS}
            onChange={(value) =>
              updateField("declarationType", value as "100" | "custom")
            }
          />
          {formData.declarationType === "custom" && (
            <div className="mt-3 max-w-[180px]">
              <Fields.numericInput
                prefix="%"
                format="decimal"
                decimalScale={2}
                value={
                  formData.declarationCustomPercentage === ""
                    ? undefined
                    : formData.declarationCustomPercentage
                }
                onChange={(v) =>
                  updateField("declarationCustomPercentage", v === undefined ? "" : String(v))
                }
                placeholder="Ex: 50"
                min={1}
                max={100}
              />
            </div>
          )}
        </Fields.wrapper>
      </Paper>
    </div>
  );
}

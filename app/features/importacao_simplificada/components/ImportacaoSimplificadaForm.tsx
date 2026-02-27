import { Paper } from "@mui/material";
import { Fields } from "~/src/components/utils/_fields";
import type {
  ImportacaoSimplificadaFormData,
  ImportacaoSimplificadaProduct,
} from "../typings";
import Svg from "~/src/assets/svgs/_index";

interface ImportacaoSimplificadaFormProps {
  formData: ImportacaoSimplificadaFormData;
  onFormDataChange: (data: Partial<ImportacaoSimplificadaFormData>) => void;
}

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
    const products = formData.products || [];
    updateField("products", [
      ...products,
      {
        id: generateProductId(),
        name: "",
        quantity: "1",
        unitPriceUsd: "",
      },
    ]);
  };

  const removeProduct = (productId: string) => {
    const products = (formData.products || []).filter((p) => p.id !== productId);
    updateField("products", products);
  };

  const products = formData.products || [];

  return (
    <div className="space-y-4">
      <Paper className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-beergam-typography-primary">
            Produtos da Importação
          </h3>
          <button
            type="button"
            onClick={addProduct}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-beergam-orange text-white font-medium text-sm hover:bg-beergam-orange-dark transition-colors"
          >
            <Svg.plus tailWindClasses="w-4 h-4" />
            Adicionar Produto
          </button>
        </div>

        <div className="space-y-4">
          {products.length === 0 ? (
            <p className="text-sm text-beergam-typography-secondary py-4">
              Nenhum produto adicionado. Clique em &quot;Adicionar Produto&quot;
              para começar.
            </p>
          ) : (
            products.map((product, index) => {
              const qty = parseInt(product.quantity, 10) || 0;
              const price = parseFloat(product.unitPriceUsd) || 0;
              const totalUsd = qty * price;
              return (
                <div
                  key={product.id}
                  className="p-4 rounded-lg border border-beergam-input-border bg-beergam-section-background/50 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-beergam-typography-primary">
                      Produto {index + 1}
                    </span>
                    {products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProduct(product.id)}
                        className="text-beergam-red hover:text-beergam-red/80 text-sm font-medium"
                      >
                        Remover
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        value={
                          product.quantity === ""
                            ? undefined
                            : Number(product.quantity)
                        }
                        onChange={(v) =>
                          updateProduct(
                            product.id,
                            { quantity: v === undefined ? "" : String(v) }
                          )
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
                        value={
                          product.unitPriceUsd === ""
                            ? undefined
                            : product.unitPriceUsd
                        }
                        onChange={(v) =>
                          updateProduct(
                            product.id,
                            { unitPriceUsd: v === undefined ? "" : String(v) }
                          )
                        }
                        placeholder="Ex: 1.50 ou 1,50"
                        min={0}
                      />
                    </Fields.wrapper>
                  </div>

                  <p className="text-xs text-beergam-typography-secondary">
                    Total: $
                    {totalUsd.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    USD
                  </p>
                </div>
              );
            })
          )}
        </div>
      </Paper>

      <Paper className="p-4 space-y-4">
        <h3 className="text-lg font-semibold text-beergam-typography-primary">
          Frete e impostos
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Fields.wrapper>
            <Fields.label
              text="Taxa de câmbio (R$/USD)"
              hint="Cotação do dólar em reais"
            />
            <Fields.numericInput
              format="decimal"
              decimalScale={2}
              value={
                formData.exchangeRate === ""
                  ? undefined
                  : formData.exchangeRate
              }
              onChange={(v) =>
                updateField("exchangeRate", v === undefined ? "" : String(v))
              }
              placeholder="Ex: 5.55 ou 5,55"
              min={0}
            />
          </Fields.wrapper>

          <Fields.wrapper>
            <Fields.label
              text="Peso da carga (kg)"
              hint="Peso total em quilogramas"
            />
            <Fields.numericInput
              format="decimal"
              decimalScale={2}
              value={
                formData.cargoWeightKg === ""
                  ? undefined
                  : formData.cargoWeightKg
              }
              onChange={(v) =>
                updateField("cargoWeightKg", v === undefined ? "" : String(v))
              }
              placeholder="Ex: 30 ou 2.5"
              min={0}
            />
          </Fields.wrapper>

          <Fields.wrapper>
            <Fields.label
              text="Custo do frete/kg (USD)"
              hint="Custo por quilograma em dólares"
            />
            <Fields.numericInput
              format="decimal"
              decimalScale={2}
              value={
                formData.freightCostPerKgUsd === ""
                  ? undefined
                  : formData.freightCostPerKgUsd
              }
              onChange={(v) =>
                updateField(
                  "freightCostPerKgUsd",
                  v === undefined ? "" : String(v)
                )
              }
              placeholder="Ex: 20 ou 1.50"
              min={0}
            />
          </Fields.wrapper>

          <Fields.wrapper>
            <Fields.label
              text="ICMS de destino (%)"
              hint="Alíquota de ICMS do estado de destino"
            />
            <Fields.numericInput
              prefix="%"
              format="decimal"
              decimalScale={2}
              value={
                formData.icmsPercentage === ""
                  ? undefined
                  : Number(formData.icmsPercentage)
              }
              onChange={(v) =>
                updateField(
                  "icmsPercentage",
                  v === undefined ? "" : String(v)
                )
              }
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
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => updateField("declarationType", "100")}
              className={`px-4 py-2.5 rounded-lg border-2 transition-all font-medium text-sm ${
                formData.declarationType === "100"
                  ? "border-beergam-primary bg-beergam-primary/20 text-beergam-primary"
                  : "border-beergam-input-border bg-beergam-input-background text-beergam-typography-secondary hover:border-beergam-primary/50"
              }`}
            >
              100% do Valor (Recomendado)
            </button>
            <button
              type="button"
              onClick={() => updateField("declarationType", "custom")}
              className={`px-4 py-2.5 rounded-lg border-2 transition-all font-medium text-sm ${
                formData.declarationType === "custom"
                  ? "border-beergam-primary bg-beergam-primary/20 text-beergam-primary"
                  : "border-beergam-input-border bg-beergam-input-background text-beergam-typography-secondary hover:border-beergam-primary/50"
              }`}
            >
              Valor Personalizado
            </button>
          </div>
          {formData.declarationType === "custom" && (
            <div className="mt-3 max-w-[200px]">
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
                  updateField(
                    "declarationCustomPercentage",
                    v === undefined ? "" : String(v)
                  )
                }
                placeholder="Ex: 50 ou 33.5"
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

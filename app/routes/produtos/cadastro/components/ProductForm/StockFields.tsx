import { Controller, useFormContext } from "react-hook-form";
import type {
  CreateCompleteProduct,
  CreateSimplifiedProduct,
  RegistrationType,
} from "~/features/produtos/typings/createProduct";
import { Fields } from "~/src/components/utils/_fields";

interface StockFieldsProps {
  registrationType: RegistrationType;
}

export default function StockFields({ registrationType }: StockFieldsProps) {
  const {
    control,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CreateSimplifiedProduct | CreateCompleteProduct>();

  const isComplete = registrationType === "complete";

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-beergam-typography-primary">
        Estoque
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Controle de Estoque */}
        <Fields.wrapper>
          <Fields.label text="CONTROLE DE ESTOQUE" />
          <Fields.checkbox
            name="product.stock_handling"
            label="Ativar controle de estoque"
            checked={watch("product.stock_handling")}
            onChange={(e) =>
              setValue("product.stock_handling", e.target.checked)
            }
            error={errors.product?.stock_handling?.message}
            dataTooltipId="product-stock-handling-checkbox"
          />
        </Fields.wrapper>

        {/* Quantidade Inicial */}
        <Fields.wrapper>
          <Fields.label text="QUANTIDADE INICIAL" required />
          <Controller
            name="product.initial_quantity"
            control={control}
            render={({ field }) => (
              <Fields.numericInput
                format="integer"
                value={field.value}
                onChange={(v) => field.onChange(typeof v === "number" ? v : undefined)}
                error={errors.product?.initial_quantity?.message}
                dataTooltipId="product-initial-quantity-input"
                min={0}
                placeholder="0"
              />
            )}
          />
        </Fields.wrapper>

        {/* Quantidade Disponível */}
        <Fields.wrapper>
          <Fields.label text="QUANTIDADE DISPONÍVEL" />
          <Controller
            name="product.available_quantity"
            control={control}
            render={({ field }) => (
              <Fields.numericInput
                format="integer"
                value={field.value}
                onChange={(v) => field.onChange(typeof v === "number" ? v : undefined)}
                error={errors.product?.available_quantity?.message}
                dataTooltipId="product-available-quantity-input"
                min={0}
                placeholder="0"
              />
            )}
          />
        </Fields.wrapper>

        {/* Tipo de Unidade */}
        <Fields.wrapper>
          <Fields.label text="TIPO DE UNIDADE" required />
          <Fields.select
            options={[
              { value: "UNITY", label: "Unidade" },
              { value: "KIT", label: "Kit" },
            ]}
            {...register("product.unity_type")}
            value={watch("product.unity_type") || "UNITY"}
            error={
              errors.product?.unity_type
                ? {
                    message:
                      errors.product.unity_type.message ||
                      "Tipo de unidade é obrigatório",
                    error: true,
                  }
                : undefined
            }
            hasError={!!errors.product?.unity_type}
          />
        </Fields.wrapper>

        {/* Quantidade Máxima (apenas completo) */}
        {isComplete && (
          <Fields.wrapper>
            <Fields.label text="QUANTIDADE MÁXIMA" />
            <Controller
              name="product.maximum_quantity"
              control={control}
              render={({ field }) => (
                <Fields.numericInput
                  format="integer"
                  value={field.value}
                  onChange={(v) => field.onChange(typeof v === "number" ? v : undefined)}
                  error={
                    (errors.product as CreateCompleteProduct["product"])
                      ?.maximum_quantity?.message
                  }
                  dataTooltipId="product-maximum-quantity-input"
                  min={0}
                  placeholder="0"
                />
              )}
            />
          </Fields.wrapper>
        )}

        {/* Quantidade Mínima (apenas completo) */}
        {isComplete && (
          <Fields.wrapper>
            <Fields.label text="QUANTIDADE MÍNIMA" />
            <Controller
              name="product.minimum_quantity"
              control={control}
              render={({ field }) => (
                <Fields.numericInput
                  format="integer"
                  value={field.value}
                  onChange={(v) => field.onChange(typeof v === "number" ? v : undefined)}
                  error={
                    (errors.product as CreateCompleteProduct["product"])
                      ?.minimum_quantity?.message
                  }
                  dataTooltipId="product-minimum-quantity-input"
                  min={0}
                  placeholder="0"
                />
              )}
            />
          </Fields.wrapper>
        )}
      </div>
    </div>
  );
}

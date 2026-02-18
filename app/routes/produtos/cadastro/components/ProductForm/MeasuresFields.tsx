import { Controller, useFormContext } from "react-hook-form";
import type {
  CreateCompleteProduct,
  RegistrationType,
} from "~/features/produtos/typings/createProduct";
import { Fields } from "~/src/components/utils/_fields";

interface MeasuresFieldsProps {
  registrationType: RegistrationType;
}

export default function MeasuresFields({
  registrationType,
}: MeasuresFieldsProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateCompleteProduct>();

  if (registrationType !== "complete") {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-beergam-typography-primary">
        Medidas
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Peso Líquido */}
        <Fields.wrapper>
          <Fields.label text="PESO LÍQUIDO (kg)" />
          <Controller
            name="product.net_weight"
            control={control}
            render={({ field }) => (
              <Fields.numericInput
                format="decimal"
                decimalScale={2}
                value={field.value}
                onChange={(v) => field.onChange(typeof v === "number" ? v : undefined)}
                error={errors.product?.net_weight?.message}
                dataTooltipId="product-net-weight-input"
                min={0}
                placeholder="0,00"
              />
            )}
          />
        </Fields.wrapper>

        {/* Peso Bruto */}
        <Fields.wrapper>
          <Fields.label text="PESO BRUTO (kg)" />
          <Controller
            name="product.brute_weight"
            control={control}
            render={({ field }) => (
              <Fields.numericInput
                format="decimal"
                decimalScale={2}
                value={field.value}
                onChange={(v) => field.onChange(typeof v === "number" ? v : undefined)}
                error={errors.product?.brute_weight?.message}
                dataTooltipId="product-brute-weight-input"
                min={0}
                placeholder="0,00"
              />
            )}
          />
        </Fields.wrapper>

        {/* Altura */}
        <Fields.wrapper>
          <Fields.label text="ALTURA (cm)" />
          <Controller
            name="product.height"
            control={control}
            render={({ field }) => (
              <Fields.numericInput
                format="decimal"
                decimalScale={2}
                value={field.value}
                onChange={(v) => field.onChange(typeof v === "number" ? v : undefined)}
                error={errors.product?.height?.message}
                dataTooltipId="product-height-input"
                min={0}
                placeholder="0,00"
              />
            )}
          />
        </Fields.wrapper>

        {/* Largura */}
        <Fields.wrapper>
          <Fields.label text="LARGURA (cm)" />
          <Controller
            name="product.width"
            control={control}
            render={({ field }) => (
              <Fields.numericInput
                format="decimal"
                decimalScale={2}
                value={field.value}
                onChange={(v) => field.onChange(typeof v === "number" ? v : undefined)}
                error={errors.product?.width?.message}
                dataTooltipId="product-width-input"
                min={0}
                placeholder="0,00"
              />
            )}
          />
        </Fields.wrapper>

        {/* Profundidade */}
        <Fields.wrapper>
          <Fields.label text="PROFUNDIDADE (cm)" />
          <Controller
            name="product.depth"
            control={control}
            render={({ field }) => (
              <Fields.numericInput
                format="decimal"
                decimalScale={2}
                value={field.value}
                onChange={(v) => field.onChange(typeof v === "number" ? v : undefined)}
                error={errors.product?.depth?.message}
                dataTooltipId="product-depth-input"
                min={0}
                placeholder="0,00"
              />
            )}
          />
        </Fields.wrapper>
      </div>
    </div>
  );
}

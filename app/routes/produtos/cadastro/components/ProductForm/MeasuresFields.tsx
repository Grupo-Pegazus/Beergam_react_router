import { useFormContext } from "react-hook-form";
import { Fields } from "~/src/components/utils/_fields";
import type { CreateCompleteProduct, RegistrationType } from "~/features/produtos/typings/createProduct";

interface MeasuresFieldsProps {
  registrationType: RegistrationType;
}

export default function MeasuresFields({ registrationType }: MeasuresFieldsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateCompleteProduct>();

  if (registrationType !== "complete") {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-beergam-blue-primary">
        Medidas
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Peso Líquido */}
        <Fields.wrapper>
          <Fields.label text="PESO LÍQUIDO (kg)" />
          <Fields.input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register("product.net_weight", { valueAsNumber: true })}
            error={errors.product?.net_weight?.message}
            dataTooltipId="product-net-weight-input"
          />
        </Fields.wrapper>

        {/* Peso Bruto */}
        <Fields.wrapper>
          <Fields.label text="PESO BRUTO (kg)" />
          <Fields.input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register("product.brute_weight", { valueAsNumber: true })}
            error={errors.product?.brute_weight?.message}
            dataTooltipId="product-brute-weight-input"
          />
        </Fields.wrapper>

        {/* Altura */}
        <Fields.wrapper>
          <Fields.label text="ALTURA (cm)" />
          <Fields.input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register("product.height", { valueAsNumber: true })}
            error={errors.product?.height?.message}
            dataTooltipId="product-height-input"
          />
        </Fields.wrapper>

        {/* Largura */}
        <Fields.wrapper>
          <Fields.label text="LARGURA (cm)" />
          <Fields.input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register("product.width", { valueAsNumber: true })}
            error={errors.product?.width?.message}
            dataTooltipId="product-width-input"
          />
        </Fields.wrapper>

        {/* Profundidade */}
        <Fields.wrapper>
          <Fields.label text="PROFUNDIDADE (cm)" />
          <Fields.input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register("product.depth", { valueAsNumber: true })}
            error={errors.product?.depth?.message}
            dataTooltipId="product-depth-input"
          />
        </Fields.wrapper>
      </div>
    </div>
  );
}


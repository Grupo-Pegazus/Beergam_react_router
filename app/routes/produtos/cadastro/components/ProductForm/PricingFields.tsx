import { useFormContext } from "react-hook-form";
import { Fields } from "~/src/components/utils/_fields";
import type {
  CreateSimplifiedProduct,
  CreateCompleteProduct,
} from "~/features/produtos/typings/createProduct";

interface PricingFieldsProps {
  registrationType: "simplified" | "complete";
}

export default function PricingFields({ registrationType }: PricingFieldsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateSimplifiedProduct | CreateCompleteProduct>();

  const isComplete = registrationType === "complete";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Preço de Venda */}
      <Fields.wrapper>
        <Fields.label text="PREÇO DE VENDA" required />
        <Fields.input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          {...register("product.price_sale", { valueAsNumber: true })}
          error={errors.product?.price_sale?.message}
          dataTooltipId="product-price-sale-input"
        />
      </Fields.wrapper>

      {/* Preço de Compra */}
      <Fields.wrapper>
        <Fields.label text="PREÇO DE COMPRA" required />
        <Fields.input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          {...register("product.price_cost", { valueAsNumber: true })}
          error={errors.product?.price_cost?.message}
          dataTooltipId="product-price-cost-input"
        />
      </Fields.wrapper>

      {/* Custo de Embalagem (apenas completo) */}
      {isComplete && (
        <Fields.wrapper>
          <Fields.label text="CUSTO DE EMBALAGEM" />
          <Fields.input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register("product.packaging_cost", { valueAsNumber: true })}
            error={((errors.product as unknown as CreateCompleteProduct['product'])?.packaging_cost as { message?: string })?.message}
            dataTooltipId="product-packaging-cost-input"
          />
        </Fields.wrapper>
      )}

      {/* Custo Extra (apenas completo) */}
      {isComplete && (
        <Fields.wrapper>
          <Fields.label text="CUSTO EXTRA" />
          <Fields.input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register("product.extra_cost", { valueAsNumber: true })}
            error={((errors.product as unknown as CreateCompleteProduct['product'])?.extra_cost as { message?: string })?.message}
            dataTooltipId="product-extra-cost-input"
          />
        </Fields.wrapper>
      )}
    </div>
  );
}


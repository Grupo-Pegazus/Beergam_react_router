import { Controller, useFormContext } from "react-hook-form";
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
    control,
    formState: { errors },
  } = useFormContext<CreateSimplifiedProduct | CreateCompleteProduct>();

  const isComplete = registrationType === "complete";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Preço de Venda */}
      <Fields.wrapper>
        <Fields.label text="PREÇO DE VENDA" required />
        <Controller
          name="product.price_sale"
          control={control}
          render={({ field }) => (
            <Fields.numericInput
              prefix="R$"
              format="currency"
              value={field.value}
              onChange={(v) => field.onChange(typeof v === "number" ? v : undefined)}
              error={errors.product?.price_sale?.message}
              dataTooltipId="product-price-sale-input"
              min={0}
              placeholder="0,00"
            />
          )}
        />
      </Fields.wrapper>

      {/* Preço de Compra */}
      <Fields.wrapper>
        <Fields.label text="PREÇO DE COMPRA" required />
        <Controller
          name="product.price_cost"
          control={control}
          render={({ field }) => (
            <Fields.numericInput
              prefix="R$"
              format="currency"
              value={field.value}
              onChange={(v) => field.onChange(typeof v === "number" ? v : undefined)}
              error={errors.product?.price_cost?.message}
              dataTooltipId="product-price-cost-input"
              min={0}
              placeholder="0,00"
            />
          )}
        />
      </Fields.wrapper>

      {/* Custo de Embalagem (apenas completo) */}
      {isComplete && (
        <Fields.wrapper>
          <Fields.label text="CUSTO DE EMBALAGEM" />
          <Controller
            name="product.packaging_cost"
            control={control}
            render={({ field }) => (
              <Fields.numericInput
                prefix="R$"
                format="currency"
                value={field.value}
                onChange={(v) => field.onChange(typeof v === "number" ? v : undefined)}
                error={((errors.product as unknown as CreateCompleteProduct['product'])?.packaging_cost as { message?: string })?.message}
                dataTooltipId="product-packaging-cost-input"
                min={0}
                placeholder="0,00"
              />
            )}
          />
        </Fields.wrapper>
      )}

      {/* Custo Extra (apenas completo) */}
      {isComplete && (
        <Fields.wrapper>
          <Fields.label text="CUSTO EXTRA" />
          <Controller
            name="product.extra_cost"
            control={control}
            render={({ field }) => (
              <Fields.numericInput
                prefix="R$"
                format="currency"
                value={field.value}
                onChange={(v) => field.onChange(typeof v === "number" ? v : undefined)}
                error={((errors.product as unknown as CreateCompleteProduct['product'])?.extra_cost as { message?: string })?.message}
                dataTooltipId="product-extra-cost-input"
                min={0}
                placeholder="0,00"
              />
            )}
          />
        </Fields.wrapper>
      )}
    </div>
  );
}


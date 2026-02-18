import { Controller, useFormContext } from "react-hook-form";
import type { CreateCompleteProduct } from "~/features/produtos/typings/createProduct";
import { Fields } from "~/src/components/utils/_fields";

export default function ProductCompleteFields() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CreateCompleteProduct>();

  return (
    <div className="flex flex-col gap-4 border-t pt-4">
      <h2 className="text-xl font-semibold text-beergam-blue-primary">
        Informações Adicionais
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Descrição */}
        <Fields.wrapper className="md:col-span-2">
          <Fields.label text="DESCRIÇÃO" />
          <textarea
            className="w-full px-3 py-2.5 border border-beergam-primary/20 rounded text-sm bg-beergam-input-background text-beergam-typography-tertiary transition-colors duration-200 outline-none focus:border-beergam-orange resize-none"
            rows={4}
            placeholder="Digite a descrição do produto"
            {...register("product.description")}
          />
          {errors.product?.description && (
            <p className="text-xs text-beergam-red mt-1">
              {errors.product.description.message}
            </p>
          )}
        </Fields.wrapper>

        {/* Marca */}
        <Fields.wrapper>
          <Fields.label text="MARCA" />
          <Fields.input
            type="text"
            placeholder="Digite a marca"
            {...register("product.brand")}
            error={errors.product?.brand?.message}
            dataTooltipId="product-brand-input"
          />
        </Fields.wrapper>

        {/* Código Interno */}
        <Fields.wrapper>
          <Fields.label text="CÓDIGO INTERNO" />
          <Fields.input
            type="text"
            placeholder="Digite o código interno"
            {...register("product.internal_code")}
            error={errors.product?.internal_code?.message}
            dataTooltipId="product-internal-code-input"
          />
        </Fields.wrapper>

        {/* Custo de Embalagem */}
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
                error={errors.product?.packaging_cost?.message}
                dataTooltipId="product-packaging-cost-input"
                min={0}
                placeholder="0,00"
              />
            )}
          />
        </Fields.wrapper>

        {/* Custo Extra */}
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
                error={errors.product?.extra_cost?.message}
                dataTooltipId="product-extra-cost-input"
                min={0}
                placeholder="0,00"
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

        {/* Quantidade Mínima */}
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
                error={errors.product?.minimum_quantity?.message}
                dataTooltipId="product-minimum-quantity-input"
                min={0}
                placeholder="0"
              />
            )}
          />
        </Fields.wrapper>

        {/* Quantidade Máxima */}
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
                error={errors.product?.maximum_quantity?.message}
                dataTooltipId="product-maximum-quantity-input"
                min={0}
                placeholder="0"
              />
            )}
          />
        </Fields.wrapper>

        {/* NCM */}
        <Fields.wrapper>
          <Fields.label text="NCM" />
          <Fields.input
            type="text"
            placeholder="Digite o NCM"
            {...register("product.ncm")}
            error={errors.product?.ncm?.message}
            dataTooltipId="product-ncm-input"
          />
        </Fields.wrapper>

        {/* EAN */}
        <Fields.wrapper>
          <Fields.label text="EAN" />
          <Fields.input
            type="text"
            placeholder="Digite o EAN"
            {...register("product.ean")}
            error={errors.product?.ean?.message}
            dataTooltipId="product-ean-input"
          />
        </Fields.wrapper>

        {/* CEST */}
        <Fields.wrapper>
          <Fields.label text="CEST" />
          <Fields.input
            type="text"
            placeholder="Digite o CEST"
            {...register("product.cest")}
            error={errors.product?.cest?.message}
            dataTooltipId="product-cest-input"
          />
        </Fields.wrapper>

        {/* ICMS */}
        <Fields.wrapper>
          <Fields.label text="ICMS" />
          <Fields.checkbox {...register("product.icms")} label="Possui ICMS" />
        </Fields.wrapper>

        {/* Substituição Tributária */}
        <Fields.wrapper>
          <Fields.label text="SUBSTITUIÇÃO TRIBUTÁRIA" />
          <Fields.checkbox
            {...register("product.tax_replacement")}
            label="Possui substituição tributária"
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

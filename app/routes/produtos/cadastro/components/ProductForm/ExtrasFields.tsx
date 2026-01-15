import { useFormContext } from "react-hook-form";
import type {
  CreateCompleteProduct,
  CreateSimplifiedProduct,
  RegistrationType,
} from "~/features/produtos/typings/createProduct";
import { Fields } from "~/src/components/utils/_fields";

interface ExtrasFieldsProps {
  registrationType: RegistrationType;
}

export default function ExtrasFields({ registrationType }: ExtrasFieldsProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CreateSimplifiedProduct | CreateCompleteProduct>();

  if (registrationType !== "complete") {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-beergam-typography-primary">
        Extras
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Código Interno */}
        <Fields.wrapper>
          <Fields.label text="CÓDIGO INTERNO" />
          <Fields.input
            type="text"
            placeholder="Digite o código interno"
            {...register("product.internal_code")}
            error={
              (
                (errors.product as unknown as CreateCompleteProduct["product"])
                  ?.internal_code as { message?: string }
              )?.message
            }
            dataTooltipId="product-internal-code-input"
          />
        </Fields.wrapper>

        {/* NCM */}
        <Fields.wrapper>
          <Fields.label text="NCM" />
          <Fields.input
            type="text"
            placeholder="Digite o NCM"
            {...register("product.ncm")}
            error={
              (
                (errors.product as unknown as CreateCompleteProduct["product"])
                  ?.ncm as { message?: string }
              )?.message
            }
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
            error={
              (
                (errors.product as unknown as CreateCompleteProduct["product"])
                  ?.ean as { message?: string }
              )?.message
            }
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
            error={
              (
                (errors.product as unknown as CreateCompleteProduct["product"])
                  ?.cest as { message?: string }
              )?.message
            }
            dataTooltipId="product-cest-input"
          />
        </Fields.wrapper>

        {/* ICMS */}
        <Fields.wrapper>
          <Fields.label text="ICMS" />
          <Fields.checkbox
            name="product.icms"
            label="Possui ICMS"
            checked={watch("product.icms")}
            onChange={(e) => setValue("product.icms", e.target.checked)}
            error={undefined}
            dataTooltipId="product-icms-checkbox"
          />
        </Fields.wrapper>

        {/* Substituição Tributária */}
        <Fields.wrapper>
          <Fields.label text="SUBSTITUIÇÃO TRIBUTÁRIA" />
          <Fields.checkbox
            name="product.tax_replacement"
            label="Possui substituição tributária"
            checked={watch("product.tax_replacement")}
            onChange={(e) =>
              setValue("product.tax_replacement", e.target.checked)
            }
            error={undefined}
            dataTooltipId="product-tax-replacement-checkbox"
          />
        </Fields.wrapper>

        {/* Origem do Produto */}
        <Fields.wrapper>
          <Fields.label text="ORIGEM DO PRODUTO" required />
          <Fields.select
            options={[
              { value: "NATIONAL", label: "Nacional" },
              { value: "IMPORTED", label: "Importado" },
            ]}
            {...register("product.product_origin")}
            value={watch("product.product_origin") || "NATIONAL"}
            error={
              errors.product?.product_origin
                ? {
                    message:
                      errors.product.product_origin.message ||
                      "Origem do produto é obrigatória",
                    error: true,
                  }
                : undefined
            }
            hasError={!!errors.product?.product_origin}
          />
        </Fields.wrapper>

        {/* Tipo de Marketing */}
        <Fields.wrapper>
          <Fields.label text="TIPO DE MARKETING" required />
          <Fields.select
            options={[
              { value: "RESALE", label: "Revenda" },
              { value: "IMPORTED", label: "Importado" },
            ]}
            {...register("product.marketing_type")}
            value={watch("product.marketing_type") || "RESALE"}
            error={
              errors.product?.marketing_type
                ? {
                    message:
                      errors.product.marketing_type.message ||
                      "Tipo de marketing é obrigatório",
                    error: true,
                  }
                : undefined
            }
            hasError={!!errors.product?.marketing_type}
          />
        </Fields.wrapper>
      </div>
    </div>
  );
}

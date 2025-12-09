import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Fields } from "~/src/components/utils/_fields";
import { useCategories } from "~/features/catalog/hooks";
import type {
  CreateSimplifiedProduct,
  CreateCompleteProduct,
  RegistrationType,
} from "~/features/produtos/typings/createProduct";

interface ProductBasicFieldsProps {
  registrationType: RegistrationType;
  onVariationsChange: (value: string) => void;
  hasVariations: boolean;
}

export default function ProductBasicFields({
  registrationType,
  onVariationsChange,
  hasVariations,
}: ProductBasicFieldsProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CreateSimplifiedProduct | CreateCompleteProduct>();

  const statusOptions = [
    { value: "ACTIVE", label: "Ativo" },
    { value: "INACTIVE", label: "Inativo" },
  ];

  const variationsOptions = [
    { value: "no", label: "Não" },
    { value: "yes", label: "Sim" },
  ];

  const isComplete = registrationType === "complete";

  // Busca categorias do sistema
  const { data: categoriesData } = useCategories({ per_page: 100 });
  
  const categoryOptions = useMemo(() => {
    if (!categoriesData?.success || !categoriesData.data?.categories) {
      return [];
    }
    return categoriesData.data.categories.map((category) => ({
      value: category.name,
      label: category.name,
    }));
  }, [categoriesData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Título */}
      <Fields.wrapper>
        <Fields.label text="TÍTULO" required />
        <Fields.input
          type="text"
          placeholder="Digite o título do produto"
          {...register("product.title")}
          error={errors.product?.title?.message}
          dataTooltipId="product-title-input"
        />
      </Fields.wrapper>

      {/* Descrição (apenas completo) */}
      {isComplete && (
        <Fields.wrapper className="md:col-span-2">
          <Fields.label text="DESCRIÇÃO" />
          <textarea
            className="w-full px-3 py-2.5 border border-black/20 rounded text-sm bg-white text-[#1e1f21] transition-colors duration-200 outline-none focus:border-beergam-orange resize-none"
            rows={4}
            placeholder="Digite a descrição do produto"
            {...register("product.description")}
          />
          {(errors.product as unknown as CreateCompleteProduct['product'])?.description && (
            <p className="text-xs text-beergam-red mt-1">
              {((errors.product as unknown as CreateCompleteProduct['product']).description as { message?: string })?.message}
            </p>
          )}
        </Fields.wrapper>
      )}

      {/* Status */}
      <Fields.wrapper>
        <Fields.label text="STATUS" required />
        <Fields.select
          options={statusOptions}
          {...register("product.status", {
            required: "Status é obrigatório",
            validate: (value) => {
              if (!value || value.trim() === "") {
                return "Status é obrigatório";
              }
              return true;
            },
          })}
          value={watch("product.status")}
          error={errors.product?.status ? { message: errors.product.status.message || "Status é obrigatório", error: true } : undefined}
          hasError={!!errors.product?.status}
          dataTooltipId="product-status-select"
        />
      </Fields.wrapper>

      {/* Variações */}
      <Fields.wrapper>
        <Fields.label text="TEM VARIAÇÕES?" required />
        <Fields.select
          key={`variations-select-${hasVariations ? "yes" : "no"}`}
          options={variationsOptions}
          value={hasVariations ? "yes" : "no"}
          onChange={(e) => {
            const newValue = e.target.value;
            onVariationsChange(newValue);
            // Limpa o SKU quando muda para "sim"
            if (newValue === "yes") {
              setValue("product.sku", null);
            }
          }}
          error={undefined}
          hasError={false}
        />
      </Fields.wrapper>

      {/* SKU */}
      <Fields.wrapper>
        <Fields.label text="SKU" required={!hasVariations} />
        <Fields.input
          type="text"
          placeholder={hasVariations ? "SKU deve ser preenchido nas variações" : "Digite o SKU"}
          disabled={hasVariations}
          {...register("product.sku", {
            required: !hasVariations ? "SKU é obrigatório quando não há variações" : false,
            validate: (value) => {
              if (!hasVariations && (!value || value.trim() === "")) {
                return "SKU é obrigatório quando não há variações";
              }
              return true;
            },
          })}
          error={errors.product?.sku?.message}
          dataTooltipId="product-sku-input"
        />
      </Fields.wrapper>

      {/* Marca (apenas completo) */}
      {isComplete && (
        <Fields.wrapper>
          <Fields.label text="MARCA" />
          <Fields.input
            type="text"
            placeholder="Digite a marca"
            {...register("product.brand")}
            error={((errors.product as unknown as CreateCompleteProduct['product'])?.brand as { message?: string })?.message}
            dataTooltipId="product-brand-input"
          />
        </Fields.wrapper>
      )}

      {/* Categoria */}
      <Fields.wrapper>
        <Fields.label text="CATEGORIA" required />
        <Fields.select
          options={categoryOptions}
          {...register("product.category_name", {
            required: "Categoria é obrigatória",
            validate: (value) => {
              if (!value || (typeof value === "string" && value.trim() === "")) {
                return "Categoria é obrigatória";
              }
              return true;
            },
          })}
          value={watch("product.category_name") || ""}
          error={errors.product?.category_name ? { message: errors.product.category_name.message || "Categoria é obrigatória", error: true } : undefined}
          hasError={!!errors.product?.category_name}
          dataTooltipId="product-category-name-select"
        />
      </Fields.wrapper>
    </div>
  );
}


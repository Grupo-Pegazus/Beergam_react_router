import { useMemo, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useAttributes } from "~/features/catalog/hooks";
import { productUploadService } from "~/features/produtos/services/uploadService";
import type {
  CompleteVariation,
  CreateCompleteProduct,
  CreateSimplifiedProduct,
  RegistrationType,
  SimplifiedVariation,
} from "~/features/produtos/typings/createProduct";
import { Fields } from "~/src/components/utils/_fields";
import BeergamButton from "~/src/components/utils/BeergamButton";
import Upload from "~/src/components/utils/upload";
import toast from "~/src/utils/toast";

interface VariationsSectionProps {
  registrationType: RegistrationType;
  onCreateAttributeClick: () => void;
}

export default function VariationsSection({
  registrationType,
  onCreateAttributeClick,
}: VariationsSectionProps) {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<CreateSimplifiedProduct | CreateCompleteProduct>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variations",
  });

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadVariationIndex, setUploadVariationIndex] = useState<
    number | null
  >(null);
  const [uploadType, setUploadType] = useState<
    "product" | "marketplace" | "shipping"
  >("product");
  const previousUploadKeyRef = useRef<string>("");
  // Usa um objeto para manter uma key única por variação e tipo
  const uploadKeysRef = useRef<Record<string, number>>({});

  const addVariation = () => {
    const baseVariation = {
      sku: "",
      title: "",
      status: "ACTIVE" as const,
      images: {
        product: [],
        marketplace: [],
        shipping: [],
      },
      attributes: [],
      unity_type: "UNITY" as const,
      stock_handling: true,
      available_quantity: 0,
    };

    if (registrationType === "complete") {
      append({
        ...baseVariation,
        description: "",
        price_sale: 0,
        price_cost: 0,
        packaging_cost: 0,
        extra_cost: 0,
        stock_handling: true,
        available_quantity: 0,
        minimum_quantity: 0,
        maximum_quantity: 0,
        ncm: "",
        ean: "",
        icms: false,
        cest: "",
      } as CompleteVariation);
    } else {
      append(baseVariation as SimplifiedVariation);
    }
  };

  const handleUploadClick = (
    index: number,
    type: "product" | "marketplace" | "shipping"
  ) => {
    const newKey = `variation-${index}-${type}`;
    // Se mudou a variação ou o tipo, incrementa a key para forçar reset do componente Upload
    if (previousUploadKeyRef.current !== newKey) {
      if (!uploadKeysRef.current[newKey]) {
        uploadKeysRef.current[newKey] = 0;
      }
      uploadKeysRef.current[newKey] += 1;
      previousUploadKeyRef.current = newKey;
    }
    setUploadVariationIndex(index);
    setUploadType(type);
    setUploadModalOpen(true);
  };

  const handleCloseModal = () => {
    setUploadModalOpen(false);
  };

  const handleUploadSuccess = () => {
    // Este callback recebe apenas os IDs, mas não usamos mais
    // Usamos onInternalUpload que recebe os objetos completos
  };

  const handleInternalUpload = (
    responses: Array<{ image_id: string; image_url: string; filename: string }>
  ) => {
    if (uploadVariationIndex === null) return;

    const currentImages =
      watch(`variations.${uploadVariationIndex}.images.${uploadType}`) || [];
    // Salva as URLs completas das imagens
    const newImageUrls = responses.map((response) => response.image_url);
    const newImages = [...currentImages, ...newImageUrls];
    setValue(
      `variations.${uploadVariationIndex}.images.${uploadType}`,
      newImages
    );
    setUploadModalOpen(false);
    // NÃO incrementa a key aqui - queremos preservar o estado para mostrar as fotos já enviadas
  };

  return (
    <div className="flex flex-col gap-4 border-t pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-beergam-typography-primary">
          Variações do Produto
        </h2>
        <BeergamButton
          title="Adicionar Variação"
          onClick={addVariation}
          icon="plus"
        />
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 text-beergam-gray border border-dashed border-beergam-gray-200 rounded-lg">
          Nenhuma variação adicionada. Clique em &quot;Adicionar Variação&quot;
          para começar.
        </div>
      )}

      {fields.map((field, index) => (
        <VariationForm
          key={field.id}
          index={index}
          registrationType={registrationType}
          onRemove={() => remove(index)}
          onUploadClick={handleUploadClick}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          errors={errors.variations?.[index] as any}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setValue={setValue as any}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          watch={watch as any}
          onCreateAttributeClick={onCreateAttributeClick}
        />
      ))}

      <Upload
        key={`${previousUploadKeyRef.current}-${uploadKeysRef.current[previousUploadKeyRef.current] || 0}`}
        title={`Upload de Imagens - Variação ${(uploadVariationIndex ?? 0) + 1} - ${uploadType === "product" ? "Produto" : uploadType === "marketplace" ? "Marketplace" : "Envio"}`}
        isOpen={uploadModalOpen}
        onClose={handleCloseModal}
        typeImport="internal"
        service={productUploadService}
        maxFiles={8}
        accept="image/*"
        emptyStateLabel="Arraste e solte ou clique para selecionar imagens"
        draggingLabel="Solte para iniciar o upload"
        onChange={handleUploadSuccess}
        onUploadSuccess={handleUploadSuccess}
        onInternalUpload={handleInternalUpload}
        initialFiles={
          uploadVariationIndex !== null
            ? (watch(
              `variations.${uploadVariationIndex}.images.${uploadType}`
            ) as string[]) || []
            : []
        }
      />
    </div>
  );
}

interface VariationFormProps {
  index: number;
  registrationType: RegistrationType;
  onRemove: () => void;
  onUploadClick: (
    index: number,
    type: "product" | "marketplace" | "shipping"
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: any;
  onCreateAttributeClick: () => void;
}

function VariationForm({
  index,
  registrationType,
  onRemove,
  onUploadClick,
  errors,
  watch,
  setValue,
  onCreateAttributeClick,
}: VariationFormProps) {
  const { register } = useFormContext<
    CreateSimplifiedProduct | CreateCompleteProduct
  >();

  const statusOptions = [
    { value: "ACTIVE", label: "Ativo" },
    { value: "INACTIVE", label: "Inativo" },
  ];

  const productImages = ((watch(
    `variations.${index}.images.product` as any
  ) as string[]) || []) as string[];

  const marketplaceImages = ((watch(
    `variations.${index}.images.marketplace` as any
  ) as string[]) || []) as string[];

  const shippingImages = ((watch(
    `variations.${index}.images.shipping` as any
  ) as string[]) || []) as string[];

  const handleRemoveImage = (
    type: "product" | "marketplace" | "shipping",
    imgIndex: number
  ) => {
    const currentImages = watch(`variations.${index}.images.${type}`) || [];
    const newImages = currentImages.filter(
      (_: string, i: number) => i !== imgIndex
    );
    setValue(`variations.${index}.images.${type}`, newImages);
  };

  const renderImageGrid = (
    images: string[],
    type: "product" | "marketplace" | "shipping",
    label: string
  ) => {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Fields.label text={label} />
          <BeergamButton
            type="button"
            onClick={() => onUploadClick(index, type)}
            icon="camera_solid"
            title="Adicionar Imagens"
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {images.map((imageUrl: string, imgIndex: number) => (
            <div key={imgIndex} className="relative group">
              <img
                src={imageUrl}
                alt={`${label} ${imgIndex + 1}`}
                className="w-full h-24 object-cover rounded border border-beergam-gray-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/150?text=Img+${imgIndex + 1}`;
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(type, imgIndex)}
                className="absolute top-1 right-1 bg-beergam-red text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
              >
                ×
              </button>
            </div>
          ))}
          {images.length === 0 && (
            <div className="col-span-4 text-center py-4 text-beergam-gray border border-dashed border-beergam-gray-200 rounded-lg">
              Nenhuma imagem adicionada
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="border border-beergam-primary rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="text-lg font-medium text-beergam-typography-primary">
          Variação {index + 1}
        </h3>
        <BeergamButton
          type="button"
          onClick={onRemove}
          mainColor="beergam-red"
          icon="trash"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Fields.wrapper>
          <Fields.label text="TÍTULO DA VARIAÇÃO" required />
          <Fields.input
            type="text"
            placeholder="Digite o título da variação"
            {...register(`variations.${index}.title`)}
            error={errors?.title?.message}
            dataTooltipId={`variation-${index}-title-input`}
          />
        </Fields.wrapper>

        <Fields.wrapper>
          <Fields.label text="SKU" required />
          <Fields.input
            type="text"
            placeholder="Digite o SKU"
            {...register(`variations.${index}.sku`, {
              required: "SKU é obrigatório",
              minLength: {
                value: 1,
                message: "SKU é obrigatório",
              },
            })}
            error={errors?.sku?.message}
            dataTooltipId={`variation-${index}-sku-input`}
          />
        </Fields.wrapper>

        <Fields.wrapper>
          <Fields.label text="CONTROLE DE ESTOQUE" />
          <Fields.checkbox
            name={`variations.${index}.stock_handling`}
            label="Ativar controle de estoque"
            checked={
              (watch(
                `variations.${index}.stock_handling` as `variations.${number}.stock_handling`
              ) as boolean) || false
            }
            onChange={(e) =>
              setValue(`variations.${index}.stock_handling`, e.target.checked)
            }
            error={errors?.stock_handling?.message}
            dataTooltipId={`variation-${index}-stock-handling-checkbox`}
          />
        </Fields.wrapper>

        <Fields.wrapper>
          <Fields.label text="STATUS" required />
          <Fields.select
            options={statusOptions}
            {...register(`variations.${index}.status`)}
            value={
              (watch(`variations.${index}.status` as any) as
                | string
                | null
                | undefined) || null
            }
            error={
              errors?.status
                ? {
                  message: errors.status.message || "Campo obrigatório",
                  error: true,
                }
                : undefined
            }
            hasError={!!errors?.status}
          />
        </Fields.wrapper>

        {registrationType === "complete" && (
          <>
            <Fields.wrapper>
              <Fields.label text="DESCRIÇÃO" />
              <textarea
                className="w-full px-3 py-2.5 border border-beergam-primary/20 rounded text-sm bg-beergam-input-background text-beergam-typography-tertiary transition-colors duration-200 outline-none focus:border-beergam-orange resize-none"
                rows={3}
                placeholder="Digite a descrição da variação"
                {...register(`variations.${index}.description`)}
              />
            </Fields.wrapper>

            <Fields.wrapper>
              <Fields.label text="PREÇO DE VENDA" />
              <Fields.input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register(`variations.${index}.price_sale`, {
                  valueAsNumber: true,
                })}
                error={errors?.price_sale?.message}
              />
            </Fields.wrapper>

            <Fields.wrapper>
              <Fields.label text="PREÇO DE CUSTO" />
              <Fields.input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register(`variations.${index}.price_cost`, {
                  valueAsNumber: true,
                })}
                error={errors?.price_cost?.message}
              />
            </Fields.wrapper>

            <Fields.wrapper>
              <Fields.label text="CUSTO DE EMBALAGEM" />
              <Fields.input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register(`variations.${index}.packaging_cost`, {
                  valueAsNumber: true,
                })}
                error={errors?.packaging_cost?.message}
              />
            </Fields.wrapper>

            <Fields.wrapper>
              <Fields.label text="CUSTO EXTRA" />
              <Fields.input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register(`variations.${index}.extra_cost`, {
                  valueAsNumber: true,
                })}
                error={errors?.extra_cost?.message}
              />
            </Fields.wrapper>

            <Fields.wrapper>
              <Fields.label text="QUANTIDADE MÍNIMA" />
              <Fields.input
                type="number"
                min="0"
                placeholder="0"
                {...register(`variations.${index}.minimum_quantity`, {
                  valueAsNumber: true,
                })}
                error={errors?.minimum_quantity?.message}
              />
            </Fields.wrapper>

            <Fields.wrapper>
              <Fields.label text="QUANTIDADE MÁXIMA" />
              <Fields.input
                type="number"
                min="0"
                placeholder="0"
                {...register(`variations.${index}.maximum_quantity`, {
                  valueAsNumber: true,
                })}
                error={errors?.maximum_quantity?.message}
              />
            </Fields.wrapper>

            <Fields.wrapper>
              <Fields.label text="NCM" />
              <Fields.input
                type="text"
                placeholder="Digite o NCM"
                {...register(`variations.${index}.ncm`)}
                error={errors?.ncm?.message}
              />
            </Fields.wrapper>

            <Fields.wrapper>
              <Fields.label text="EAN" />
              <Fields.input
                type="text"
                placeholder="Digite o EAN"
                {...register(`variations.${index}.ean`)}
                error={errors?.ean?.message}
              />
            </Fields.wrapper>

            <Fields.wrapper>
              <Fields.label text="CEST" />
              <Fields.input
                type="text"
                placeholder="Digite o CEST"
                {...register(`variations.${index}.cest`)}
                error={errors?.cest?.message}
              />
            </Fields.wrapper>

            <Fields.wrapper>
              <Fields.label text="ICMS" />
              <Fields.checkbox
                {...register(`variations.${index}.icms`)}
                label="Possui ICMS"
              />
            </Fields.wrapper>
          </>
        )}

        {/* Tipo de Unidade - Aparece em todas as variações */}
        <Fields.wrapper>
          <Fields.label text="TIPO DE UNIDADE" required />
          <Fields.select
            options={[
              { value: "UNITY", label: "Unidade" },
              { value: "KIT", label: "Kit" },
            ]}
            {...register(`variations.${index}.unity_type`)}
            value={
              (watch(`variations.${index}.unity_type` as any) as
                | string
                | null
                | undefined) || "UNITY"
            }
            error={
              errors?.unity_type
                ? {
                  message:
                    errors.unity_type.message ||
                    "Tipo de unidade é obrigatório",
                  error: true,
                }
                : undefined
            }
            hasError={!!errors?.unity_type}
          />
        </Fields.wrapper>

        {/* Quantidade Disponível - Aparece em todas as variações quando stock_handling está ativo */}
        {(watch(
          `variations.${index}.stock_handling` as `variations.${number}.stock_handling`
        ) as boolean) && (
            <Fields.wrapper>
              <Fields.label text="QUANTIDADE DISPONÍVEL" />
              <Fields.input
                type="number"
                min="0"
                placeholder="0"
                {...register(`variations.${index}.available_quantity`, {
                  valueAsNumber: true,
                })}
                error={errors?.available_quantity?.message}
              />
            </Fields.wrapper>
          )}
      </div>

      {/* Atributos da variação */}
      <VariationAttributes
        index={index}
        watch={watch}
        setValue={setValue}
        errors={errors}
        onCreateAttributeClick={onCreateAttributeClick}
      />

      {/* Upload de imagens da variação */}
      <div className="flex flex-col gap-4 border-t pt-4">
        <h4 className="text-lg font-semibold text-beergam-typography-primary">
          Imagens da Variação
        </h4>
        {renderImageGrid(productImages, "product", "IMAGENS DO PRODUTO")}
        {renderImageGrid(
          marketplaceImages,
          "marketplace",
          "IMAGENS PARA MARKETPLACE"
        )}
        {renderImageGrid(shippingImages, "shipping", "IMAGENS PARA ENVIO")}
      </div>
    </div>
  );
}

interface VariationAttributesProps {
  index: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any;
  onCreateAttributeClick: () => void;
}

function VariationAttributes({
  index,
  watch,
  setValue,
  errors,
  onCreateAttributeClick,
}: VariationAttributesProps) {
  const { control, register } = useFormContext<
    CreateSimplifiedProduct | CreateCompleteProduct
  >();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variations.${index}.attributes`,
  });

  // Busca atributos do sistema
  const { data: attributesData } = useAttributes({ per_page: 100 });

  const attributesMap = useMemo(() => {
    if (!attributesData?.success || !attributesData.data?.attributes) {
      return new Map<
        string,
        { name: string; allowed_values: string[] | null }
      >();
    }
    const map = new Map<
      string,
      { name: string; allowed_values: string[] | null }
    >();
    attributesData.data.attributes.forEach((attr) => {
      map.set(attr.name, {
        name: attr.name,
        allowed_values: attr.allowed_values,
      });
    });
    return map;
  }, [attributesData]);

  const attributeOptions = useMemo(() => {
    return Array.from(attributesMap.values()).map((attr) => ({
      value: attr.name,
      label: attr.name,
    }));
  }, [attributesMap]);

  const currentAttributes =
    (watch(`variations.${index}.attributes` as any) as Array<{
      name: string;
      value: string[];
    }>) || [];

  /** Nomes já usados por *outros* atributos da mesma variação (exclui attrIndex). */
  const getUsedAttributeNames = (excludeAttrIndex: number): Set<string> => {
    const used = new Set<string>();
    currentAttributes.forEach((attr, i) => {
      if (i !== excludeAttrIndex && attr?.name?.trim())
        used.add(attr.name.trim());
    });
    return used;
  };

  /** Opções de atributo disponíveis para o attrIndex (exclui nomes já usados em outras linhas). */
  const getAvailableAttributeOptions = (attrIndex: number) => {
    const used = getUsedAttributeNames(attrIndex);
    return attributeOptions.filter((opt) => !used.has(opt.value));
  };

  const addAttribute = () => {
    append({ name: "", value: [] });
  };

  const removeAttribute = (attrIndex: number) => {
    remove(attrIndex);
  };

  const setSingleAttributeValue = (attrIndex: number, value: string) => {
    setValue(
      `variations.${index}.attributes.${attrIndex}.value`,
      value.trim() ? [value.trim()] : []
    );
  };

  return (
    <div className="flex flex-col gap-4 border-t pt-4">
      <div className="flex items-center justify-between">
        <Fields.label text="ATRIBUTOS DA VARIAÇÃO" required />
        <div className="flex items-center gap-2">
          <BeergamButton
            type="button"
            onClick={onCreateAttributeClick}
            title="Novo Atributo"
            icon="box_solid"
          />
          <BeergamButton
            type="button"
            onClick={addAttribute}
            title="Adicionar Atributo"
            icon="box_arrow_down_solid"
          />
        </div>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-4 text-beergam-gray border border-dashed border-beergam-gray-200 rounded-lg">
          Nenhum atributo adicionado. Adicione pelo menos um atributo para
          diferenciar esta variação.
        </div>
      )}

      {fields.map((field, attrIndex) => {
        const currentAttr = currentAttributes[attrIndex];
        const attributeName = currentAttr?.name || "";
        const attributeValues = currentAttr?.value || [];

        return (
          <div
            key={field.id}
            className="border border-beergam-gray-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Fields.wrapper>
                  <Fields.label text="NOME DO ATRIBUTO" required />
                  <Fields.select
                    options={[
                      {
                        value: "",
                        label: "Selecione o atributo",
                      },
                      ...getAvailableAttributeOptions(attrIndex),
                    ]}
                    {...register(
                      `variations.${index}.attributes.${attrIndex}.name`
                    )}
                    value={attributeName}
                    onChange={(e) => {
                      const newName = e.target.value;
                      const used = getUsedAttributeNames(attrIndex);
                      if (
                        newName &&
                        used.has(newName)
                      ) {
                        toast.error(
                          "Este atributo já foi adicionado nesta variação. Cada variação não pode ter o mesmo atributo mais de uma vez."
                        );
                        return;
                      }
                      setValue(
                        `variations.${index}.attributes.${attrIndex}.name`,
                        newName
                      );
                      setValue(
                        `variations.${index}.attributes.${attrIndex}.value`,
                        []
                      );
                    }}
                    error={
                      errors?.attributes?.[attrIndex]?.name
                        ? {
                          message:
                            errors.attributes[attrIndex].name.message ||
                            "Nome do atributo é obrigatório",
                          error: true,
                        }
                        : undefined
                    }
                    hasError={!!errors?.attributes?.[attrIndex]?.name}
                  />
                </Fields.wrapper>

                <Fields.wrapper>
                  <Fields.label text="VALOR DO ATRIBUTO" required />
                  {(() => {
                    if (!attributeName) {
                      return (
                        <div className="text-sm text-beergam-gray">
                          Selecione um atributo primeiro
                        </div>
                      );
                    }

                    const selectedAttribute = attributesMap.get(attributeName);
                    const allowedValues =
                      selectedAttribute?.allowed_values || [];

                    if (allowedValues.length === 0) {
                      return (
                        <div className="text-sm text-beergam-gray">
                          Este atributo não possui valores permitidos
                          cadastrados.
                        </div>
                      );
                    }

                    const valueOptions = allowedValues.map((val) => ({
                      value: val,
                      label: val,
                    }));

                    const currentValue = attributeValues[0] ?? "";

                    return (
                      <Fields.select
                        options={[
                          { value: "", label: "Selecione o valor" },
                          ...valueOptions,
                        ]}
                        value={currentValue}
                        onChange={(e) =>
                          setSingleAttributeValue(attrIndex, e.target.value)
                        }
                        error={
                          errors?.attributes?.[attrIndex]?.value
                            ? {
                              message:
                                errors.attributes[attrIndex].value.message ||
                                "O valor do atributo é obrigatório",
                              error: true,
                            }
                            : undefined
                        }
                        hasError={!!errors?.attributes?.[attrIndex]?.value}
                      />
                    );
                  })()}
                </Fields.wrapper>
              </div>
              <BeergamButton
                type="button"
                onClick={() => removeAttribute(attrIndex)}
                title="Remover Atributo"
                icon="trash"
                mainColor="beergam-red"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

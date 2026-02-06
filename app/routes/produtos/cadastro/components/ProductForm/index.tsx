import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import AttributeFormModal from "~/features/catalog/components/AttributeFormModal";
import CategoryFormModal from "~/features/catalog/components/CategoryFormModal";
import { useProductDetails } from "~/features/produtos/hooks";
import { produtosService } from "~/features/produtos/service";
import {
  CreateCompleteProductSchema,
  CreateSimplifiedProductSchema,
  type CreateCompleteProduct,
  type CreateSimplifiedProduct,
  type RegistrationType,
} from "~/features/produtos/typings/createProduct";
import { transformProductDetailsToCreateProduct } from "~/features/produtos/utils/productTransform";
import ReprocessOrdersBySkuModal from "~/features/vendas/components/ReprocessOrdersBySkuModal/ReprocessOrdersBySkuModal";
import { useSyncCostsBySku } from "~/features/vendas/hooks";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { useModal } from "~/src/components/utils/Modal/useModal";
import toast from "~/src/utils/toast";
import ExtrasFields from "./ExtrasFields";
import ImageUploadSection from "./ImageUploadSection";
import MeasuresFields from "./MeasuresFields";
import PricingFields from "./PricingFields";
import ProductBasicFields from "./ProductBasicFields";
import { validateStep } from "./stepValidation";
import StockFields from "./StockFields";
import VariationsSection from "./VariationsSection";

interface ProductFormProps {
  registrationType: RegistrationType;
  productId?: string;
  allowUpgradeToComplete?: boolean;
}

type TabId =
  | "basic"
  | "pricing"
  | "measures"
  | "stock"
  | "extras"
  | "images"
  | "variations";

interface Tab {
  id: TabId;
  label: string;
  visible: boolean;
}

function extractSkusFromFormData(
  data: CreateSimplifiedProduct | CreateCompleteProduct
): string[] {
  const skus: string[] = [];
  if (data.variations && data.variations.length > 0) {
    data.variations.forEach((v) => {
      if (v.sku?.trim()) skus.push(v.sku.trim());
    });
  } else if (data.product.sku?.trim()) {
    skus.push(data.product.sku.trim());
  }
  return [...new Set(skus)];
}

export default function ProductForm({
  registrationType: initialRegistrationType,
  productId,
  allowUpgradeToComplete = false,
}: ProductFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModal();
  const syncCostsBySkuMutation = useSyncCostsBySku();
  const [showVariationsTab, setShowVariationsTab] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [hasVariations, setHasVariations] = useState(false);
  const [highestStepVisited, setHighestStepVisited] = useState(0);
  const [registrationType, setRegistrationType] = useState<RegistrationType>(
    initialRegistrationType
  );
  const [showUpgradeAlert, setShowUpgradeAlert] = useState(false);
  const [hasLoadedProductData, setHasLoadedProductData] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);

  const isEditMode = !!productId;
  const { data: productDetailsResponse, isLoading: isLoadingProduct } =
    useProductDetails(productId || "");

  const schema =
    registrationType === "simplified"
      ? CreateSimplifiedProductSchema
      : CreateCompleteProductSchema;

  const form = useForm<CreateSimplifiedProduct | CreateCompleteProduct>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      registration_type: registrationType,
      product: {
        sku: null,
        title: "",
        price_sale: 0,
        price_cost: 0,
        unity_type: "UNITY",
        product_origin: "NATIONAL",
        marketing_type: "RESALE",
        status: "ACTIVE",
        stock_handling: true,
        initial_quantity: 0,
        images: {
          product: [],
          marketplace: [],
          shipping: [],
        },
        category_name: "",
        available_quantity: 0,
        ...(registrationType === "complete" && {
          description: "",
          brand: "",
          internal_code: "",
          packaging_cost: 0,
          extra_cost: 0,
          minimum_quantity: 0,
          maximum_quantity: 0,
          ncm: "",
          ean: "",
          icms: false,
          cest: "",
          tax_replacement: false,
          brute_weight: 0,
          net_weight: 0,
          height: 0,
          width: 0,
          depth: 0,
        }),
      },
      variations: [],
    },
    mode: "onBlur",
  });

  const { watch, setValue, trigger, reset } = form;
  const watchedHasVariations = watch("variations");

  // Carrega os dados do produto quando estiver em modo de edição
  useEffect(() => {
    if (
      isEditMode &&
      productDetailsResponse?.success &&
      productDetailsResponse.data &&
      !hasLoadedProductData
    ) {
      const productDetails = productDetailsResponse.data;
      const currentRegistrationType =
        productDetails.product_registration_type === "Completo"
          ? "complete"
          : "simplified";

      // Sincroniza o registrationType com o tipo real do produto
      // Isso evita problemas quando o registrationType inicial não corresponde ao produto
      // (pode acontecer quando a query ainda não retornou na página de edição)
      // Sempre sincroniza o tipo com o produto real no primeiro carregamento
      if (registrationType !== currentRegistrationType) {
        // Atualiza o registrationType para corresponder ao produto
        setRegistrationType(currentRegistrationType);
      }

      // Se o produto é simplificado e permite upgrade, mostra o alerta
      if (currentRegistrationType === "simplified" && allowUpgradeToComplete) {
        setShowUpgradeAlert(true);
      }

      try {
        // Usa o currentRegistrationType para garantir que está correto
        const formData = transformProductDetailsToCreateProduct(
          productDetails,
          currentRegistrationType
        );
        reset(formData);

        // Configura o estado de variações
        const hasVariationsValue =
          productDetails.variations && productDetails.variations.length > 0;
        setHasVariations(hasVariationsValue);
        setShowVariationsTab(hasVariationsValue);

        // Marca que os dados foram carregados
        setHasLoadedProductData(true);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Erro ao carregar dados do produto";
        toast.error(message);
        navigate("/interno/produtos/gestao");
      }
    }
  }, [
    isEditMode,
    productDetailsResponse,
    registrationType,
    initialRegistrationType,
    allowUpgradeToComplete,
    hasLoadedProductData,
    reset,
    navigate,
  ]);

  const createProductMutation = useMutation({
    mutationFn: async (
      data: CreateSimplifiedProduct | CreateCompleteProduct
    ) => {
      if (isEditMode && productId) {
        const response = await produtosService.updateProduct(productId, data);
        if (!response.success) {
          throw new Error(response.message || "Erro ao atualizar produto");
        }
        return response;
      } else {
        const response = await produtosService.createProduct(data);
        if (!response.success) {
          throw new Error(response.message || "Erro ao criar produto");
        }
        return response;
      }
    },
    onSuccess: (response, formData) => {
      // Invalida o cache de produtos para atualizar a lista
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-metrics"] });
      if (isEditMode) {
        queryClient.invalidateQueries({
          queryKey: ["products", "details", productId],
        });
      }
      toast.success(
        response.data?.message ||
          (isEditMode
            ? "Produto atualizado com sucesso!"
            : "Produto criado com sucesso!")
      );

      const skus = extractSkusFromFormData(formData);
      const navigateToGestao = () => navigate("/interno/produtos/gestao");

      if (skus.length > 0) {
        openModal(
          <ReprocessOrdersBySkuModal
            skus={skus}
            onClose={() => {
              closeModal();
              navigateToGestao();
            }}
            onConfirm={() => {
              syncCostsBySkuMutation.mutate(skus, {
                onSettled: () => {
                  closeModal();
                  navigateToGestao();
                },
              });
            }}
            isLoading={syncCostsBySkuMutation.isPending}
          />,
          { title: "Produto salvo com sucesso!" }
        );
      } else {
        navigateToGestao();
      }
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          (isEditMode
            ? "Erro ao atualizar produto. Tente novamente."
            : "Erro ao criar produto. Tente novamente.")
      );
    },
  });

  const onSubmit = (data: CreateSimplifiedProduct | CreateCompleteProduct) => {
    createProductMutation.mutate(data);
  };

  const handleUpgradeToComplete = () => {
    setRegistrationType("complete");
    setShowUpgradeAlert(false);
    // Recarrega os dados com o novo tipo de registro
    if (productDetailsResponse?.success && productDetailsResponse.data) {
      try {
        const formData = transformProductDetailsToCreateProduct(
          productDetailsResponse.data,
          "complete"
        );
        reset(formData);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Erro ao atualizar formulário";
        toast.error(message);
      }
    }
  };

  const handleVariationsChange = (value: string) => {
    const hasVariationsValue = value === "yes";
    const previousSteps = getSteps();
    const previousVariationsIndex = previousSteps.findIndex(
      (step) => step.id === "variations"
    );
    const previousImagesIndex = previousSteps.findIndex(
      (step) => step.id === "images"
    );
    const previousPricingIndex = previousSteps.findIndex(
      (step) => step.id === "pricing"
    );
    const previousStockIndex = previousSteps.findIndex(
      (step) => step.id === "stock"
    );

    setHasVariations(hasVariationsValue);
    setShowVariationsTab(hasVariationsValue);

    if (!hasVariationsValue) {
      setValue("variations", []);
      // Se estiver na aba de variações, volta para a anterior
      if (
        activeStep === previousVariationsIndex &&
        previousVariationsIndex >= 0
      ) {
        setActiveStep(Math.max(0, previousVariationsIndex - 1));
      }
    } else {
      // Se tem variações, remove as abas de precificação, estoque e imagens
      if (!watchedHasVariations || watchedHasVariations.length === 0) {
        setValue("variations", []);
      }

      // Se estava em alguma das abas que serão removidas, ajusta o step
      const isOnRemovedStep =
        (activeStep === previousImagesIndex && previousImagesIndex >= 0) ||
        (activeStep === previousPricingIndex && previousPricingIndex >= 0) ||
        (activeStep === previousStockIndex && previousStockIndex >= 0);

      if (isOnRemovedStep) {
        // Vai para a aba anterior disponível (basic, measures ou extras)
        // ou para variações se já existir
        const basicIndex = previousSteps.findIndex(
          (step) => step.id === "basic"
        );
        const measuresIndex = previousSteps.findIndex(
          (step) => step.id === "measures"
        );
        const extrasIndex = previousSteps.findIndex(
          (step) => step.id === "extras"
        );

        // Tenta ir para extras, depois measures, depois basic
        let targetStep = basicIndex >= 0 ? basicIndex : 0;
        if (extrasIndex >= 0 && extrasIndex < activeStep) {
          targetStep = extrasIndex;
        } else if (measuresIndex >= 0 && measuresIndex < activeStep) {
          targetStep = measuresIndex;
        } else if (basicIndex >= 0) {
          targetStep = basicIndex;
        }

        setActiveStep(targetStep);
      }
    }

    // Lógica do SKU: se tem variações, limpa e desabilita o SKU
    if (hasVariationsValue) {
      setValue("product.sku", null);
      // Limpa os erros do SKU quando desabilita
      form.clearErrors("product.sku");
      // Limpa as imagens do produto quando tem variações
      setValue("product.images.product", []);
      setValue("product.images.marketplace", []);
      setValue("product.images.shipping", []);
      // Limpa os preços do produto quando tem variações (preços vão nas variações)
      setValue("product.price_sale", 0);
      setValue("product.price_cost", 0);
      if (registrationType === "complete") {
        setValue("product.packaging_cost", 0);
        setValue("product.extra_cost", 0);
      }
      // Limpa os campos de estoque do produto quando tem variações (estoque vai nas variações)
      setValue("product.stock_handling", false);
      setValue("product.initial_quantity", 0);
      setValue("product.available_quantity", 0);
      if (registrationType === "complete") {
        setValue("product.minimum_quantity", 0);
        setValue("product.maximum_quantity", 0);
      }
    } else {
      // Quando volta para "não", força a validação do SKU se estiver vazio
      const currentSku = form.getValues("product.sku");
      if (!currentSku || currentSku.trim() === "") {
        trigger("product.sku");
      }
    }
  };

  const getSteps = () => {
    const allSteps = [
      { id: "basic" as TabId, label: "Informações Básicas", visible: true },
      {
        id: "pricing" as TabId,
        label: "Precificação",
        visible: !showVariationsTab,
      }, // Só mostra se não tiver variações
      {
        id: "measures" as TabId,
        label: "Medidas",
        visible: registrationType === "complete",
      },
      { id: "stock" as TabId, label: "Estoque", visible: !showVariationsTab }, // Só mostra se não tiver variações
      {
        id: "extras" as TabId,
        label: "Extras",
        visible: registrationType === "complete",
      },
      { id: "images" as TabId, label: "Imagens", visible: !showVariationsTab }, // Só mostra se não tiver variações
      {
        id: "variations" as TabId,
        label: "Variações",
        visible: showVariationsTab,
      },
    ] satisfies Tab[];

    return allSteps.filter((step) => step.visible);
  };

  const steps = getSteps();

  // Ajusta o activeStep se o step atual não existir mais (ex: variações foi desmarcado ou imagens foi removido)
  useEffect(() => {
    const currentStep = steps[activeStep];
    if (!currentStep || activeStep >= steps.length) {
      // Se o step atual não existe mais, ajusta para o último step disponível
      setActiveStep(Math.max(0, steps.length - 1));
    }
  }, [steps, activeStep]);

  const getFieldsForStep = (stepId: TabId): string[] => {
    switch (stepId) {
      case "basic": {
        const basicFields = [
          "product.title",
          "product.status",
          "product.category_name",
        ];
        // Se não tem variações, SKU é obrigatório
        if (!hasVariations) {
          basicFields.push("product.sku");
        }
        return basicFields;
      }
      case "pricing": {
        const pricingFields = ["product.price_sale", "product.price_cost"];
        if (registrationType === "complete") {
          pricingFields.push("product.packaging_cost", "product.extra_cost");
        }
        return pricingFields;
      }
      case "measures":
        return []; // Campos de medidas são opcionais
      case "stock":
        return [
          "product.stock_handling",
          "product.initial_quantity",
          "product.available_quantity",
        ];
      case "extras":
        return []; // Campos extras são opcionais
      case "images":
        return []; // Imagens não são obrigatórias
      case "variations":
        return []; // Variações são opcionais
      default:
        return [];
    }
  };

  const handleNext = async (e?: MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();

    const currentStep = steps[activeStep];
    if (!currentStep) return;

    // Valida os campos do step atual
    const fieldsToValidate = getFieldsForStep(currentStep.id);

    if (fieldsToValidate.length > 0) {
      // Trigger validation no react-hook-form para mostrar os erros
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isValid = await trigger(fieldsToValidate as any);

      if (!isValid) {
        // Verifica se há erros específicos para mostrar mensagens mais detalhadas
        const formErrors = form.formState.errors;
        const hasSkuError = formErrors.product?.sku;

        if (hasSkuError) {
          toast.error(
            hasSkuError.message ||
              "Por favor, preencha o SKU antes de continuar"
          );
        } else {
          toast.error("Por favor, corrija os erros antes de continuar");
        }
        return;
      }
    }

    // Validação adicional com Zod para garantir consistência
    const formData = form.getValues();
    const validation = validateStep(
      currentStep.id,
      formData,
      registrationType,
      hasVariations
    );

    if (!validation.isValid) {
      // Mostra mensagens de erro específicas
      const errorMessages = Object.values(validation.errors);
      if (errorMessages.length > 0) {
        toast.error(
          errorMessages[0] || "Por favor, corrija os erros antes de continuar"
        );
      } else {
        toast.error("Por favor, corrija os erros antes de continuar");
      }
      return;
    }

    // Se passou na validação, avança para o próximo step
    if (activeStep < steps.length - 1) {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      // Atualiza o step máximo visitado
      setHighestStepVisited((prev) => Math.max(prev, nextStep));
    }
  };

  const handleBack = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Permite clicar em qualquer step que já foi visitado (completed)
    // ou no step atual
    if (stepIndex <= highestStepVisited || stepIndex === activeStep) {
      setActiveStep(stepIndex);
      // Atualiza o step máximo visitado se necessário
      setHighestStepVisited((prev) => Math.max(prev, stepIndex));
    }
  };

  const renderStepContent = () => {
    const currentStep = steps[activeStep];
    if (!currentStep) return null;

    switch (currentStep.id) {
      case "basic":
        return (
          <ProductBasicFields
            registrationType={registrationType}
            onVariationsChange={handleVariationsChange}
            hasVariations={hasVariations}
            onCreateCategoryClick={() => setIsCategoryModalOpen(true)}
          />
        );
      case "pricing":
        return <PricingFields registrationType={registrationType} />;
      case "measures":
        return <MeasuresFields registrationType={registrationType} />;
      case "stock":
        return <StockFields registrationType={registrationType} />;
      case "extras":
        return <ExtrasFields registrationType={registrationType} />;
      case "images":
        return <ImageUploadSection />;
      case "variations":
        return (
          <VariationsSection
            registrationType={registrationType}
            onCreateAttributeClick={() => setIsAttributeModalOpen(true)}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = activeStep === steps.length - 1;

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Se não estiver no último step, apenas avança para o próximo
    if (!isLastStep) {
      await handleNext();
      return;
    }

    // Se estiver no último step, valida todos os campos antes de fazer o submit
    const currentStep = steps[activeStep];
    if (currentStep) {
      const fieldsToValidate = getFieldsForStep(currentStep.id);

      if (fieldsToValidate.length > 0) {
        // Trigger validation no react-hook-form para mostrar os erros
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isValid = await trigger(fieldsToValidate as any);

        if (!isValid) {
          toast.error("Por favor, corrija os erros antes de salvar");
          return;
        }
      }

      // Validação adicional com Zod para garantir consistência
      const formData = form.getValues();
      const validation = validateStep(
        currentStep.id,
        formData,
        registrationType,
        hasVariations
      );

      if (!validation.isValid) {
        const errorMessages = Object.values(validation.errors);
        if (errorMessages.length > 0) {
          toast.error(
            errorMessages[0] || "Por favor, corrija os erros antes de salvar"
          );
        } else {
          toast.error("Por favor, corrija os erros antes de salvar");
        }
        return;
      }
    }

    // Valida todo o formulário antes de fazer o submit
    const isFormValid = await trigger();
    if (!isFormValid) {
      const errors = form.formState.errors;
      console.error("Erros de validação:", errors);
      toast.error("Por favor, corrija todos os erros antes de salvar");
      return;
    }

    // Se estiver no último step e tudo estiver válido, faz o submit normalmente
    const formData = form.getValues();
    console.log("Submetendo formulário:", formData);

    // Chama o onSubmit diretamente se a validação passou
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Erro ao submeter formulário:", error);
      toast.error("Erro ao salvar produto. Tente novamente.");
    }
  };

  // Mostra loading enquanto carrega os dados do produto
  if (isEditMode && isLoadingProduct) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beergam-blue-primary mx-auto mb-4"></div>
          <p className="text-beergam-gray-dark">
            Carregando dados do produto...
          </p>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleFormSubmit} className="">
        <Paper className="flex flex-col gap-6 border border-beergam-section-background">
          <div className="flex flex-col gap-4">
            {/* Alerta de upgrade para cadastro completo */}
            {showUpgradeAlert && (
              <Alert
                severity="info"
                action={
                  <div className="flex gap-2">
                    <Button
                      color="inherit"
                      size="small"
                      onClick={() => setShowUpgradeAlert(false)}
                    >
                      Manter Simplificado
                    </Button>
                    <Button
                      color="primary"
                      size="small"
                      onClick={handleUpgradeToComplete}
                    >
                      Deixar Completo
                    </Button>
                  </div>
                }
                sx={{ mb: 2 }}
              >
                Este produto está cadastrado como simplificado. Você pode
                atualizá-lo para cadastro completo para ter acesso a mais campos
                e funcionalidades.
              </Alert>
            )}

            {/* Stepper do MUI */}
            <Box sx={{ width: "100%", mb: 4 }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step, index) => (
                  <Step
                    key={step.id}
                    completed={index < activeStep}
                    sx={{
                      cursor:
                        index <= highestStepVisited ? "pointer" : "not-allowed",
                      opacity: index <= highestStepVisited ? 1 : 0.4,
                      "&:hover": {
                        opacity: index <= highestStepVisited ? 1 : 0.4,
                        transform:
                          index <= highestStepVisited
                            ? "scale(1.05)"
                            : "scale(1)",
                      },
                      "& .MuiStepLabel-root": {
                        cursor:
                          index <= highestStepVisited
                            ? "pointer"
                            : "not-allowed",
                      },
                      "& .MuiStepIcon-root": {
                        cursor:
                          index <= highestStepVisited
                            ? "pointer"
                            : "not-allowed",
                        opacity: index <= highestStepVisited ? 1 : 0.4,
                        color: "var(--color-beergam-primary)",
                        "&.Mui-completed": {
                          opacity: index <= highestStepVisited ? 1 : 0.4,
                          color: "var(--color-beergam-primary)",
                        },
                        "&.Mui-active": {
                          color: "var(--color-beergam-primary)",
                        },
                      },
                    }}
                    onClick={() => handleStepClick(index)}
                  >
                    <StepLabel>{step.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {/* Conteúdo do step ativo */}
            <Box sx={{ minHeight: "400px", py: 2 }}>{renderStepContent()}</Box>
          </div>

          {/* Botões de navegação */}
          <div className="flex justify-between gap-4 pt-4 border-t">
            <div className="flex gap-4">
              <BeergamButton
                title="Cancelar"
                mainColor="beergam-red"
                animationStyle="slider"
                type="button"
                onClick={() => navigate("/interno/produtos/gestao")}
                className="px-6"
              />
              {activeStep > 0 && (
                <BeergamButton
                  title="Voltar"
                  mainColor="beergam-gray"
                  animationStyle="slider"
                  type="button"
                  onClick={handleBack}
                  className="opacity-80! hover:opacity-100!"
                />
              )}
            </div>
            <div className="flex gap-4">
              {!isLastStep && (
                <BeergamButton
                  title="Próximo"
                  animationStyle="slider"
                  type="button"
                  onClick={handleNext}
                  className="px-6"
                />
              )}
              {isLastStep && (
                <BeergamButton
                  title={isEditMode ? "Atualizar Produto" : "Salvar Produto"}
                  animationStyle="slider"
                  type="submit"
                  icon="check"
                  disabled={createProductMutation.isPending}
                  fetcher={{
                    fecthing: createProductMutation.isPending,
                    completed: createProductMutation.isSuccess,
                    error: createProductMutation.isError,
                    mutation: createProductMutation,
                  }}
                />
              )}
            </div>
          </div>
        </Paper>
      </form>

      {/* Modais de criação rápida de Categoria e Atributo */}
      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        category={null}
      />
      <AttributeFormModal
        isOpen={isAttributeModalOpen}
        onClose={() => setIsAttributeModalOpen(false)}
        attribute={null}
      />
    </FormProvider>
  );
}

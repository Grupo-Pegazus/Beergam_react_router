import { Box, Chip, Paper, Switch } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { Fields } from "~/src/components/utils/_fields";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { TextCensored } from "~/src/components/utils/Censorship";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import { useChangeStatus, useProductDetails } from "../../hooks";
import type { ProductDetails, VariationFull } from "../../typings";
import ProductImageGallery from "./ProductImageGallery/ProductImageGallery";
interface ProductDetailsProps {
  // product: ProductDetails | VariationFull;
  productId: string;
}
export default function ProductDetails({ productId }: ProductDetailsProps) {
  const { data, isLoading, error } = useProductDetails(productId);
  const changeStatusMutation = useChangeStatus();
  const product = useMemo(() => {
    return data?.data;
  }, [data]);
  const hasVariations = product?.variations && product?.variations.length > 0;
  const [selectedProduct, setSelectedProduct] = useState<
    ProductDetails | VariationFull | null
  >(null);

  useEffect(() => {
    if (product) {
      if (hasVariations) {
        setSelectedProduct(product.variations[0]);
      } else {
        setSelectedProduct(product);
      }
    }
  }, [product]);
  const id = useMemo(() => {
    if (selectedProduct) {
      if (hasVariations) {
        return selectedProduct.product_variation_id;
      } else {
        return selectedProduct.product_id;
      }
    }
    return "Carregando...";
  }, [selectedProduct, hasVariations]);
  function InfoSection({
    title,
    children,
    className,
  }: {
    title: string;
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <Paper className="bg-beergam-section-background!">
        <h2 className="text-beergam-typography-primary!">{title}</h2>
        <div className={`flex gap-2 flex-wrap items-baseline ${className}`}>
          {children}
        </div>
      </Paper>
    );
  }
  function ProductInfo({
    product,
    isVariation,
  }: {
    product: ProductDetails | VariationFull | null;
    isVariation: boolean | undefined;
  }) {
    if (!product) return null;
    return (
      <>
        <div className="grid grid-cols-1 gap-4">
          <InfoSection title="Custos">
            <div className="flex items-baseline gap-2">
              <p>Preço de custo:</p>
              <h3>{formatCurrency(product.price_cost)}</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <p>Preço de venda:</p>
              <h3>{formatCurrency(product.price_sale)}</h3>
            </div>
          </InfoSection>
          <InfoSection title="Prévia de Estoque">
            <div className="flex items-baseline gap-2">
              <p>Quantidade disponível:</p>
              <h3>{selectedProduct?.available_quantity}</h3>
            </div>
            {!hasVariations && (
              <div className="flex items-baseline gap-2">
                <p>Quantidade inicial:</p>
                <p className="text-beergam-typography-tertiary!">
                  {selectedProduct?.initial_quantity || "0"}
                </p>
              </div>
            )}
            <div className="flex items-baseline gap-2">
              <p>Quantidade mínima:</p>
              <p className="text-beergam-typography-tertiary!">
                {selectedProduct?.minimum_quantity}
              </p>
            </div>
            <div className="flex items-baseline gap-2">
              <p>Quantidade máxima:</p>
              <p className="text-beergam-typography-tertiary!">
                {selectedProduct?.maximum_quantity}
              </p>
            </div>
          </InfoSection>
          <InfoSection className="flex-col" title="Informações Adicionais">
            <h3 className="text-beergam-typography-primary! mt-2">
              Informações Fiscais
            </h3>
            <div className="flex items-baseline gap-2 flex-wrap">
              <div className="flex items-baseline gap-2">
                <p>NCM:</p>
                <p className="text-beergam-typography-tertiary!">
                  {selectedProduct?.ncm || "Não informado"}
                </p>
              </div>
              {!hasVariations && (
                <div className="flex items-baseline gap-2">
                  <p>CEST:</p>
                  <p className="text-beergam-typography-tertiary!">
                    {selectedProduct?.cest || "Não informado"}
                  </p>
                </div>
              )}
              <div className="flex items-baseline gap-2">
                <p>EAN:</p>
                <p className="text-beergam-typography-tertiary!">
                  {selectedProduct?.ean || "Não informado"}
                </p>
              </div>
              <div className="flex items-baseline gap-2">
                <p>ICMS:</p>
                <p className="text-beergam-typography-tertiary!">
                  {selectedProduct?.icms ? "Sim" : "Não"}
                </p>
              </div>
              <div className="flex items-baseline gap-2">
                <p>Substituição Tributária:</p>
                <p className="text-beergam-typography-tertiary!">
                  {selectedProduct?.tax_replacement === undefined
                    ? "Não informado"
                    : selectedProduct?.tax_replacement
                      ? "Sim"
                      : "Não"}
                </p>
              </div>
            </div>
            <h3 className="text-beergam-typography-primary! mt-2">
              Custos Adicionais
            </h3>
            <div className="flex items-baseline gap-2 flex-wrap">
              <div className="flex items-baseline gap-2">
                <p>Custo Extra:</p>
                <p className="text-beergam-typography-tertiary!">
                  {selectedProduct?.extra_cost || "Não informado"}
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <div className="flex items-baseline gap-2">
                <p>Custo de Embalagem:</p>
                <p className="text-beergam-typography-tertiary!">
                  {selectedProduct?.packaging_cost || "Não informado"}
                </p>
              </div>
            </div>
            <h3 className="text-beergam-typography-primary! mt-2">
              Outras Informações
            </h3>
            <div className="flex items-baseline gap-2 flex-wrap">
              <div className="flex items-baseline gap-2">
                <p>Marca:</p>
                <p className="text-beergam-typography-tertiary!">
                  {selectedProduct?.brand || "Não informado"}
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <div className="flex items-baseline gap-2">
                <p>Código Interno:</p>
                <p className="text-beergam-typography-tertiary!">
                  {selectedProduct?.internal_code || "Não informado"}
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <div className="flex items-baseline gap-2">
                <p>Tipo de Unidade:</p>
                <p className="text-beergam-typography-tertiary!">
                  {selectedProduct?.unity_type || "Não informado"}
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <div className="flex items-baseline gap-2">
                <p>Origem do Produto:</p>
                <p className="text-beergam-typography-tertiary!">
                  {selectedProduct?.product_origin || "Não informado"}
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <div className="flex items-baseline gap-2">
                <p>Tipo de Marketing:</p>
                <p className="text-beergam-typography-tertiary!">
                  {selectedProduct?.marketing_type || "Não informado"}
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <div className="flex items-baseline gap-2">
                <p>Peso Bruto:</p>
                <p className="text-beergam-typography-tertiary!">
                  {selectedProduct?.brute_weight || "Não informado"}
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <div className="flex items-baseline gap-2">
                <p>Peso Líquido:</p>
                <p className="text-beergam-typography-tertiary!">
                  {selectedProduct?.net_weight || "Não informado"}
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <div className="flex items-baseline gap-2">
                <p>Largura:</p>
                <p className="text-beergam-typography-tertiary!">
                  {selectedProduct?.width || "Não informado"}
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <div className="flex items-baseline gap-2">
                <p>Altura:</p>
                <p className="text-beergam-typography-tertiary!">
                  {selectedProduct?.height || "Não informado"}
                </p>
              </div>
            </div>
          </InfoSection>
        </div>
      </>
    );
  }
  return (
    <div className="flex flex-col">
      <div className="flex md:flex-row flex-col items-start gap-2">
        {hasVariations && (
          <>
          <Fields.wrapper>
            <Fields.label text="Selecionar variação" />
            <Fields.select
              options={
                product?.variations.map((variation) => ({
                  value: variation.product_variation_id,
                  label: variation.title,
                })) || []
              }
              value={
                selectedProduct && "product_variation_id" in selectedProduct
                  ? selectedProduct.product_variation_id
                  : null
              }
              onChange={(e) => {
                const selectedVariation = product?.variations.find(
                  (v) => v.product_variation_id === e.target.value
                );
                if (selectedVariation) {
                  setSelectedProduct(selectedVariation);
                }
              }}
            />
          </Fields.wrapper>
          <div>
            {selectedProduct && selectedProduct.attributes && selectedProduct.attributes.length > 0 && (
              <Fields.wrapper>
                <Fields.label text="Atributos" />
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.attributes?.map((attr) => <div key={`${attr.name}-${attr.value.join(", ")}`}>
                  <Chip className="bg-beergam-section-background! text-beergam-typography-tertiary! border! border-beergam-input-border!" label={`${attr.name}: ${attr.value.join(", ")}`} size="small" />
                </div>)}
                </div>
              </Fields.wrapper>
            )}
          </div>
          </>
        )}
        <Fields.wrapper>
          <Fields.label text={`${selectedProduct && "status" in selectedProduct ? selectedProduct.status === "Ativo" ? "Ativo" : "Inativo" : "Carregando..."}`} />
          <Switch
           checked={selectedProduct && "status" in selectedProduct ? selectedProduct.status === "Ativo" : false}
           onChange={(e) => {
            if (selectedProduct && "status" in selectedProduct) {
              changeStatusMutation.mutate({
                productId: product?.product_id || "",
                variationId: selectedProduct.product_variation_id || "",
                status: e.target.checked ? "Ativo" : "Inativo",
              });
              setSelectedProduct({
                ...selectedProduct,
                status: e.target.checked ? "Ativo" : "Inativo",
              });
            }
          }} />
        </Fields.wrapper>
      </div>
      <div className="flex flex-col md:flex-row items-baseline gap-2">
        <h1 className="text-beergam-typography-primary!">
          {product?.title || "Produto não carregado"}
        </h1>
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <div className="flex items-baseline gap-2">
            <p className="text-beergam-typography-tertiary!">ID:</p>
            <p className="font-medium">{id}</p>
          </div>
          {selectedProduct?.sku && (
            <div className="flex items-baseline gap-2">
              <p className="text-beergam-typography-tertiary!">SKU:</p>
              <TextCensored
                className="flex!"
                maxCharacters={3}
                censorshipKey="produtos_list_details"
              >
                <p className="font-medium">{selectedProduct.sku}</p>
              </TextCensored>
            </div>
          )}
          <Chip
            label={product?.product_registration_type || "Carregando..."}
            size="small"
            sx={{
              bgcolor: "var(--color-beergam-orange-light)",
              color: "var(--color-beergam-orange-dark)",
              fontWeight: 600,
              maxWidth: "fit-content",
            }}
            icon={
              <Box
                component="span"
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "var(--color-beergam-orange)",
                }}
              />
            }
          />
          <div className="flex items-baseline gap-2">
            <p className="text-beergam-typography-tertiary!">Criado em:</p>
            <p className="font-medium">
              {dayjs(selectedProduct?.created_at).format("DD/MM/YYYY HH:mm") ||
                "Carregando..."}
            </p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-beergam-typography-tertiary!">Atualizado em:</p>
            <p className="font-medium">
              {dayjs(selectedProduct?.updated_at).format("DD/MM/YYYY HH:mm") ||
                "Carregando..."}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 my-4">
        <div className="w-full md:w-[50%]">
          <ProductInfo product={selectedProduct} isVariation={hasVariations} />
        </div>
        {selectedProduct && (
          <div className="w-full md:w-[50%]">
            <ProductImageGallery product={selectedProduct} />
            <div className="flex flex-wrap gap-2 mt-2">
              <BeergamButton title="Editar Produto" link={`/interno/produtos/editar/${product.product_id}`} icon="pencil" />
              <BeergamButton title="Ver Controle de Estoque" link={`/interno/produtos/estoque/${product.product_id}`} icon="box" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

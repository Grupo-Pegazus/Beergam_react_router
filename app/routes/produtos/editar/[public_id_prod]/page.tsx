import { useEffect } from "react";
import { useProductDetails } from "~/features/produtos/hooks";
import ProductForm from "../../cadastro/components/ProductForm";
import { useBreadcrumbCustomization } from "~/features/system/context/BreadcrumbContext";

export default function EditarProdutoPage({ productId }: { productId: string }) {
    const { setCustomLabel } = useBreadcrumbCustomization();
    const { data: productDetailsResponse } = useProductDetails(productId);
  
    // Determina o tipo de registro baseado no produto
    // Por padrão, assume simplificado até que os dados sejam carregados

    useEffect(() => {
        if (productDetailsResponse?.success && productDetailsResponse.data?.title) {
            setCustomLabel(`Editar ${productDetailsResponse.data.title}`);
        }
    }, [productDetailsResponse, setCustomLabel]);
    const registrationType =
      productDetailsResponse?.success &&
      productDetailsResponse.data?.product_registration_type === "Completo"
        ? "complete"
        : "simplified";
  
    // Permite upgrade apenas se o produto for simplificado
    const allowUpgrade =
      productDetailsResponse?.success &&
      productDetailsResponse.data?.product_registration_type === "Simplificado";
  
    return (
      <ProductForm
        registrationType={registrationType}
        productId={productId}
        allowUpgradeToComplete={allowUpgrade}
      />
    );
  }
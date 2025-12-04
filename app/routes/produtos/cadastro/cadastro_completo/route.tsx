import type { Route } from ".react-router/types/app/routes/produtos/cadastro/cadastro_completo/+types/route";
import { ProductForm, getFormConfig } from "~/features/produtos/components/ProductForm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Cadastro Completo" },
    { name: "description", content: "Cadastro Completo" },
  ];
}

export default function CadastroCompleto() {
  const config = getFormConfig("completo");

  const handleSubmit = async (data: Record<string, unknown>) => {
    console.log("Dados do formulário completo:", data);
    // Aqui você pode fazer a chamada à API para salvar o produto
  };

  return (
    <ProductForm
      config={{
        ...config,
        onSubmit: handleSubmit,
      }}
    />
  );
}

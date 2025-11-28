import type { Route } from ".react-router/types/app/routes/produtos/cadastro/cadastro_simplificado/+types/route";
import { ProductForm, getFormConfig } from "~/features/produtos/components/ProductForm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Cadastro Simplificado" },
    { name: "description", content: "Cadastro Simplificado" },
  ];
}

export default function CadastroSimplificado() {
  const config = getFormConfig("simplificado");

  const handleSubmit = async (data: Record<string, unknown>) => {
    console.log("Dados do formulário simplificado:", data);
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

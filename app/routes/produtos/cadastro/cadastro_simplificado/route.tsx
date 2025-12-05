import type { Route } from ".react-router/types/app/routes/produtos/cadastro/cadastro_simplificado/+types/route";
import ProductForm from "../components/ProductForm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Cadastro Simplificado" },
    { name: "description", content: "Cadastro Simplificado" },
  ];
}

export default function CadastroSimplificado() {
  return <ProductForm registrationType="simplified" />;
}

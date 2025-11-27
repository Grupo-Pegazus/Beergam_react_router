import type { Route } from ".react-router/types/app/routes/produtos/gestao/+types/route";
import ProdutosPage from "./page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Gestão de Produtos" },
    { name: "description", content: "Gestão de Produtos" },
  ];
}

export default function GestãoProdutos() {
  return (
    <ProdutosPage />
  );
}

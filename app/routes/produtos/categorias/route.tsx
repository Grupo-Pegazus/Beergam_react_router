import type { Route } from ".react-router/types/app/routes/produtos/categorias/+types/route";
import CategoriesList from "~/features/catalog/components/CategoriesList";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Categorias" },
    { name: "description", content: "Gerenciar categorias de produtos" },
  ];
}

export default function Categorias() {
  return (
    <CategoriesList />
  );
}

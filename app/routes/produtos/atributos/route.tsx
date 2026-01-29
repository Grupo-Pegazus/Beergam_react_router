import type { Route } from ".react-router/types/app/routes/produtos/atributos/+types/route";
import AttributesList from "~/features/catalog/components/AttributesList";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Atributos" },
    { name: "description", content: "Gerenciar atributos de produtos" },
  ];
}

export default function Atributos() {
  return <AttributesList syncPageWithUrl />;
}

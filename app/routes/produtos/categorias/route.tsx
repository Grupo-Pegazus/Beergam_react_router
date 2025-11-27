import type { Route } from ".react-router/types/app/routes/produtos/categorias/+types/route";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Categorias" },
    { name: "description", content: "Categorias" },
  ];
}

export default function Categorias() {
  return (
    <p>Categorias</p>
  );
}

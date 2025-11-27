import type { Route } from ".react-router/types/app/routes/produtos/estoque/+types/route";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Estoque" },
    { name: "description", content: "Estoque" },
  ];
}

export default function Estoque() {
  return (
    <p>Estoque</p>
  );
}

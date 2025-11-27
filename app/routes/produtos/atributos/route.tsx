import type { Route } from ".react-router/types/app/routes/produtos/atributos/+types/route";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Atributos" },
    { name: "description", content: "Atributos" },
  ];
}

export default function Atributos() {
  return (
    <p>Atributos</p>
  );
}

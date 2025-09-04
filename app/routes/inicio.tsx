import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Início" },
    { name: "description", content: "Início" },
  ];
}

export default function Inicio() {
  return <h1>Página de Início</h1>;
}

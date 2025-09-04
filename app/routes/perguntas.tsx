import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Perguntas" },
    { name: "description", content: "Perguntas" },
  ];
}

export default function Perguntas() {
  return <h1>Página de Perguntas</h1>;
}

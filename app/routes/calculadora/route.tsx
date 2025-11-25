import type { Route } from "./+types/route";
import CalculadoraPage from "./page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Calculadora - Beergam" },
    { name: "description", content: "Calculadora de rentabilidade de produtos" },
  ];
}

export default function CalculadoraRoute() {
  return <CalculadoraPage />;
}


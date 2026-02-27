import type { Route } from "./+types/route";
import ImportacaoSimplificadaPage from "./page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Importação Simplificada - Calculadora - Beergam" },
    {
      name: "description",
      content: "Calculadora de custos para importação simplificada com II e ICMS",
    },
  ];
}

export default function ImportacaoSimplificadaRoute() {
  return <ImportacaoSimplificadaPage />;
}

import type { Route } from ".react-router/types/app/routes/atendimento/mercado_livre/reclamacoes/+types/route";
import ReclamacoesPage from "./page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Reclamações" },
    { name: "description", content: "Reclamações" },
  ];
}

export default function Reclamacoes() {
  return (
    <ReclamacoesPage />
  );
}
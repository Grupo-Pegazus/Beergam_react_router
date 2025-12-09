import type { Route } from ".react-router/types/app/routes/atendimento/mercado_livre/perguntas/+types/route";
import PerguntasPage from "./page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Perguntas" },
    { name: "description", content: "Perguntas" },
  ];
}

export default function Perguntas() {
  return (
    <PerguntasPage />
  );
}

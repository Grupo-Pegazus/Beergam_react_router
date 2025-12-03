import type { Route } from ".react-router/types/app/routes/produtos/agendamento/+types/route";
import AgendamentoPage from "./page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Agendamento" },
    { name: "description", content: "Agendamento" },
  ];
}

export default function Agendamento() {
  return (
    <AgendamentoPage />
  );
}

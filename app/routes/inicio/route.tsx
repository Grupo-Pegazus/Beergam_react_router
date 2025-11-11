import type { Route } from ".react-router/types/app/routes/inicio/+types/route";
import InicioPage from "./page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Início" },
    { name: "description", content: "Início" },
  ];
}

export default function Inicio() {
  return (
    <InicioPage />
  );
}

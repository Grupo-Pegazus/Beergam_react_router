import type { Route } from ".react-router/types/app/routes/inicio/+types/route";
import { useSelector } from "react-redux";
import { type RootState } from "~/store";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Início" },
    { name: "description", content: "Início" },
  ];
}

export default function Inicio() {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <>
      <h1>Página de Início</h1>
      <p>Olá, {user?.nome}</p>
    </>
  );
}

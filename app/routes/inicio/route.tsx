import type { Route } from ".react-router/types/app/routes/inicio/+types/route";
import { isFree } from "~/features/plans/planUtils";
import authStore from "~/features/store-zustand";
import FreeHomePage from "./FreeHomePage";
import InicioPage from "./page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Início" },
    { name: "description", content: "Início" },
  ];
}

export default function Inicio() {
  const subscription = authStore.use.subscription();

  if (isFree(subscription)) {
    return <FreeHomePage />;
  }

  return <InicioPage />;
}

import type { Route } from ".react-router/types/app/routes/atendimento/mercado_livre/+types/route";
import { Navigate, Outlet, useLocation } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Atendimento Mercado Livre" },
    { name: "description", content: "Atendimento Mercado Livre" },
  ];
}

export default function AtendimentoMercadoLivre() {
  const location = useLocation();

  const isExactMercadoLivreRoute = 
    location.pathname === "/interno/mercado_livre"
  
  if (isExactMercadoLivreRoute) {
    return <Navigate to="/interno" replace />;
  }

  return (
    <Outlet />
  );
}

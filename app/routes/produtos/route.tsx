import type { Route } from ".react-router/types/app/routes/produtos/+types/route";
import { Navigate, Outlet, useLocation } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Produtos" },
    { name: "description", content: "Produtos" },
  ];
}

export default function Produtos() {
  const location = useLocation();

  const isExactProdutosRoute = 
    location.pathname === "/interno/produtos"
  
  if (isExactProdutosRoute) {
    return <Navigate to="/interno/produtos/gestao" replace />;
  }

  return (
    <Outlet />
  );
}

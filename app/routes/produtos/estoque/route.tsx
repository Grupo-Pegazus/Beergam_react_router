import type { Route } from ".react-router/types/app/routes/produtos/estoque/+types/route";
import StockDashboardPage from "./page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Dashboard de Estoque" },
    { name: "description", content: "Dashboard de controle de estoque" },
  ];
}

export default function StockDashboardRoute() {
  return <StockDashboardPage />;
}

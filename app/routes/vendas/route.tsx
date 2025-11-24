import type { Route } from ".react-router/types/app/routes/vendas/+types/route";
import VendasPage from "./page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Vendas" },
    { name: "description", content: "Vendas" },
  ];
}

export default function Vendas() {
  return (
    <VendasPage />
  );
}

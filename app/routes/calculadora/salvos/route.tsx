import type { Route } from "./+types/route";
import SavedCalculationsPage from "./page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cálculos Salvos - Beergam" },
    {
      name: "description",
      content: "Seus cálculos salvos de precificação, Shopee e importação",
    },
  ];
}

export default function SavedCalculationsRoute() {
  return <SavedCalculationsPage />;
}

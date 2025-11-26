import type { Route } from ".react-router/types/app/routes/vendas/[venda_id]/+types/route";
import VendasPage from "./page";
export default function VendasRoute({ params }: Route.ComponentProps) {
  const { venda_id } = params;
  return <VendasPage venda_id={venda_id} />;
}

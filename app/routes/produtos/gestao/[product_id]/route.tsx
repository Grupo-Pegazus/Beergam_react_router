import type { Route } from ".react-router/types/app/routes/produtos/gestao/[product_id]/+types/route";
import ProdutoPage from "./page";

export default function ProdutoRoute({ params }: Route.ComponentProps) {
  const { product_id } = params;
  return <ProdutoPage productId={product_id} />;
}
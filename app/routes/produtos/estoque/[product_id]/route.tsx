import type { Route } from ".react-router/types/app/routes/produtos/estoque/[product_id]/+types/route";
import StockControlPage from "./page";

export default function StockControlRoute({ params }: Route.ComponentProps) {
  const { product_id } = params;
  return <StockControlPage productId={product_id} />;
}


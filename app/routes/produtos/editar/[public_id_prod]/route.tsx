import type { Route } from ".react-router/types/app/routes/produtos/editar/[public_id_prod]/+types/route";
import EditarProdutoPage from "./page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Editar Produto" },
    { name: "description", content: "Editar Produto" },
  ];
}

export default function EditarProdutoRoute({ params }: Route.ComponentProps) {
  const { public_id_prod } = params;
  return <EditarProdutoPage productId={public_id_prod} />;
}

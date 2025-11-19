import type { Route } from ".react-router/types/app/routes/anuncios/[anuncio_id]/+types/route";
import AnuncioDetailsPage from "./page";

export default function AnuncioRoute({ params }: Route.ComponentProps) {
  const { anuncio_id } = params;
  return <AnuncioDetailsPage anuncio_id={anuncio_id} />;
}

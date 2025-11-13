import type { Route } from ".react-router/types/app/routes/anuncios/+types/route";
import AnunciosPage from "./page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Anúncios" },
    { name: "description", content: "Anúncios" },
  ];
}

export default function Anuncios() {
  return (
    <AnunciosPage />
  );
}

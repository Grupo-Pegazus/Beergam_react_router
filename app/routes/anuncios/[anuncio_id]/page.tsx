import AnuncioDetails from "~/features/anuncios/components/AnuncioDetails";

interface AnuncioDetailsPageProps {
  anuncio_id: string;
}

export default function AnuncioDetailsPage({ anuncio_id }: AnuncioDetailsPageProps) {
  return <AnuncioDetails anuncioId={anuncio_id} />;
}
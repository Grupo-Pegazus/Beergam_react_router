import { useParams } from "react-router";

export default function AnuncioPage() {
  const { anuncio_id } = useParams();
  
  return (
    <div>
      <h1>Anúncio: {anuncio_id}</h1>
      {/* Resto do componente */}
    </div>
  );
}
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Link, useParams } from "react-router";
import { getAnuncio } from "~/features/anuncios/service";
import { type AnuncioBase } from "~/features/anuncios/typings";
import AnuncioPage from "./page";

export default function AnuncioRoute() {
  const { anuncio_id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["anuncio", anuncio_id],
    queryFn: () => getAnuncio(anuncio_id as string),
    retry: false,
    refetchOnWindowFocus: false,
  });
  if (isLoading) {
    return <h1>Carregando...</h1>;
  }
  //   useEffect(() => {
  //     if (error) {
  //       toast.error("Erro ao buscar anúncio");
  //     }
  //   }, [error]);
  if (error) {
    console.log("error", new Date().toISOString());
    toast.error("Erro ao buscar anúncio");
    return <AnuncioPage error={true} anuncio={null} isLoading={isLoading} />;
  }
  if (data === null) {
    return <AnuncioPage error={true} anuncio={null} isLoading={isLoading} />;
  }

  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <Link key={i} to={`/interno/anuncios/${i}`}>
          Link para anúncio {i}
        </Link>
      ))}
      <AnuncioPage error={false} anuncio={data as AnuncioBase} />
    </>
  );
}

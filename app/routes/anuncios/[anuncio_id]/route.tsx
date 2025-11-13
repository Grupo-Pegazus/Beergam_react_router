import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useParams } from "react-router";
import { anuncioService } from "~/features/anuncios/service";
import AnuncioPage from "./page";

export default function AnuncioRoute() {
  const { anuncio_id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["anuncio", anuncio_id],
    queryFn: () => anuncioService.getAnuncio(anuncio_id as string),
    retry: false,
    refetchOnWindowFocus: false,
  });
  if (isLoading) {
    return <h1>Carregando...</h1>;
  }
  
  if (error) {
    console.log("error", new Date().toISOString());
    toast.error("Erro ao buscar anúncio");
    return <AnuncioPage error={true} anuncio={null} />;
  }
  if (data === null) {
    return <AnuncioPage error={true} anuncio={null} />;
  }
  return <AnuncioPage error={false} anuncio={data as any} />;
}

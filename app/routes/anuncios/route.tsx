import { useQuery } from "@tanstack/react-query";
import { anuncioService } from "~/features/anuncios/service";

export default function AnunciosPage() {

  const { data, isLoading, error } = useQuery({
    queryKey: ["anuncios"],
    queryFn: () => anuncioService.getAnuncios(),
  });

  if (isLoading) {
    return <h1>Carregando...</h1>;
  }
  if (error) {
    return <h1>Erro ao carregar anúncios</h1>;
  }

  if (data === null) {
    return <h1>Nenhum anúncio encontrado</h1>;
  }

  return (
    <div>
      <h1>Tela de anúncios</h1>
      {console.log(data?.data)}
    </div>
  );
}
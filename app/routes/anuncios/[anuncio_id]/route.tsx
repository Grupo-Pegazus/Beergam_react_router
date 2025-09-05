import { useParams } from "react-router";
import type { Route } from "../+types/route";


interface IAnuncio {
    id: string;
    nome: string;
    descricao: string;
}

const anuncios = {
    "1": {
        id: "1",
        nome: "Anúncio 1",
        descricao: "Descrição do anúncio 1"
    },
    "2": {
        id: "2",
        nome: "Anúncio 2",
        descricao: "Descrição do anúncio 2"
    },
    "3": {
        id: "3",
        nome: "Anúncio 3",
        descricao: "Descrição do anúncio 3"
    }
}

async function getAnuncio(anuncio_id: string) {
    // Simula um delay de API
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log("anuncio_id", anuncio_id);
    console.log("anuncios", anuncios[anuncio_id as keyof typeof anuncios]);
    
    return anuncios[anuncio_id as keyof typeof anuncios] as IAnuncio;
}

export async function clientLoader({
    params,
}: {params: {anuncio_id: string}}) {
    const anuncio = await getAnuncio(params.anuncio_id as string);
    return {
        anuncio
    };
}

export function HydrateFallback() {
    return <div>Loading...</div>;
  }

export default function AnuncioPage({ loaderData }: { loaderData: { anuncio: IAnuncio } }) {
  const anuncio = loaderData.anuncio;
  
  return (
    <div>
      <h1>Anúncio: {anuncio.nome}</h1>
      <p>{anuncio?.descricao}</p>
      <p>{JSON.stringify(anuncio)}</p>
    </div>
  );
}
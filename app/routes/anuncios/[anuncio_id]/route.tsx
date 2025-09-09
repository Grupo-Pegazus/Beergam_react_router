import { getAnuncio } from "~/features/anuncios/components/service";	
import { type AnuncioBase, AnuncioSchema } from "~/features/anuncios/components/typing";
import AnuncioPage from "./page";
export async function clientLoader({
    params,
}: {params: {anuncio_id: string}}) {
    const anuncio = await getAnuncio(params.anuncio_id as string);
    return {
        anuncio
    };
}

export function HydrateFallback() {
    return <AnuncioPage error={false} isLoading={true} anuncio={null} />;
  }

  export default function AnuncioRoute({ loaderData }: { loaderData: { anuncio: AnuncioBase } }) {
    const anuncio = loaderData.anuncio;
    const resultado = AnuncioSchema.safeParse(anuncio);
    
    if (!resultado.success) {
        return <AnuncioPage error={true} anuncio={null} />;
    }
    
    return <AnuncioPage error={false} anuncio={resultado.data} />;
  }
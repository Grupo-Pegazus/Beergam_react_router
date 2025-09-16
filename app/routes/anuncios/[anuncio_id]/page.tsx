import { AnuncioCard } from "~/features/anuncios/components/AnuncioCard/AnuncioCard";
import { type AnuncioBase } from "~/features/anuncios/typings";

interface AnuncioPageProps {
    error: boolean;
    isLoading?: boolean;
    anuncio: AnuncioBase | null;
}

export default function AnuncioPage({ error, isLoading = false, anuncio }: AnuncioPageProps) {
    if (error) {
        return <div>Anúncio não encontrado</div>;
    }
    return (
        <AnuncioCard anuncio={anuncio as AnuncioBase} isLoading={isLoading} />
    )
}
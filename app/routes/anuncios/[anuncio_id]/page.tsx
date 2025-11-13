interface AnuncioPageProps {
    error: boolean;
    anuncio: any; //TODO: implementar tipo de anúncio
}

export default function AnuncioPage({ error, anuncio }: AnuncioPageProps) {
    if (error) {
        return <div>Anúncio não encontrado</div>;
    }
    if (anuncio === null) {
        return <div>Anúncio não encontrado</div>;
    }
    return (
        <div>
            {anuncio}
        </div>
    )
}
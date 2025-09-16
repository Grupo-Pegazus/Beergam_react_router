import { type AnuncioBase, AnuncioSchema } from "../../typings";
import { Skeleton, Stack } from "@mui/material";

interface AnuncioCardProps {
    anuncio: AnuncioBase;
    isLoading: boolean;
}


export function AnuncioCard({ anuncio, isLoading }: AnuncioCardProps) {
    if (isLoading) {
        return (
            <Stack width={"300px"} height={"300px"}>
                <Skeleton variant="text" height={40} />
                <Skeleton variant="rectangular" height={100} />
                <Skeleton variant="rounded" height={40} />
            </Stack>
        );
    }
    try {
        const anuncioValidado = AnuncioSchema.parse(anuncio);
        return (
            <div>
                <h2>{anuncioValidado.title}</h2>
                <p>{`R$ ${anuncioValidado.price.toFixed(2).replace('.', ',')}`}</p>
            </div>
        );
    } catch {
        return (
            <div>
                <h2>Não foi possível validar o anúncio</h2>
            </div>
        );
    }
}

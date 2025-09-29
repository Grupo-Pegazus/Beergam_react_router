import type { AnuncioBase } from "./typings";

const anuncios = {
  "1": {
    id: "1",
    hh: "Anúncio 1",
    price: 100,
  },
  "2": {
    id: "2",
    title: "Anúncio 2",
    price: 200,
  },
  "3": {
    id: "3",
    caca: "Anúncio 3",
    price: 300,
  },
};

export async function getAnuncio(anuncio_id: string) {
  // Simula um delay de API
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const anuncio = anuncios[anuncio_id as keyof typeof anuncios] ?? null;

  return anuncio as AnuncioBase;
}

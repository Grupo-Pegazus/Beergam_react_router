// import { Link } from "react-router";
// import { getAnuncio } from "~/features/anuncios/service";
// import { type AnuncioBase, AnuncioSchema } from "~/features/anuncios/typings";
// import AnuncioPage from "./page";
// export async function clientLoader({
//   params,
// }: {
//   params: { anuncio_id: string };
// }) {
//   const anuncio = await getAnuncio(params.anuncio_id as string);
//   return {
//     anuncio,
//   };
// }
// export function HydrateFallback() {
//   return <p>Carregando...</p>;
// }
// clientLoader.hydrate = true;
// export default function AnuncioRoute({
//   loaderData,
// }: {
//   loaderData: { anuncio: AnuncioBase };
// }) {
//   const anuncio = loaderData.anuncio;
//   const resultado = AnuncioSchema.safeParse(anuncio);

//   if (!resultado.success) {
//     return <AnuncioPage error={true} anuncio={null} />;
//   }

//   return (
//     <>
//       {[0, 1, 2, 3].map((i) => (
//         <Link key={i} to={`/interno/anuncios/${i}`}>
//           Link para anúncio {i}
//         </Link>
//       ))}
//       <AnuncioPage error={false} anuncio={resultado.data} />
//     </>
//   );
// }
import { Link } from "react-router";
import type { Route } from "./+types/route";

export async function loader({ params }: Route.LoaderArgs) {
  const res = await fetch(
    `https://rickandmortyapi.com/api/character/${params.anuncio_id}`
  );
  const product = await res.json();
  console.log("product do route", product);
  return product;
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <h1>CARREGANDOOOOO ASPIJOIJAPSDSADO PKSDAOPKDSAOPKD ASD</h1>;
}

export default function Product({ loaderData }: Route.ComponentProps) {
  const { name, description } = loaderData;
  return (
    <div>
      {[0, 1, 2, 3].map((i) => (
        <Link key={i} to={`/interno/anuncios/${i}`}>
          Link para anúncio {i}
        </Link>
      ))}
      <h2>Teste</h2>
      <h1>{name}</h1>
      <p>{description}</p>
    </div>
  );
}

import * as z from "zod";


type ContaMarketPlace = {
    id: string;
    nome: string;
}

interface IUsuario {
    nome: string;
    idade: number;
    marketplace: ContaMarketPlace;
}

const UserSchema = z.object({
    nome: z.string(),
    idade: z.number(),
    marketplace: z.object({
        id: z.string(),
        nome: z.string(),
    }),
}) satisfies z.ZodType<IUsuario>;

const usuario = UserSchema.parse({nome: "John", idade: 3, marketplace: {id: "1", nome: "Mercado Livre"}});
console.log(usuario.nome)
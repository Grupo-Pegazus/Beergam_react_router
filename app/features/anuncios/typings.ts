import { z } from "zod";

export interface AnuncioBase {
    id: string;
    title: string;
    price: number;
}

export const AnuncioSchema = z.object({
    id: z.string(),
    title: z.string(),
    price: z.number(),
}) satisfies z.ZodType<AnuncioBase>;

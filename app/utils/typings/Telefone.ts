import { z } from "zod";

export const TelefoneSchema = z
  .string()
  .min(11, "Telefone inválido")
  .max(11, "Telefone inválido");

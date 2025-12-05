import { z } from "zod";

export const TelefoneSchema = z.preprocess(
  (v) => {
    if (typeof v === "string") {
      // Remove todos os caracteres não numéricos
      return v.replace(/\D/g, "");
    }
    return v;
  },
  z
    .string()
    .min(11, "Telefone inválido")
    .max(11, "Telefone inválido")
    .transform((v) => {
      const numbers = v.replace(/\D/g, "");
      if (numbers.length !== 11) return numbers;
      return `(${numbers.slice(0, 2)})${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    })
);

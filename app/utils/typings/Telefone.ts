import { z } from "zod";

// Entrada e saída sempre como string para evitar conflito de tipos com o resolver do React Hook Form
export const TelefoneSchema = z
  .string()
  .min(11, "Telefone inválido")
  .max(11, "Telefone inválido")
  .transform((v) => {
    // Remove todos os caracteres não numéricos antes de validar
    return v.replace(/\D/g, "");
  })
  .transform((v) => {
    const numbers = v.replace(/\D/g, "");
    if (numbers.length !== 11) return numbers;
    return `(${numbers.slice(0, 2)})${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  });

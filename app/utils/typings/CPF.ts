import { z } from "zod";

const validateCPF = (cpf: string) => {
  let Soma = 0;
  let Resto;

  const strCPF = String(cpf).replace(/\D/g, "");
  if (strCPF.length !== 11) return false;

  if (
    [
      "00000000000",
      "11111111111",
      "22222222222",
      "33333333333",
      "44444444444",
      "55555555555",
      "66666666666",
      "77777777777",
      "88888888888",
      "99999999999",
    ].indexOf(strCPF) !== -1
  )
    return false;

  for (let i = 1; i <= 9; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);

  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;

  if (Resto != parseInt(strCPF.substring(9, 10))) return false;

  Soma = 0;

  for (let i = 1; i <= 10; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);

  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;

  if (Resto != parseInt(strCPF.substring(10, 11))) return false;

  return true;
};

export const CPFSchema = z.preprocess(
  (v) => {
    // Se for null ou undefined, retorna null
    if (v === null || v === undefined) return null;
    // Converte para string e verifica se está vazia
    const str = String(v);
    if (str.trim() === "") return null;
    return str;
  },
  z
    .string()
    .nullable()
    .transform((v) => {
      // Se for null, retorna null
      if (v === null) return null;
      // Remove caracteres não numéricos
      return v.replace(/\D/g, "");
    })
    .refine((v) => v === null || v.length === 11, {
      message: "CPF deve ter 11 dígitos",
    })
    .refine((v) => v === null || validateCPF(v), { message: "CPF inválido" })
    .transform((v) => {
      if (v === null) return null;
      return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    })
);

export type CPF = z.infer<typeof CPFSchema>;

import { z } from "zod";

const validateCNPJ = (cnpj: string) => {
  cnpj = cnpj.replace(/\D+/g, "");
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const pesosPrimeiroDigito = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesosSegundoDigito = [6].concat(pesosPrimeiroDigito);

  let soma = 0;
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cnpj.charAt(i)) * pesosPrimeiroDigito[i];
  }
  let resto = soma % 11;
  const digito1 = resto < 2 ? 0 : 11 - resto;
  if (parseInt(cnpj.charAt(12)) !== digito1) return false;

  soma = 0;
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cnpj.charAt(i)) * pesosSegundoDigito[i];
  }
  resto = soma % 11;
  const digito2 = resto < 2 ? 0 : 11 - resto;
  if (parseInt(cnpj.charAt(13)) !== digito2) return false;

  return true;
};
export const CNPJSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ""))
  .refine((v) => v.length === 14, { message: "CNPJ deve ter 14 dígitos" })
  .refine((v) => validateCNPJ(v), { message: "CNPJ inválido" })
  .transform((v) =>
    v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
  );

export type CNPJ = z.infer<typeof CNPJSchema>;

import { z } from "zod";
import { UserPasswordSchema } from "~/features/auth/typing";
import { BaseUserName } from "~/features/user/typings/BaseUser";
import {
  UserComoConheceuSchema,
  UserProfitRangeSchema,
} from "~/features/user/typings/User";
import { CNPJSchema } from "~/utils/typings/CNPJ";
import { CPFSchema } from "~/utils/typings/CPF";
import { TelefoneSchema } from "~/utils/typings/Telefone";

// Os schemas globais de CPF/CNPJ permitem null (para campos opcionais em outros contextos),
// então aqui criamos versões "obrigatórias" específicas para o formulário de registro.
const RegistroCPFSchema = CPFSchema.refine((v) => v !== null, {
  message: "CPF é obrigatório",
});

const RegistroCNPJSchema = CNPJSchema.refine((v) => v !== null, {
  message: "CNPJ é obrigatório",
});

const BaseRegistroFormSchema = z.object({
  name: BaseUserName,
  email: z.email("Email inválido"),
  password: UserPasswordSchema,
  password_confirmation: UserPasswordSchema,
  phone: TelefoneSchema,
  referral_code: z.string().optional().nullable(),
  found_beergam: UserComoConheceuSchema.refine((v) => v !== null, {
    message: "Campo obrigatório",
  }),
  profit_range: UserProfitRangeSchema.refine((v) => v !== null, {
    message: "Campo obrigatório",
  }),
  /**
   * Campo discriminador que define qual documento será validado
   */
  document_type: z.enum(["CPF", "CNPJ"]),
  /**
   * Mantemos os dois campos para bater com o back-end,
   * mas vamos torná-los opcionais aqui e validar de forma condicional.
   */
  cpf: CPFSchema,
  cnpj: CNPJSchema,
});

export const RegistroFormSchema = z
  .discriminatedUnion("document_type", [
    BaseRegistroFormSchema.extend({
      document_type: z.literal("CPF"),
      cpf: RegistroCPFSchema, // obrigatório quando document_type = CPF
      cnpj: CNPJSchema.optional().nullable(),
    }),
    BaseRegistroFormSchema.extend({
      document_type: z.literal("CNPJ"),
      cnpj: RegistroCNPJSchema, // obrigatório quando document_type = CNPJ
      cpf: CPFSchema.optional().nullable(),
    }),
  ])
  .refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não coincidem",
    path: ["password_confirmation"],
  });

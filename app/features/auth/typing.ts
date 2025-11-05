import { z } from "zod";
import type { Subscription } from "../user/typings/BaseUser";

export interface MasterUserForm {
  email: string;
  password: string;
}

export interface ColaboradorUserForm {
  pin: string;
  password: string;
}
const UserPinSchema = z.string().refine((pin) => pin.length === 8, {
  message: "Pin deve ter exatamente 8 caracteres.",
});
const UserEmailSchema = z.email("E-mail inválido.");
export const UserPasswordSchema = z
  .string()
  .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
  .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula.")
  .regex(/\d/, "A senha deve conter pelo menos um número.")
  .regex(/[!@#$%^&*]/, "A senha deve conter pelo menos um caractere especial.")
  .refine(
    (pass) => pass.length >= 8,
    "A senha deve ter pelo menos 8 caracteres."
  );

export const MasterUserFormSchema = z.object({
  email: UserEmailSchema,
  password: UserPasswordSchema,
}) satisfies z.ZodType<MasterUserForm>;

export const ColaboradorUserFormSchema = z.object({
  pin: UserPinSchema,
  password: UserPasswordSchema,
}) satisfies z.ZodType<ColaboradorUserForm>;

export interface IAuthUser {
  subscription: Subscription | null;
}

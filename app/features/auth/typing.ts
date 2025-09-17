import { z } from "zod";

export interface MasterUserForm {
  email: string;
  password: string;
}

export interface ColaboradorUserForm {
  master_pin: string;
  pin: string;
  password: string;
}
const UserPinSchema = z.string().min(8).max(8);
const UserEmailSchema = z.email();
const UserPasswordSchema = z.string().refine((password) => {
  if (!/[A-Z]/.test(password)) {
    return { message: "A senha deve conter pelo menos uma letra maiúscula." };
  }
  if (!/[a-z]/.test(password)) {
    return { message: "A senha deve conter pelo menos uma letra minúscula." };
  }
  if (!/\d/.test(password)) {
    return { message: "A senha deve conter pelo menos um número." };
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return { message: "A senha deve conter pelo menos um caractere especial." };
  }
  return true;
});

export const MasterUserFormSchema = z.object({
  email: UserEmailSchema,
  password: UserPasswordSchema,
}) satisfies z.ZodType<MasterUserForm>;

export const ColaboradorUserFormSchema = z.object({
  master_pin: UserPinSchema,
  pin: UserPinSchema,
  password: UserPasswordSchema,
}) satisfies z.ZodType<ColaboradorUserForm>;

import { z } from "zod";
import { UserPasswordSchema } from "../auth/typing";

const UserEmailSchema = z.string().email("E-mail inválido.");

const RecoveryCodeSchema = z
  .string()
  .length(6, "O código deve ter exatamente 6 caracteres.")
  .regex(/^[0-9A-F]{6}$/, "O código deve conter apenas números e letras maiúsculas (A-F).");

export interface SendRecoveryCodeForm {
  email: string;
}

export interface ResetPasswordForm {
  email: string;
  code: string;
  new_password: string;
  confirm_password: string;
}

export const SendRecoveryCodeFormSchema = z.object({
  email: UserEmailSchema,
}) satisfies z.ZodType<SendRecoveryCodeForm>;

export const ResetPasswordFormSchema = z
  .object({
    email: UserEmailSchema,
    code: RecoveryCodeSchema,
    new_password: UserPasswordSchema,
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "As senhas não coincidem.",
    path: ["confirm_password"],
  }) satisfies z.ZodType<ResetPasswordForm>;


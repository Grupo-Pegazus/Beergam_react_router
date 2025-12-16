import { z } from "zod";
import { UserPasswordSchema } from "~/features/auth/typing";
import { BaseUserPin, UserRoles } from "~/features/user/typings/BaseUser";

// Formulários diferentes conforme o userRole
const MasterLoginFormSchema = z.object({
  userRole: z.literal(UserRoles.MASTER),
  email: z.email("Email inválido"),
  pin: BaseUserPin.optional().nullable(),
  password: UserPasswordSchema,
});

const ColabLoginFormSchema = z.object({
  userRole: z.literal(UserRoles.COLAB),
  email: z.email("Email inválido").optional().nullable(),
  pin: BaseUserPin,
  password: UserPasswordSchema,
});

export const LoginFormSchema = z.discriminatedUnion("userRole", [
  MasterLoginFormSchema,
  ColabLoginFormSchema,
]);

import z from "zod";
import {
  BaseMarketPlaceSchema,
  type BaseMarketPlace,
} from "~/features/marketplace/typings";
import type { MenuState } from "~/features/menu/typings";

export enum UserRoles {
  MASTER = "MASTER",
  COLAB = "COLAB",
}

export enum UserStatus {
  ACTIVE = "Ativo",
  INACTIVE = "Inativo",
}

export interface IBaseUser {
  name: string;
  role: UserRoles;
  allowed_views?: MenuState;
  status: UserStatus;
  marketplace_accounts?: BaseMarketPlace[] | null;
  pin?: string | null;
  master_pin?: string | null;
  created_at: Date;
  updated_at: Date;
}

export const BaseUserSchema = z.object({
  name: z
    .string()
    .regex(
      /^[a-zA-Z0-9-\s]{3,20}$/,
      "O nome deve ter entre 3 e 20 caracteres e conter apenas letras, números, espaços ou -."
    )
    .refine((value) => !/^\d+$/.test(value), {
      message: "O nome não pode ser apenas números.",
    })
    .min(3, "Nome precisa ter 3 caracteres")
    .max(20, "Nome não pode ter mais de 20 caracteres"),
  role: z.enum(Object.keys(UserRoles) as [UserRoles, ...UserRoles[]]),
  pin: z.string().optional().nullable(),
  master_pin: z.string().optional().nullable(),
  status: z.enum(Object.keys(UserStatus) as [UserStatus, ...UserStatus[]]),
  marketplace_accounts: z.array(BaseMarketPlaceSchema).optional().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
}) satisfies z.ZodType<IBaseUser>;

export function FormatUserStatus(status: UserStatus): keyof typeof UserStatus {
  return Object.values(UserStatus).find(
    (value) =>
      UserStatus[status as unknown as keyof typeof UserStatus] === value
  ) as unknown as keyof typeof UserStatus;
}
export function FormatUserRole(role: UserRoles): keyof typeof UserRoles {
  if (Object.values(UserRoles).includes(role)) {
    return role as keyof typeof UserRoles;
  }
  return UserRoles[role as keyof typeof UserRoles];
}

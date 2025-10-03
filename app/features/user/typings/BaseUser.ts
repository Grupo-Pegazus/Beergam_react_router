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

export const UserRolesKeys = Object.keys(UserRoles) as [
  UserRoles,
  ...UserRoles[],
];

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IBaseUser {
  name: string;
  role: UserRoles;
  allowed_views?: MenuState;
  status: UserStatus;
  marketplace_accounts?: BaseMarketPlace[] | null;
  pin?: string | null;
  master_pin?: string | null;
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
}) satisfies z.ZodType<IBaseUser>;

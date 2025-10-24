import { z } from "zod";
import {
  BaseUserDetailsSchema,
  BaseUserSchema,
  type IBaseUser,
} from "./BaseUser";
export type ColabAction = "Editar" | "Excluir" | "Visualizar";
export enum ColabLevel {
  ADMIN = "Administrador",
  NORMAL = "Normal",
}

interface IColabDetails {
  level: ColabLevel;
  photo_id?: string | null;
}

export const ColabDetailsSchema = BaseUserDetailsSchema.extend({
  level: z.enum(Object.keys(ColabLevel) as [ColabLevel, ...ColabLevel[]]),
  photo_id: z.string().optional().nullable(),
}) satisfies z.ZodType<IColabDetails>;

export interface IColab extends IBaseUser {
  details: IColabDetails;
  is_online?: boolean;
  last_online_update?: string | null;
}
export const ColabSchema = BaseUserSchema.extend({
  details: ColabDetailsSchema,
  is_online: z.boolean().optional().default(false),
  last_online_update: z.string().optional().nullable(),
}) satisfies z.ZodType<IColab>;

export function FormatColabLevel(level: ColabLevel): keyof typeof ColabLevel {
  if (Object.values(ColabLevel).includes(level)) {
    return level as unknown as keyof typeof ColabLevel;
  }
  return ColabLevel[
    level as unknown as keyof typeof ColabLevel
  ] as unknown as keyof typeof ColabLevel;
}

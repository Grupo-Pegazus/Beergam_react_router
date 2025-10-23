import { z } from "zod";
import { BaseUserSchema, type IBaseUser } from "./BaseUser";
export type ColabAction = "Editar" | "Excluir" | "Visualizar";
export enum ColabLevel {
  ADMIN = "Administrador",
  NORMAL = "Normal",
}

interface IColabDetails {
  level: ColabLevel;
}

export const ColabDetailsSchema = z.object({
  level: z.enum(Object.keys(ColabLevel) as [ColabLevel, ...ColabLevel[]]),
});

export interface IColab extends IBaseUser {
  details: IColabDetails;
}
export const ColabSchema = BaseUserSchema.extend({
  details: ColabDetailsSchema,
}) satisfies z.ZodType<IColab>;

export function FormatColabLevel(level: ColabLevel): keyof typeof ColabLevel {
  if (Object.values(ColabLevel).includes(level)) {
    return level as unknown as keyof typeof ColabLevel;
  }
  return ColabLevel[
    level as unknown as keyof typeof ColabLevel
  ] as unknown as keyof typeof ColabLevel;
}

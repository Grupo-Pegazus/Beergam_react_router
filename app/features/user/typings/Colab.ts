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
  level: z
    .union([
      z.enum(
        Object.keys(ColabLevel) as [
          keyof typeof ColabLevel,
          ...(keyof typeof ColabLevel)[],
        ]
      ), // keys
      z.enum(Object.values(ColabLevel) as [ColabLevel, ...ColabLevel[]]), // values
    ])
    .transform((value) => {
      if (Object.values(ColabLevel).includes(value as ColabLevel)) {
        // already value
        return value as ColabLevel;
      }
      // is a key: convert to value
      return ColabLevel[value as keyof typeof ColabLevel];
    }),
});

export interface IColab extends IBaseUser {
  details: IColabDetails;
}
export const ColabSchema = BaseUserSchema.extend({
  details: ColabDetailsSchema,
}) satisfies z.ZodType<IColab>;

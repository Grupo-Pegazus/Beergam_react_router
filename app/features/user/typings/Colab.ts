import { z } from "zod";
import { BaseUserSchema, type IBaseUser } from "./BaseUser";

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
console.log("testando");
export interface IColab extends IBaseUser {
  details: IColabDetails;
}
export const ColabSchema = BaseUserSchema.extend({
  details: ColabDetailsSchema,
}) satisfies z.ZodType<IColab>;

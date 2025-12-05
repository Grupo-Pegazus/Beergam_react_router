import { z } from "zod";
import { getDefaultViews } from "~/features/menu/utils";
import {
  AllowedTimesSchema,
  getEmptyAllowedTimes,
  type IAllowedTimes,
} from "./AllowedTimes";
import {
  BaseUserDetailsSchema,
  BaseUserSchema,
  UserRoles,
  UserStatus,
  type IBaseUser,
  type IBaseUserDetails,
} from "./BaseUser";

export enum ColabLevel {
  ADMIN = "Administrador",
  NORMAL = "Normal",
}

interface IColabDetails extends IBaseUserDetails {
  level: ColabLevel;
  photo_id?: string | null;
  allowed_times: IAllowedTimes;
}

export const ColabDetailsSchema = BaseUserDetailsSchema.extend({
  level: z.enum(Object.keys(ColabLevel) as [ColabLevel, ...ColabLevel[]]),
  photo_id: z.string().optional().nullable(),
  allowed_times: AllowedTimesSchema,
}) satisfies z.ZodType<IColabDetails>;

export interface IColab extends IBaseUser {
  details: IColabDetails;
  is_online?: boolean;
  last_online_update?: string | null;
}
export const ColabSchema = BaseUserSchema.extend({
  details: ColabDetailsSchema,
  is_online: z.boolean().optional().default(false),
  last_online_update: z.coerce.string().optional().nullable(), // Converter number para string
}) satisfies z.ZodType<IColab>;

export function FormatColabLevel(level: ColabLevel): keyof typeof ColabLevel {
  if (Object.values(ColabLevel).includes(level)) {
    return level as unknown as keyof typeof ColabLevel;
  }
  return ColabLevel[
    level as unknown as keyof typeof ColabLevel
  ] as unknown as keyof typeof ColabLevel;
}

export function getEmptyAllowedViews() {
  return getDefaultViews();
}

export function getDefaultColab(): IColab {
  return {
    name: "",
    pin: "",
    role: "COLAB" as UserRoles,
    status: "ACTIVE" as UserStatus,
    details: {
      level: "NORMAL" as ColabLevel,
      photo_id: "",
      allowed_times: getEmptyAllowedTimes(),
      allowed_views: getEmptyAllowedViews(),
    },
    created_at: new Date(),
    updated_at: new Date(),
    is_online: false,
    last_online_update: null,
  };
}

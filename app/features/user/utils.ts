import { UserRoles } from "./typings/BaseUser";
import type { IColab } from "./typings/Colab";
import { type IUser, ProfitRange } from "./typings/User";

export function isMaster(user: IUser | IColab): user is IUser {
  return user.role === UserRoles.MASTER;
}
export function isColab(user: IUser | IColab): user is IColab {
  return user.role === UserRoles.COLAB;
}

export function FormatProfitRange(profitRange: ProfitRange): string {
  return ProfitRange[profitRange as unknown as keyof typeof ProfitRange];
}

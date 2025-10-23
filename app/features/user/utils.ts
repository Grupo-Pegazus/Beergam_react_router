import { UserRoles } from "./typings/BaseUser";
import type { IColab } from "./typings/Colab";
import type { IUser } from "./typings/User";

export function isMaster(user: IUser | IColab): user is IUser {
  return user.role === UserRoles.MASTER;
}
export function isColab(user: IUser | IColab): user is IColab {
  return user.role === UserRoles.COLAB;
}

import { GestaoFinanceira, UserRoles } from "./typings/BaseUser";
import { ColabLevel, type IColab } from "./typings/Colab";
import {
  CalcProfitProduct,
  CalcTax,
  CurrentBilling,
  type IUser,
  NumberOfEmployees,
  ProfitRange,
  Segment,
} from "./typings/User";

export function isMaster(user: IUser | IColab): user is IUser {
  if (!user) return false;
  return user.role === UserRoles.MASTER;
}
export function isColab(user: IUser | IColab): user is IColab {
  if (!user) return false;
  return user.role === UserRoles.COLAB;
}

export function FormatProfitRange(profitRange: ProfitRange): string {
  return ProfitRange[profitRange as unknown as keyof typeof ProfitRange];
}

export function FormatCalcProfitProduct(
  calcProfitProduct: CalcProfitProduct
): string {
  return CalcProfitProduct[
    calcProfitProduct as unknown as keyof typeof CalcProfitProduct
  ];
}

export function FormatCalcTax(calcTax: CalcTax): string {
  return CalcTax[calcTax as unknown as keyof typeof CalcTax];
}

export function FormatNumberOfEmployees(
  numberOfEmployees: NumberOfEmployees
): string {
  return NumberOfEmployees[
    numberOfEmployees as unknown as keyof typeof NumberOfEmployees
  ];
}
export function FormatCurrentBilling(currentBilling: CurrentBilling): string {
  return CurrentBilling[
    currentBilling as unknown as keyof typeof CurrentBilling
  ];
}
export function FormatSegment(segment: Segment): string {
  return Segment[segment as unknown as keyof typeof Segment];
}
export function FormatColabLevel(level: ColabLevel): string {
  return ColabLevel[level as unknown as keyof typeof ColabLevel];
}
export function FormatGestaoFinanceira(
  gestaoFinanceira: GestaoFinanceira
): string {
  return GestaoFinanceira[
    gestaoFinanceira as unknown as keyof typeof GestaoFinanceira
  ];
}

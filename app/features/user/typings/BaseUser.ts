import z from "zod";
import {
  BaseMarketPlaceSchema,
  type BaseMarketPlace,
} from "~/features/marketplace/typings";
import type { MenuKeys, MenuState } from "~/features/menu/typings";
import { MenuConfig } from "~/features/menu/typings";

export enum UserRoles {
  MASTER = "MASTER",
  COLAB = "COLAB",
}

export enum UserStatus {
  ACTIVE = "Ativo",
  INACTIVE = "Inativo",
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  INCOMPLETE = "INCOMPLETE",
  PAST_DUE = "PAST_DUE",
  TRIALING = "TRIALING",
  PENDING = "PENDING",
}

export interface PlanBenefits {
  ML_accounts: number;
  colab_accounts: number;
  catalog_monitoring: number;
  dias_historico_vendas: number;
  dias_registro_atividades: number;
  gestao_financeira?: string | null;
  marketplaces_integrados: number;
  sincronizacao_estoque: boolean;
}

export interface Plan {
  display_name: string;
  price: number;
  benefits: PlanBenefits;
  is_current_plan?: boolean;
  price_id: string;
  price_id_3_months: string;
  price_3_months: number;
  price_id_6_months: string;
  price_6_months: number;
  price_id_1_year: string;
  price_1_year: number;
}

export interface SubscriptionPlan {
  display_name: string;
  benefits: PlanBenefits;
  is_affiliate_plan?: boolean;
}

export interface Subscription {
  start_date: Date;
  end_date: Date;
  free_trial_until?: Date | null;
  plan: SubscriptionPlan;
  status?: SubscriptionStatus;
}

export const PlanBenefitsSchema = z.object({
  ML_accounts: z.number(),
  colab_accounts: z.number(),
  catalog_monitoring: z.number(),
  dias_historico_vendas: z.number(),
  dias_registro_atividades: z.number(),
  gestao_financeira: z.string().optional().nullable(),
  marketplaces_integrados: z.number(),
  sincronizacao_estoque: z.boolean(),
}) satisfies z.ZodType<PlanBenefits>;

export const PlanSchema = z.object({
  display_name: z.string(),
  price: z.number(),
  benefits: PlanBenefitsSchema,
  is_current_plan: z.boolean(),
  price_id: z.string(),
  price_id_3_months: z.string(),
  price_3_months: z.number(),
  price_id_6_months: z.string(),
  price_6_months: z.number(),
  price_id_1_year: z.string(),
  price_1_year: z.number(),
}) satisfies z.ZodType<Plan>;

const DateCoerced = z.preprocess(
  (val) => {
    if (val === null || val === undefined || val === "") return undefined;
    if (val instanceof Date) return val;
    const parsed = new Date(String(val));
    return isNaN(parsed.getTime()) ? undefined : parsed;
  },
  z.date({ message: "Data inválida" })
);

export const SubscriptionSchema = z.object({
  start_date: DateCoerced,
  end_date: DateCoerced,
  free_trial_until: DateCoerced.optional().nullable(),
  plan: z
    .object({
      display_name: z.string(),
      is_affiliate_plan: z.boolean().optional(),
      benefits: z
        .object({
          ML_accounts: z.number(),
          colab_accounts: z.number(),
          catalog_monitoring: z.number(),
          dias_historico_vendas: z.number(),
          dias_registro_atividades: z.number(),
          gestao_financeira: z.string().optional().nullable(),
          marketplaces_integrados: z.number(),
          sincronizacao_estoque: z.boolean(),
        })
        .transform((b) => {
          const bi = b as PlanBenefits;
          const normalized: PlanBenefits = {
            ML_accounts: bi.ML_accounts,
            colab_accounts: bi.colab_accounts,
            catalog_monitoring: bi.catalog_monitoring,
            dias_historico_vendas: bi.dias_historico_vendas,
            dias_registro_atividades: bi.dias_registro_atividades,
            gestao_financeira: bi.gestao_financeira,
            marketplaces_integrados: bi.marketplaces_integrados,
            sincronizacao_estoque: bi.sincronizacao_estoque,
          };
          return normalized;
        }),
    })
    .transform(
      (p) =>
        ({
          display_name: p.display_name,
          benefits: p.benefits as PlanBenefits,
          is_affiliate_plan: p.is_affiliate_plan,
        }) as SubscriptionPlan
    ),
  status: z
    .enum(Object.keys(SubscriptionStatus) as [SubscriptionStatus, ...SubscriptionStatus[]])
    .optional(),
}) satisfies z.ZodType<Subscription>;

export interface IBaseUserDetails {
  // subscription?: Subscription | null;
  allowed_views?: MenuState;
}

export interface IBaseUser {
  name: string;
  role: UserRoles;
  status: UserStatus;
  marketplace_accounts?: BaseMarketPlace[] | null;
  pin?: string | null;
  master_pin?: string | null;
  created_at: Date;
  updated_at: Date;
}

export const BaseUserDetailsSchema = z.object({
  allowed_views: z
    .record(
      z.string(),
      z.object({
        access: z.boolean(),
        notifications: z.number().optional(),
      })
    )
    .optional()
    .nullable()
    .transform((views) => {
      if (!views || views === null) return undefined;
      const menuKeys = Object.keys(MenuConfig) as MenuKeys[];
      const result: MenuState = {} as MenuState;

      for (const key of menuKeys) {
        const viewData = views[key];
        result[key] = {
          access: viewData?.access ?? false,
          notifications: viewData?.notifications,
        };
      }
      return result;
    }),
});

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
  details: BaseUserDetailsSchema,
}) satisfies z.ZodType<IBaseUser>;

export function FormatUserStatus(status: UserStatus): UserStatus {
  return Object.values(UserStatus).find(
    (value) =>
      UserStatus[status as unknown as keyof typeof UserStatus] === value
  ) as UserStatus;
}
export function FormatUserRole(role: UserRoles): keyof typeof UserRoles {
  if (Object.values(UserRoles).includes(role)) {
    return role as keyof typeof UserRoles;
  }
  return UserRoles[role as keyof typeof UserRoles];
}

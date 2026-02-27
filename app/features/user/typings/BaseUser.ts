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
  ACTIVE = "Ativo",
  CANCELED = "Cancelado",
  INCOMPLETE = "Incompleto",
  PAST_DUE = "Vencido",
  TRIALING = "Em trial",
  PENDING = "Pendente",
}

export enum GestaoFinanceira {
  básica = "Básica",
  intermediário = "Intermediário",
  avançada = "Avançada",
}

export interface PlanBenefits {
  ML_accounts: number;
  colab_accounts: number;
  catalog_monitoring: number;
  dias_historico_vendas: number;
  dias_registro_atividades: number;
  gestao_financeira?: GestaoFinanceira | null;
  marketplaces_integrados: number;
  sincronizacao_estoque: boolean;
  clube_beergam?: boolean;
  comunidade_beergam?: boolean;
  ligacao_quinzenal?: boolean;
  novidades_beta?: boolean;
  recalculo_imposto_por_mes: number;
}

export interface Plan {
  display_name: string;
  price: number;
  benefits: PlanBenefits | null;
  is_current_plan?: boolean;
  price_id?: string;
  price_id_3_months?: string;
  price_3_months?: number;
  price_id_6_months?: string;
  price_6_months?: number;
  price_id_1_year?: string;
  price_1_year?: number;
  description?: string;
  is_affiliate_plan?: boolean;
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
  is_free_plan?: boolean;
  plan: Plan;
  status?: SubscriptionStatus;
}

export const PlanBenefitsSchema = z.object({
  ML_accounts: z.number(),
  colab_accounts: z.number(),
  catalog_monitoring: z.number(),
  dias_historico_vendas: z.number(),
  dias_registro_atividades: z.number(),
  gestao_financeira: z
    .enum(
      Object.keys(GestaoFinanceira) as [GestaoFinanceira, ...GestaoFinanceira[]]
    )
    .optional()
    .nullable(),
  marketplaces_integrados: z.number(),
  sincronizacao_estoque: z.boolean(),
  clube_beergam: z.boolean().optional(),
  comunidade_beergam: z.boolean().optional(),
  ligacao_quinzenal: z.boolean().optional(),
  novidades_beta: z.boolean().optional(),
  recalculo_imposto_por_mes: z.number(),
}) satisfies z.ZodType<PlanBenefits>;

export const PlanSchema = z.object({
  display_name: z.string(),
  price: z.preprocess((v) => {
    if (v === null || v === undefined || v === "") return 0;
    return Number(v);
  }, z.number()),
  benefits: PlanBenefitsSchema.nullable().catch(null),
  is_current_plan: z.boolean().optional().catch(false),
  price_id: z.string().optional().catch(""),
  price_id_3_months: z.string().optional().catch(""),
  price_3_months: z.number().optional().catch(0),
  price_id_6_months: z.string().optional().catch(""),
  price_6_months: z.number().optional().catch(0),
  price_id_1_year: z.string().optional().catch(""),
  price_1_year: z.number().optional().catch(0),
  description: z.string().optional().catch(""),
  is_affiliate_plan: z.boolean().optional().catch(false),
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
  is_free_plan: z.boolean().optional(),
  plan: PlanSchema,
  status: z.enum(
    Object.keys(SubscriptionStatus) as [
      SubscriptionStatus,
      ...SubscriptionStatus[],
    ]
  ),
}) satisfies z.ZodType<Subscription>;

export interface IBaseUserDetails {
  subscription?: Subscription | null;
  allowed_views?: MenuState;
}

export interface IBaseUser {
  name: string;
  role: UserRoles;
  status: UserStatus;
  marketplace_accounts?: BaseMarketPlace[] | null;
  pin?: string | null;
  master_pin?: string | null;
  access_cutoff_at?: number | null;
  access_window_reason?: string | null;
  created_at: Date;
  updated_at: Date;
}

export const BaseUserDetailsSchema = z.object({
  subscription: SubscriptionSchema.optional().nullable().catch(null),
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

export const BaseUserName = z
  .string()
  .regex(
    /^[a-zA-Z0-9-\s]{3,255}$/,
    "O nome deve ter entre 3 e 255 caracteres e conter apenas letras, números, espaços ou -."
  )
  .refine((value) => !/^\d+$/.test(value), {
    message: "O nome não pode ser apenas números.",
  })
  .min(3, "Nome precisa ter 3 caracteres")
  .max(255, "Nome não pode ter mais de 255 caracteres");
export const BaseUserRole = z.enum(
  Object.keys(UserRoles) as [UserRoles, ...UserRoles[]]
) satisfies z.ZodType<UserRoles>;
export const BaseUserStatus = z.enum(
  Object.keys(UserStatus) as [UserStatus, ...UserStatus[]]
) satisfies z.ZodType<UserStatus>;
export const BaseUserPin = z.string().optional().nullable();
export const BaseUserSchema = z.object({
  name: BaseUserName,
  role: BaseUserRole,
  pin: BaseUserPin.optional().nullable(),
  master_pin: z.string().optional().nullable(),
  status: BaseUserStatus,
  marketplace_accounts: z.array(BaseMarketPlaceSchema).optional().nullable(),
  access_cutoff_at: z.number().optional().nullable(),
  access_window_reason: z.string().optional().nullable(),
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

import { UserDetailsSchema, UserSchema } from "~/features/user/typings/User";

export const UpdateUserDetailsSchema = UserDetailsSchema.partial().pick({
  cpf: true,
  cnpj: true,
  secondary_phone: true,
  profit_range: true,
  calc_profit_product: true,
  calc_tax: true,
  tax_percent_fixed: true,
  current_billing: true,
  number_of_employees: true,
  sells_meli: true,
  sells_shopee: true,
  sells_amazon: true,
  sells_shein: true,
  sells_own_site: true,
  invoice_in_flex: true,
});
export const UpdateUserSchema = UserSchema.partial()
  .pick({ details: true })
  .extend({
    details: UpdateUserDetailsSchema,
  });

import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useForm, type Path, type Resolver } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import authBaseStore from "~/features/store-zustand";
import UserFields from "~/features/user/components/UserFields";
import { userService } from "~/features/user/service";
import type { IColab } from "~/features/user/typings/Colab";
import type { IUser } from "~/features/user/typings/User";
import {
  CalcProfitProduct,
  CalcTax,
  CurrentBilling,
  NumberOfEmployees,
  ProfitRange,
  UserSchema,
} from "~/features/user/typings/User";
import Section from "~/src/components/ui/Section";
import { Fields } from "~/src/components/utils/_fields";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { UpdateUserDetailsSchema, UpdateUserSchema } from "../typing";
import { useEffect } from "react";
export default function UserForm({ user }: { user: IUser }) {
  type editUserFormData = z.infer<typeof UserSchema>;
  const canEditSecondaryPhone = !user.details?.secondary_phone;

  const detailsSchema = canEditSecondaryPhone
    ? UpdateUserDetailsSchema
    : UpdateUserDetailsSchema.omit({ secondary_phone: true }).extend({
        secondary_phone: z.string().optional().nullable(),
      });

  const formSchema = UpdateUserSchema.omit({ details: true }).extend({
    details: detailsSchema,
  });
  const defaultValues = (user) as editUserFormData;
  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
    formState: { errors },
  } = useForm<editUserFormData>({
    resolver: zodResolver(formSchema) as unknown as Resolver<editUserFormData>,
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  useEffect(() => {
    if (!defaultValues) return;
    reset(defaultValues);
  }, [defaultValues, reset]);
  const editUserMutation = useMutation({
    mutationFn: (data: IUser) => userService.editUserInformation(data),
    onSuccess: (data) => {
      if (!data.success) {
        if (!Array.isArray(data.error_fields)) {
          throw new Error(data.message);
          return;
        }
        data.error_fields?.forEach((error) => {
          setError(`details.${error.key}` as Path<editUserFormData>, {
            type: "server",
            message: error.error,
          });
        });
        const errorMessage = `${data.error_fields?.map((error) => `${error.error}`).join("\n")}`;
        throw new Error(errorMessage);
      }
      reset(UserSchema.safeParse(data.data).data as editUserFormData);
    },
  });
  const onSubmit = async (data: editUserFormData) => {
    if (editUserMutation.isPending) return;
    const dataToSend = data as unknown as IUser;

    if (user.details?.cpf && dataToSend.details?.cpf)
      delete dataToSend.details.cpf;
    if (user.details?.cnpj && dataToSend.details?.cnpj)
      delete dataToSend.details.cnpj;
    if (user.details?.phone && dataToSend.details?.phone)
      delete dataToSend.details.phone;
    if (user.details?.secondary_phone && dataToSend.details?.secondary_phone)
      delete dataToSend.details.secondary_phone;
    try {
      // Faz a requisição para o backend
      const response = await editUserMutation.mutateAsync(dataToSend);

      toast.success("Informações do usuário editadas com sucesso");
      if (response.data) {
        authBaseStore
          .getState()
          .updateUserDetails(response.data as IUser | IColab);
      }
    } catch (error) {
      console.error("error do onSubmit", error);
      toast.error(`${error}`);
    }
  };
  return (
    <>
      <form>
        <Section title="Dados Pessoais" className="bg-beergam-mui-paper!">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <UserFields
              label="Nome"
              {...register("name")}
              value={watch("name") ?? ""}
              error={errors.name?.message}
              canAlter={false}
            />
            <UserFields
              label="E-mail"
              {...register("details.email")}
              value={watch("details.email") ?? ""}
              error={errors.details?.email?.message}
              canAlter={false}
            />
            <UserFields
              label="CPF"
              {...register("details.cpf")}
              value={watch("details.cpf") ?? ""}
              error={errors.details?.cpf?.message}
              canAlter={user.details?.cpf ? false : true}
            />
            <UserFields
              label="CNPJ"
              {...register("details.cnpj")}
              value={watch("details.cnpj") ?? ""}
              error={errors.details?.cnpj?.message}
              canAlter={user.details?.cnpj ? false : true}
            />
            <UserFields
              label="Telefone"
              {...register("details.phone")}
              value={watch("details.phone") ?? ""}
              error={errors.details?.phone?.message}
              canAlter={user.details?.phone ? false : true}
            />
            <UserFields
              label="Telefone Secundário"
              {...register("details.secondary_phone")}
              value={watch("details.secondary_phone") ?? ""}
              error={errors.details?.secondary_phone?.message}
              canAlter={user.details?.secondary_phone ? false : true}
            />
            <UserFields
              label="PIN"
              {...register("pin")}
              value={watch("pin") ?? ""}
              error={errors.pin?.message}
              canAlter={false}
              clipboard={true}
              hint="O PIN é usado para acessar o sistema de colaboradores e gerenciar as contas dos colaboradores."
            />
            <UserFields
              label="Código de Referência"
              {...register("details.personal_reference_code")}
              value={watch("details.personal_reference_code") ?? ""}
              error={errors.details?.personal_reference_code?.message}
              canAlter={false}
              clipboard={true}
              hint="Mande seu código de referência para seus colegas para que eles tenham 14 dias grátis."
            />
            <UserFields
              label="Usuários Indicados"
              {...register("sub_count")}
              value={watch("sub_count") ?? ""}
              error={errors.sub_count?.message}
              canAlter={false}
              hint="Quantidade de usuários que usaram seu código de referência para se cadastrar."
            />
          </div>
        </Section>
        <Section title="Dados Financeiros" className="bg-beergam-mui-paper!">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <UserFields
              label="Faturamento Mensal"
              {...register("details.profit_range")}
              value={watch("details.profit_range") ?? ""}
              error={errors.details?.profit_range?.message}
              canAlter={true}
              options={Object.keys(ProfitRange).map((key) => ({
                value: key,
                label: ProfitRange[key as keyof typeof ProfitRange],
              }))}
            />
            <UserFields
              label="Cálculo de Lucro do Produto"
              {...register("details.calc_profit_product")}
              value={watch("details.calc_profit_product") ?? ""}
              error={errors.details?.calc_profit_product?.message}
              nullable
              canAlter={true}
              options={Object.keys(CalcProfitProduct).map((key) => ({
                value: key,
                label: CalcProfitProduct[key as keyof typeof CalcProfitProduct],
              }))}
            />
            <UserFields
              label="Cálculo de Imposto"
              {...register("details.calc_tax")}
              value={watch("details.calc_tax") ?? ""}
              error={errors.details?.calc_tax?.message}
              nullable
              canAlter={true}
              options={Object.keys(CalcTax).map((key) => ({
                value: key,
                label: CalcTax[key as keyof typeof CalcTax],
              }))}
            />
            {(watch("details.calc_tax") as string) === "VALOR_PORCENTAGEM_FIXA" && (
              <UserFields
                label="Cálculo Fixo de Imposto (%)"
                {...register("details.tax_percent_fixed")}
                value={watch("details.tax_percent_fixed") ?? ""}
                error={errors.details?.tax_percent_fixed?.message}
                canAlter={true}
              />
            )}
            <UserFields
              label="Valor pago no flex por pedido no Mercado Livre"
              {...register("details.meli_flex_shipping_fee")}
              value={watch("details.meli_flex_shipping_fee") ?? ""}
              error={errors.details?.meli_flex_shipping_fee?.message}
              canAlter={true}
            />
            <UserFields
              label="Faturador Atual"
              {...register("details.current_billing")}
              value={watch("details.current_billing") ?? ""}
              error={errors.details?.current_billing?.message}
              canAlter={true}
              nullable
              options={Object.keys(CurrentBilling).map((key) => ({
                value: key,
                label: CurrentBilling[key as keyof typeof CurrentBilling],
              }))}
            />
            <UserFields
              label="Número de Empregados"
              {...register("details.number_of_employees")}
              value={watch("details.number_of_employees") ?? ""}
              error={errors.details?.number_of_employees?.message}
              canAlter={true}
              nullable
              options={Object.keys(NumberOfEmployees).map((key) => ({
                value: key,
                label: NumberOfEmployees[key as keyof typeof NumberOfEmployees],
              }))}
            />
            <UserFields
              label="Vendas no Mercado Livre"
              {...register("details.sells_meli")}
              value={watch("details.sells_meli") ?? ""}
              error={errors.details?.sells_meli?.message}
              canAlter={true}
            />
            <UserFields
              label="Vendas no Shopee"
              {...register("details.sells_shopee")}
              value={watch("details.sells_shopee") ?? ""}
              error={errors.details?.sells_shopee?.message}
              canAlter={true}
            />
            <UserFields
              label="Vendas no Amazon"
              {...register("details.sells_amazon")}
              value={watch("details.sells_amazon") ?? ""}
              error={errors.details?.sells_amazon?.message}
              canAlter={true}
            />
            <UserFields
              label="Vendas no Shein"
              {...register("details.sells_shein")}
              value={watch("details.sells_shein") ?? ""}
              error={errors.details?.sells_shein?.message}
              canAlter={true}
            />
            <UserFields
              label="Vendas no Site Próprio"
              {...register("details.sells_own_site")}
              value={watch("details.sells_own_site") ?? ""}
              error={errors.details?.sells_own_site?.message}
              canAlter={true}
            />
            <Fields.wrapper>
              <Fields.label text="Emite Nota Fiscal em Flex" />
              <Switch
                checked={watch("details.invoice_in_flex") ?? false}
                {...register("details.invoice_in_flex")}
              />
            </Fields.wrapper>
          </div>
        </Section>
      </form>
      <BeergamButton
        fetcher={{
          fecthing: editUserMutation.isPending,
          completed: editUserMutation.isSuccess,
          error: editUserMutation.isError,
          mutation: editUserMutation,
        }}
        title="Salvar"
        type="submit"
        className="mb-4 md:mb-0 md:w-xs"
        onClick={handleSubmit(onSubmit, (errors) => {
          toast.error("Você possui erros pendentes no formulário.");
          console.log("Erros de validação:", errors);
        })}
      />
    </>
  );
}

import { useMutation } from "@tanstack/react-query";
import { useReducer } from "react";
// import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@mui/material";
import { useForm, type Resolver } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import {
  MenuConfig,
  type MenuKeys,
  type MenuState,
} from "~/features/menu/typings";
import UserFields from "~/features/user/components/UserFields";
import { userService } from "~/features/user/service";
import type { IColab } from "~/features/user/typings/Colab";
import {
  CalcProfitProduct,
  CalcTax,
  CurrentBilling,
  NumberOfEmployees,
  ProfitRange,
  UserSchema,
  type IUser,
} from "~/features/user/typings/User";
import Section from "~/src/components/ui/Section";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { Fields } from "~/src/components/utils/_fields";
export default function MinhaConta({ user }: { user: IUser | IColab }) {
  type editUserFormData = z.infer<typeof UserSchema>;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<editUserFormData>({
    resolver: zodResolver(UserSchema) as unknown as Resolver<editUserFormData>,
    defaultValues: user as editUserFormData,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const [editedUser, setEditedUser] = useReducer(
    (
      state: typeof user,
      action: { type: "update"; payload: Partial<typeof user> }
    ) => {
      if (!state) return state;
      return { ...state, ...action.payload } as typeof user;
    },
    user as typeof user
  );
  const editedUserValidation = UserSchema.safeParse(editedUser);

  const allowedViews = user.details.allowed_views ?? ({} as MenuState);
  const accessList = Object.keys(MenuConfig).map((key) => ({
    key,
    label: MenuConfig[key as MenuKeys].label,
    access: allowedViews?.[key as MenuKeys]?.access ?? false,
  }));
  const colabMutation = useMutation({
    mutationFn: () => userService.getColabs(),
  });
  const handleChange = (payload: Partial<typeof user>) => {
    setEditedUser({ type: "update", payload });
  };
  const onSubmit = (data: editUserFormData) => {
    toast.success("Informações do usuário editadas com sucesso");
    console.log(data);
  };

  return (
    <>
      {/* {isMaster(editedUser) && isMaster(user) && (
        <>
          <p>{JSON.stringify(editedUserValidation.success)}</p>
          <Section
            title="Dados Pessoais"
            className="bg-beergam-white"
            actions={<BeergamButton title="Salvar" />}
          >
            <>
              <div className="grid grid-cols-3 gap-4">
                <Fields.input {...register("name")} />
                <>
                  <Fields.input {...register("name")} />
                  <Fields.input {...register("name")} />
                  <Fields.input {...register("name")} />
                  <Fields.input {...register("name")} />
                  <Fields.input {...register("name")} />
                </>
              </div>
              <div className="grid grid-cols-3 mt-4">
                <Fields.input {...register("name")} />
                <Fields.input {...register("name")} />
                <Fields.input {...register("name")} />
              </div>
            </>
          </Section>
          <Section title="Dados Financeiros" className="bg-beergam-white">
            <div className="grid grid-cols-3 gap-4">
              <Fields.input {...register("name")} />
              <Fields.input {...register("name")} />
              <Fields.input {...register("name")} />
              <Fields.input {...register("name")} />
              <Fields.input {...register("name")} />
              <Fields.input {...register("name")} />
              <Fields.input {...register("name")} />
              <Fields.input {...register("name")} />
              <Fields.input {...register("name")} />
              <Fields.input {...register("name")} />
              <Fields.input {...register("name")} />
              <Fields.wrapper>
                <Fields.label text="Emite nota fiscal em flex" />
                <Switch
                  checked={editedUser.details.invoice_in_flex ?? false}
                  onChange={() => {}}
                />
              </Fields.wrapper>
            </div>
          </Section>
        </>
      )}
      {isColab(editedUser) && isColab(user) && (
        <>
          <Section title="Dados do Colaborador" className="bg-beergam-white">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-start gap-2">
                <ColabPhoto
                  photo_id={editedUser.details.photo_id}
                  name={editedUser.name}
                  masterPin={editedUser.master_pin}
                  size="large"
                />
                <Fields.input {...register("name")} />
              </div>

              <Fields.input {...register("name")} />
              <Fields.input {...register("name")} />
            </div>
          </Section>
          <Section
            title="Horários de funcionamento"
            className="bg-beergam-white"
          >
            <AllowedTimes schedule={editedUser.details.allowed_times} />
          </Section>
          <Section title="Acessos Permitidos" className="bg-beergam-white">
            <AllowedViews accessList={accessList} />
          </Section>
        </>
      )} */}
      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          toast.error("Você possui erros pendentes no formulário.");
          console.log("Erros de validação:", errors);
        })}
      >
        <Section
          title="Dados Pessoais"
          className="bg-beergam-white"
          actions={<BeergamButton title="Salvar" type="submit" />}
        >
          <div className="grid grid-cols-3 gap-4">
            <UserFields
              label="Nome"
              {...register("name")}
              error={errors.name?.message}
              canAlter={false}
            />
            <UserFields
              label="E-mail"
              {...register("details.email")}
              error={errors.details?.email?.message}
              canAlter={false}
            />
            <UserFields
              label="CPF"
              {...register("details.cpf")}
              error={errors.details?.cpf?.message}
              canAlter={user.details?.cpf ? false : true}
            />
            <UserFields
              label="CNPJ"
              {...register("details.cnpj")}
              error={errors.details?.cnpj?.message}
              canAlter={user.details?.cnpj ? false : true}
            />
            <UserFields
              label="Telefone"
              {...register("details.phone")}
              error={errors.details?.phone?.message}
              canAlter={user.details?.phone ? false : true}
            />
            <UserFields
              label="Telefone Secundário"
              {...register("details.secondary_phone")}
              error={errors.details?.secondary_phone?.message}
              canAlter={user.details?.secondary_phone ? false : true}
            />
            <UserFields
              label="PIN"
              {...register("pin")}
              error={errors.pin?.message}
              canAlter={false}
              clipboard={true}
            />
            <UserFields
              label="Código de Referência"
              {...register("details.personal_reference_code")}
              error={errors.details?.personal_reference_code?.message}
              canAlter={false}
              clipboard={true}
            />
            <UserFields
              label="Usuários Indicados"
              {...register("sub_count")}
              error={errors.sub_count?.message}
              canAlter={false}
            />
          </div>
        </Section>
        <Section
          title="Dados Financeiros"
          className="bg-beergam-white"
          actions={<BeergamButton title="Salvar" type="submit" />}
        >
          <div className="grid grid-cols-3 gap-4">
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
            <UserFields
              label="Cálculo Fixo de Imposto"
              {...register("details.tax_percent_fixed")}
              error={errors.details?.tax_percent_fixed?.message}
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
              <Switch {...register("details.invoice_in_flex")} />
            </Fields.wrapper>
          </div>
        </Section>
        <p className="mt-2">Form válido: {isValid ? "Sim" : "Não"}</p>
      </form>
    </>
  );
}

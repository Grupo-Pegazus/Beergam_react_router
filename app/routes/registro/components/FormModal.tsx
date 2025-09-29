import { CNPJSchema } from "app/utils/typings/CNPJ";
import { CPFSchema } from "app/utils/typings/CPF";
import { useEffect, useReducer, useState } from "react";
import { Form, Link, useActionData } from "react-router";
import { z } from "zod";
import type { ApiResponse } from "~/features/apiClient/typings";
import { UserPasswordSchema } from "~/features/auth/typing";
import { getDefaultViews } from "~/features/menu/utils";
import {
  ComoConheceu,
  Faixaprofit_range,
  UserSchema,
  UsuarioRoles,
  type ComoConheceuKeys,
  type Faixaprofit_rangeKeys,
  type IUsuario,
} from "~/features/user/typings";
import { Fields } from "~/src/components/utils/_fields";
import type { InputError } from "~/src/components/utils/_fields/typings";
import type { clientAction } from "../route";
type UserDocuments = "CPF" | "CNPJ";
export default function FormModal() {
  const data = useActionData<typeof clientAction>() as ApiResponse | null;
  const [actionData, setActionData] = useReducer(
    (
      state: ApiResponse | null,
      action: ApiResponse | null
    ): ApiResponse | null => {
      if (!state) return action as ApiResponse;
      return { ...state, ...action };
    },
    data
  );
  useEffect(() => {
    setActionData(data);
  }, [data]);
  const [currentDocument, setCurrentDocument] = useState<UserDocuments>("CPF");
  const [password, setPassword] = useState("");
  const [isSubmited, setIsSubmited] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const documentToValidate = currentDocument == "CPF" ? CPFSchema : CNPJSchema;
  const [UserInfo, setUserInfo] = useReducer(
    (state: IUsuario, action: Partial<IUsuario>) => {
      return { ...state, ...action };
    },
    {
      name: "",
      role: UsuarioRoles.MASTER,
      email: "",
      cpf: undefined,
      cnpj: undefined,
      phone: "",
      found_beergam: undefined,
      profit_range: undefined,
      personal_reference_code: undefined,
      referral_code: undefined,
      allowed_views: getDefaultViews(),
      conta_marketplace: undefined,
    } as IUsuario
  );
  const parseUserResult = UserSchema.safeParse(UserInfo);
  const UserFieldErrors = parseUserResult.success
    ? {
        properties: {
          name: { errors: [""] },
          role: { errors: [""] },
          allowed_views: { errors: [""] },
          email: { errors: [""] },
          cpf: { errors: [""] },
          cnpj: { errors: [""] },
          phone: { errors: [""] },
          personal_reference_code: { errors: [""] },
          referral_code: { errors: [""] },
          profit_range: { errors: [""] },
          found_beergam: { errors: [""] },
        },
      }
    : z.treeifyError(parseUserResult.error);

  const ConfirmPasswordSchema = z.string().refine((pass) => pass === password, {
    message: "As senhas não coincidem",
  });
  const confirmPasswordResult =
    ConfirmPasswordSchema.safeParse(confirmPassword);
  const passwordResult = UserPasswordSchema.safeParse(password);
  const passwordError = passwordResult.success
    ? { errors: [] }
    : z.treeifyError(passwordResult.error);
  const docValue = currentDocument === "CPF" ? UserInfo.cpf : UserInfo.cnpj;
  const docResult = documentToValidate.safeParse(docValue);
  const docError = docResult.success
    ? { message: "", error: false }
    : {
        message: `${currentDocument} inválido	`,
        error: true,
      };
  function HandleSubmit(): boolean {
    if (UserInfo.referral_code == "") {
      UserInfo.referral_code = null;
    }
    if (!UserSchema.safeParse(UserInfo).success) {
      return false;
    }
    if (!ConfirmPasswordSchema.safeParse(confirmPassword).success) {
      return false;
    }
    if (!UserPasswordSchema.safeParse(password).success) {
      return false;
    }
    if (!parseUserResult.success) {
      return false;
    }
    return true;
  }

  function InputOnChange(name: string, value: string) {
    setActionData(
      data
        ? {
            ...data,
            error_fields: { ...data.error_fields, [name]: undefined },
          }
        : null
    );
    setUserInfo({ [name]: value as string });
  }

  function InputValidation(name: string): InputError {
    function ActionValidation(name: string): InputError {
      if (
        actionData?.error_fields?.[name] &&
        actionData.error_fields[name] != undefined
      ) {
        return {
          message: actionData.error_fields[name][0],
          error: true,
        };
      }
      return { message: "", error: false };
    }
    switch (name) {
      case "email":
        if (UserInfo.email.length > 0 || isSubmited) {
          if (UserFieldErrors.properties?.email?.errors?.[0]) {
            return {
              message: UserFieldErrors.properties.email.errors[0],
              error: true,
            };
          }
        }
        return ActionValidation(name);
      case "documento":
        if ((docValue?.length && docValue.length > 0) || isSubmited) {
          if (docError.error) {
            return docError;
          }
        }
        return ActionValidation(currentDocument === "CPF" ? "cpf" : "cnpj");
      case "name":
        if (UserInfo.name.length > 0 || isSubmited) {
          if (UserFieldErrors.properties?.name?.errors?.[0]) {
            return {
              message: UserFieldErrors.properties.name.errors[0],
              error: true,
            };
          }
        }
        return ActionValidation(name);
      default:
        return ActionValidation(name);
    }
  }
  return (
    <Form
      method="post"
      onSubmit={(e) => {
        const result = HandleSubmit();
        if (!result) {
          e.preventDefault();
          setIsSubmited(true);
          return;
        }
        setIsSubmited(false);
      }}
      className="h-full overflow-y-auto shadow-lg/55 bg-beergam-white p-8 rounded-tl-none rounded-tr-none rounded-xl gap-4 flex flex-col lg:rounded-tl-2xl lg:rounded-br-none"
    >
      <p>{JSON.stringify(actionData?.error_fields)}</p>
      <h1 className="text-beergam-blue-primary">Cadastre-se</h1>
      <button
        type="button"
        className="absolute right-2"
        onClick={() => {
          UserInfo.email = "teste@teste.com";
          UserInfo.name = "Teste";
          UserInfo.cpf = "52556894830";
          UserInfo.cnpj = "12345678901234";
          UserInfo.phone = "12345678901";
          UserInfo.found_beergam = "ANUNCIO_FACEBOOK" as ComoConheceuKeys;
          UserInfo.profit_range = "ATE_10_MIL" as Faixaprofit_rangeKeys;
          UserInfo.personal_reference_code = "1234567890";
          UserInfo.referral_code = "1234567890";
          setPassword("123456Ab!");
          setConfirmPassword("123456Ab!");
        }}
      >
        AutoComplete
      </button>
      <div>
        <Fields.wrapper>
          <Fields.label text="DIGITE SEU ENDEREÇO DE E-MAIL" />
          <Fields.input
            type="text"
            name="email"
            placeholder="Email"
            value={UserInfo.email}
            onChange={(e) => InputOnChange("email", e.target.value)}
            error={InputValidation("email")}
          />
        </Fields.wrapper>
      </div>
      <div className={`fieldsContainer`}>
        <Fields.wrapper>
          <Fields.label text="NOME COMPLETO / RAZÃO SOCIAL"></Fields.label>
          <Fields.input
            name="name"
            placeholder="Nome Completo / Razão Social"
            value={UserInfo.name}
            onChange={(e) => InputOnChange("name", e.target.value)}
            error={
              UserInfo.name.length > 0 || isSubmited
                ? UserFieldErrors.properties?.name?.errors?.[0]
                  ? {
                      message: UserFieldErrors.properties.name.errors[0],
                      error: true,
                    }
                  : { message: "", error: false }
                : { message: "", error: false }
            }
          ></Fields.input>
        </Fields.wrapper>
        <Fields.wrapper>
          <Fields.select
            value={currentDocument}
            options={[
              { value: "CPF", label: "CPF" },
              { value: "CNPJ", label: "CNPJ" },
            ]}
            onChange={(e) =>
              setCurrentDocument(e.target.value as UserDocuments)
            }
            tailWindClasses="!w-[100px] static lg:top-[-30%] lg:absolute"
          ></Fields.select>
          <Fields.label
            text="DOCUMENTO"
            tailWindClasses="opacity-0 relative z-[-1]"
          ></Fields.label>
          <Fields.input
            value={docValue ?? ""}
            placeholder="Documento"
            name={currentDocument === "CPF" ? "cpf" : "cnpj"}
            error={InputValidation("documento")}
            onChange={(e) =>
              InputOnChange(
                currentDocument === "CPF" ? "cpf" : "cnpj",
                e.target.value
              )
            }
          ></Fields.input>
        </Fields.wrapper>
      </div>
      <div className={`fieldsContainer`}>
        <Fields.wrapper>
          <Fields.label text="DIGITE SUA SENHA" />
          <Fields.input
            value={password}
            type="password"
            placeholder="Senha"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            error={
              password.length > 0 && passwordError.errors?.[0]
                ? { error: true, message: passwordError.errors?.[0] }
                : password.length == 0 && isSubmited
                  ? { error: true, message: "Por favor, preencha a senha" }
                  : { error: false, message: "" }
            }
          ></Fields.input>
        </Fields.wrapper>
        <Fields.wrapper>
          <Fields.label text="CONFIRME SUA SENHA" />
          <Fields.input
            value={confirmPassword}
            type="password"
            placeholder="Confirmar Senha"
            onChange={(e) => setConfirmPassword(e.target.value)}
            // error={
            //   (password.length > 0 || confirmPassword.length > 0) &&

            // }
            error={{
              message: confirmPasswordResult.success
                ? ""
                : "As senhas não coincidem",
              error: confirmPasswordResult.success ? false : true,
            }}
          ></Fields.input>
        </Fields.wrapper>
      </div>
      <div className={`fieldsContainer`}>
        <Fields.wrapper>
          <Fields.label text="CÓDIGO DE INDICAÇÃO" />
          <Fields.input
            value={UserInfo.referral_code ?? ""}
            placeholder="Código de Indicação"
            name="referral_code"
            onChange={(e) =>
              setUserInfo({ referral_code: e.target.value as string })
            }
          ></Fields.input>
        </Fields.wrapper>
        <Fields.wrapper>
          <Fields.label text="WHATSAPP" />
          <Fields.input
            value={UserInfo.phone}
            placeholder="Whatsapp"
            name="whatsapp"
            onChange={(e) => setUserInfo({ phone: e.target.value as string })}
            error={
              UserInfo.phone.length > 0 || isSubmited
                ? UserFieldErrors.properties?.phone?.errors?.[0]
                  ? {
                      error: true,
                      message: UserFieldErrors.properties.phone.errors[0],
                    }
                  : { error: false, message: "" }
                : { error: false, message: "" }
            }
          ></Fields.input>
        </Fields.wrapper>
      </div>
      <div className={`fieldsContainer`}>
        <Fields.wrapper>
          <Fields.label text="COMO CONHECEU A BEERGAM" />
          <Fields.select
            value={UserInfo.found_beergam ?? ""}
            hasError={true}
            error={
              !UserInfo.found_beergam && isSubmited
                ? {
                    error: true,
                    message:
                      "Por favor, selecione como você conheceu a Beergam",
                  }
                : UserInfo.found_beergam &&
                    UserInfo.found_beergam.length == 0 &&
                    isSubmited
                  ? {
                      error: true,
                      message: "Por favor, selecione um faturamento mensal",
                    }
                  : { error: false, message: "" }
            }
            options={[
              { value: "", label: "Selecione" },
              ...Object.keys(ComoConheceu).map((key) => ({
                value: key,
                label: ComoConheceu[key as ComoConheceuKeys],
              })),
            ]}
            name="found_beergam"
            onChange={(e) =>
              setUserInfo({
                found_beergam: e.target.value as ComoConheceuKeys,
              })
            }
          ></Fields.select>
        </Fields.wrapper>
        <Fields.wrapper>
          <Fields.label text="FATURAMENTO MENSAL" />
          <Fields.select
            value={UserInfo.profit_range ?? ""}
            hasError={true}
            error={
              !UserInfo.profit_range && isSubmited
                ? {
                    error: true,
                    message: "Por favor, selecione um faturamento mensal",
                  }
                : UserInfo.profit_range &&
                    UserInfo.profit_range.length == 0 &&
                    isSubmited
                  ? {
                      error: true,
                      message: "Por favor, selecione um faturamento mensal",
                    }
                  : { error: false, message: "" }
            }
            options={[
              { value: "", label: "Selecione" },
              ...Object.keys(Faixaprofit_range).map((key) => ({
                value: key,
                label: Faixaprofit_range[key as Faixaprofit_rangeKeys],
              })),
            ]}
            name="profit_range"
            onChange={(e) =>
              setUserInfo({
                profit_range: e.target.value as Faixaprofit_rangeKeys,
              })
            }
          ></Fields.select>
        </Fields.wrapper>
      </div>
      <button
        type="submit"
        className="p-2 rounded-2xl bg-beergam-orange text-beergam-white roundend hover:bg-beergam-blue-primary"
      >
        Criar conta grátis
      </button>
      {UserInfo.personal_reference_code == "14_DIAS_FREE" && (
        <p className="text-center font-bold text-beergam-blue-primary">
          Não pedimos cartão de crédito.
        </p>
      )}
      <p className="text-beergam-gray text-center font-medium lg:text-left">
        Ao começar o teste gratuito, declaro que li e aceito os{" "}
        <Link
          to={"/termos-de-uso"}
          className="text-beergam-blue-primary hover:text-beergam-orange font-medium"
        >
          termos e condições de uso
        </Link>{" "}
        do sistema
      </p>
      <div className="flex flex-row gap-2">
        <label className="text-beergam-gray font-medium" htmlFor="">
          Já possui uma conta?
        </label>
        <Link
          className="text-beergam-blue-primary hover:text-beergam-orange font-medium"
          to={"/login"}
        >
          Acessar
        </Link>
      </div>
    </Form>
  );
}

import { CNPJSchema } from "app/utils/typings/CNPJ";
import { CPFSchema } from "app/utils/typings/CPF";
import { useEffect, useReducer, useState } from "react";
import { Form, Link, useActionData } from "react-router";
import { z } from "zod";
import type { ApiResponse } from "~/features/apiClient/typings";
import { UserPasswordSchema } from "~/features/auth/typing";
import { UserRoles, UserStatus } from "~/features/user/typings/BaseUser";
import {
  ComoConheceu,
  ProfitRange,
  UserSchema,
  type IUser,
} from "~/features/user/typings/User";
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
      console.log("action data", action);
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
    (state: IUser, action: Partial<IUser>) => {
      return { ...state, ...action };
    },
    {
      name: "",
      role: UserRoles.MASTER,
      details: {
        email: "",
        cpf: undefined,
        cnpj: undefined,
        phone: "",
        personal_reference_code: undefined,
        referral_code: undefined,
        profit_range: undefined,
        found_beergam: undefined,
      },
      status: UserStatus.ACTIVE,
    } as IUser
  );
  const parseUserResult = UserSchema.safeParse(UserInfo);
  const UserFieldErrors = parseUserResult.success
    ? {
        properties: {
          name: { errors: [""] },
          role: { errors: [""] },
          details: {
            properties: {
              email: { errors: [""] },
              cpf: { errors: [""] },
              cnpj: { errors: [""] },
              phone: { errors: [""] },
              personal_reference_code: { errors: [""] },
              referral_code: { errors: [""] },
              profit_range: { errors: [""] },
              found_beergam: { errors: [""] },
            },
          },
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
  const docValue =
    currentDocument === "CPF" ? UserInfo.details.cpf : UserInfo.details.cnpj;
  const docResult = documentToValidate.safeParse(docValue);
  const docError = docResult.success
    ? { message: "", error: false }
    : {
        message: `${currentDocument} inválido	`,
        error: true,
      };
  function HandleSubmit(): boolean {
    UserInfo.updated_at = new Date();
    UserInfo.created_at = new Date();
    UserInfo.status = "ACTIVE" as UserStatus;
    if (UserInfo.details.referral_code == "") {
      UserInfo.details.referral_code = null;
    }
    if (currentDocument === "CPF") {
      UserInfo.details.cnpj = undefined;
    } else {
      UserInfo.details.cpf = undefined;
    }
    if (!UserSchema.safeParse(UserInfo).success) {
      console.log(UserSchema.safeParse(UserInfo));
      console.log(
        "UserInfo invalido",
        UserInfo,
        UserSchema.safeParse(UserInfo)
      );
      return false;
    }
    if (!ConfirmPasswordSchema.safeParse(confirmPassword).success) {
      console.log("ConfirmPasswordSchema invalido", confirmPassword);
      return false;
    }
    if (!UserPasswordSchema.safeParse(password).success) {
      console.log("UserPasswordSchema invalido", password);
      return false;
    }
    return true;
  }

  function InputOnChange(
    name: string | { details: { [key: string]: string } },
    value: string
  ) {
    setActionData(
      data
        ? {
            ...data,
            error_fields: { ...data.error_fields, [name as string]: undefined },
          }
        : null
    );
    if (typeof name === "object" && name.details) {
      setUserInfo({ details: { ...UserInfo.details, ...name.details } });
    } else {
      setUserInfo({ [name as string]: value as string });
    }
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
        if (UserInfo.details.email.length > 0 || isSubmited) {
          if (
            UserFieldErrors.properties?.details?.properties?.email?.errors?.[0]
          ) {
            return {
              message:
                UserFieldErrors.properties?.details?.properties?.email
                  ?.errors[0],
              error: true,
            };
          }
        }
        return ActionValidation(name);
      case "documento":
        console.log("docValue", docValue);
        console.log("docError", docError);
        console.log("isSubmited", isSubmited);
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
      case "referral_code":
        if (
          (UserInfo.details.referral_code?.length &&
            UserInfo.details.referral_code.length > 0) ||
          isSubmited
        ) {
          if (
            UserFieldErrors.properties?.details?.properties?.referral_code
              ?.errors?.[0]
          ) {
            return {
              message:
                UserFieldErrors.properties.details.properties.referral_code
                  .errors[0],
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
      {/* <p>{JSON.stringify(actionData?.error_fields)}</p> */}
      <h1 className="text-beergam-blue-primary">Cadastre-se</h1>
      <div>
        <Fields.wrapper>
          <Fields.label text="DIGITE SEU ENDEREÇO DE E-MAIL" />
          <Fields.input
            type="text"
            name="email"
            placeholder="Email"
            value={UserInfo.details.email}
            onChange={(e) =>
              InputOnChange(
                { details: { email: e.target.value } },
                e.target.value
              )
            }
            error={InputValidation("email").message}
            dataTooltipId="email-input"
            success={!InputValidation("email").error}
          />
        </Fields.wrapper>
      </div>
      <div className={`fieldsContainer pt-4`}>
        <Fields.wrapper>
          <Fields.label text="NOME COMPLETO / RAZÃO SOCIAL"></Fields.label>
          <Fields.input
            name="name"
            placeholder="Nome Completo / Razão Social"
            value={UserInfo.name}
            onChange={(e) => InputOnChange("name", e.target.value)}
            dataTooltipId="name-input"
            error={
              UserInfo.name.length > 0
                ? UserFieldErrors.properties?.name?.errors?.[0]
                : UserInfo.name.length == 0 && isSubmited
                  ? "Por favor, preencha o nome completo / razão social"
                  : undefined
            }
            success={
              ((UserInfo.name.length > 0 || isSubmited) &&
                !UserFieldErrors.properties?.name?.errors?.[0]) ||
              UserFieldErrors.properties?.name?.errors?.length == 0
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
            error={InputValidation("documento").message}
            dataTooltipId="documento-input"
            success={!InputValidation("documento").error}
            // showVariables
            onChange={(e) =>
              InputOnChange(
                currentDocument === "CPF"
                  ? { details: { cpf: e.target.value } }
                  : { details: { cnpj: e.target.value } },
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
              password.length == 0 && isSubmited
                ? "Por favor, preencha a senha"
                : password.length > 0 && passwordError.errors?.[0]
                  ? passwordError.errors?.[0]
                  : undefined
            }
            dataTooltipId="password-input"
            success={!passwordError.errors?.[0]}
          ></Fields.input>
        </Fields.wrapper>
        <Fields.wrapper>
          <Fields.label text="CONFIRME SUA SENHA" />
          <Fields.input
            value={confirmPassword}
            type="password"
            placeholder="Confirmar Senha"
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={
              confirmPasswordResult.success ? "" : "As senhas não coincidem"
            }
            success={confirmPasswordResult.success}
            dataTooltipId="confirm-password-input"
          ></Fields.input>
        </Fields.wrapper>
      </div>
      <div className={`fieldsContainer`}>
        <Fields.wrapper>
          <Fields.label text="CÓDIGO DE INDICAÇÃO" />
          <Fields.input
            value={UserInfo.details.referral_code ?? ""}
            placeholder="Código de Indicação"
            name="referral_code"
            onChange={(e) =>
              InputOnChange(
                { details: { referral_code: e.target.value } },
                e.target.value
              )
            }
            error={InputValidation("referral_code").message}
            success={!InputValidation("referral_code").error}
            dataTooltipId="referral-code-input"
          ></Fields.input>
        </Fields.wrapper>
        <Fields.wrapper>
          <Fields.label text="WHATSAPP" />
          <Fields.input
            value={UserInfo.details.phone}
            placeholder="Whatsapp"
            name="whatsapp"
            onChange={(e) =>
              setUserInfo({
                details: {
                  ...UserInfo.details,
                  phone: e.target.value as string,
                },
              })
            }
            error={
              UserInfo.details.phone.length == 0 && isSubmited
                ? "Por favor, preencha o whatsapp"
                : UserFieldErrors.properties?.details?.properties?.phone
                      ?.errors?.[0] && isSubmited
                  ? UserFieldErrors.properties.details.properties.phone
                      .errors[0]
                  : undefined
            }
            success={
              !UserFieldErrors.properties?.details?.properties?.phone
                ?.errors?.[0]
            }
            dataTooltipId="whatsapp-input"
          ></Fields.input>
        </Fields.wrapper>
      </div>
      <div className={`fieldsContainer`}>
        <Fields.wrapper>
          <Fields.label text="COMO CONHECEU A BEERGAM" />
          <Fields.select
            value={UserInfo.details.found_beergam ?? ""}
            hasError={true}
            error={
              !UserInfo.details.found_beergam && isSubmited
                ? {
                    error: true,
                    message:
                      "Por favor, selecione como você conheceu a Beergam",
                  }
                : UserInfo.details.found_beergam &&
                    UserInfo.details.found_beergam.length == 0 &&
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
                label: ComoConheceu[key as keyof typeof ComoConheceu],
              })),
            ]}
            name="found_beergam"
            onChange={(e) =>
              setUserInfo({
                details: {
                  ...UserInfo.details,
                  found_beergam: e.target.value as ComoConheceu,
                },
              })
            }
          ></Fields.select>
        </Fields.wrapper>
        <Fields.wrapper>
          <Fields.label text="FATURAMENTO MENSAL" />
          <Fields.select
            value={UserInfo.details.profit_range ?? ""}
            hasError={true}
            error={
              !UserInfo.details.profit_range && isSubmited
                ? {
                    error: true,
                    message: "Por favor, selecione um faturamento mensal",
                  }
                : UserInfo.details.profit_range &&
                    UserInfo.details.profit_range.length == 0 &&
                    isSubmited
                  ? {
                      error: true,
                      message: "Por favor, selecione um faturamento mensal",
                    }
                  : { error: false, message: "" }
            }
            options={[
              { value: "", label: "Selecione" },
              ...Object.keys(ProfitRange).map((key) => ({
                value: key,
                label: ProfitRange[key as keyof typeof ProfitRange],
              })),
            ]}
            name="profit_range"
            onChange={(e) =>
              setUserInfo({
                details: {
                  ...UserInfo.details,
                  profit_range: e.target.value as ProfitRange,
                },
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
      {UserInfo.details.personal_reference_code == "14_DIAS_FREE" && (
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

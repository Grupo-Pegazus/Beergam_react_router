import { CNPJSchema } from "app/utils/typings/CNPJ";
import { CPFSchema } from "app/utils/typings/CPF";
import { useReducer, useState } from "react";
import { Form, Link } from "react-router";
import { z } from "zod";
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
type UserDocuments = "CPF" | "CNPJ";
export default function FormModal() {
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
      // name: "",
      // user_type: "master",
      // allowed_views: { inicio: { active: true } },
      // email: "",
      // cpf: undefined,
      // cnpj: undefined,
      // whatsapp: "",
      // referal_code: "",
      // profit_range: "" as Faixaprofit_rangeKeys,
      // found_beergam: "" as ComoConheceuKeys,
      name: "",
      user_type: UsuarioRoles.MASTER,
      email: "",
      cpf: undefined,
      cnpj: undefined,
      phone: "",
      found_beergam: undefined,
      profit_range: undefined,
      personal_reference_code: undefined,
      referal_code: undefined,
      allowed_views: getDefaultViews(),
      conta_marketplace: undefined,
    } as IUsuario
  );

  const parseUserResult = UserSchema.safeParse(UserInfo);
  const UserFieldErrors = parseUserResult.success
    ? {
        properties: {
          name: { errors: [""] },
          user_type: { errors: [""] },
          allowed_views: { errors: [""] },
          email: { errors: [""] },
          cpf: { errors: [""] },
          cnpj: { errors: [""] },
          phone: { errors: [""] },
          personal_reference_code: { errors: [""] },
          referal_code: { errors: [""] },
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
    console.log("UserResult:", UserFieldErrors);
    console.log("UserInfo", UserInfo);
    if (!UserSchema.safeParse(UserInfo).success) {
      return false;
    }
    return true;
  }
  return (
    <Form
      method="post"
      onSubmit={(e) => {
        const result = HandleSubmit();
        console.log("resultado:", result);
        if (!result) {
          e.preventDefault();
          setIsSubmited(true);
          return;
        }
        setIsSubmited(false);
      }}
      className="h-full shadow-lg/55 bg-beergam-white p-8 rounded-tl-none rounded-tr-none rounded-xl gap-4 flex flex-col lg:rounded-tl-2xl lg:rounded-br-none"
    >
      <h1 className="text-beergam-blue-primary">Cadastre-se</h1>
      <div>
        <Fields.wrapper>
          <Fields.label
            text="DIGITE SEU ENDEREÇO DE E-MAIL"
            tailWindClasses="!text-beergam-gray-light capitalize"
          />
          <Fields.input
            type="text"
            name="email"
            placeholder="Email"
            value={UserInfo.email}
            onChange={(e) => setUserInfo({ email: e.target.value as string })}
            error={
              UserInfo.email.length > 0 || isSubmited
                ? UserFieldErrors.properties?.email?.errors?.[0]
                  ? {
                      message: UserFieldErrors.properties.email.errors[0],
                      error: true,
                    }
                  : { message: "", error: false }
                : { message: "", error: false }
            }
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
            onChange={(e) => setUserInfo({ name: e.target.value as string })}
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
            error={
              (docValue?.length && docValue.length > 0) || isSubmited
                ? docError
                : { error: false, message: "" }
            }
            onChange={(e) =>
              setUserInfo({
                [currentDocument === "CPF" ? "cpf" : "cnpj"]: e.target
                  .value as string,
              })
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
            value={UserInfo.referal_code ?? ""}
            placeholder="Código de Indicação"
            name="referal_code"
            onChange={(e) =>
              setUserInfo({ referal_code: e.target.value as string })
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
            options={Object.keys(ComoConheceu).map((key) => ({
              value: key,
              label: ComoConheceu[key as ComoConheceuKeys],
            }))}
            name="found_beergam"
            onChange={(e) =>
              setUserInfo({
                found_beergam: e.target.value as ComoConheceuKeys,
              })
            }
          ></Fields.select>
        </Fields.wrapper>
        <Fields.wrapper>
          <Fields.label text="profit_range MENSAL" />
          <Fields.select
            value={UserInfo.profit_range ?? ""}
            options={Object.keys(Faixaprofit_range).map((key) => ({
              value: key,
              label: Faixaprofit_range[key as Faixaprofit_rangeKeys],
            }))}
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

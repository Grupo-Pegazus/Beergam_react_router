import { CNPJSchema } from "app/utils/typings/CNPJ";
import { CPFSchema } from "app/utils/typings/CPF";
import { useReducer, useState } from "react";
import { Link } from "react-router";
import { z } from "zod";
import { UserPasswordSchema } from "~/features/auth/typing";
import {
  ComoConheceu,
  FaixaFaturamento,
  UserSchema,
  type ComoConheceuKeys,
  type FaixaFaturamentoKeys,
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
      name: "",
      user_type: "master",
      allowed_views: { inicio: { active: true } },
      email: "",
      cpf: undefined,
      cnpj: undefined,
      whatsapp: "",
      referal_code: "",
      faturamento: "" as FaixaFaturamentoKeys,
      conheceu_beergam: "" as ComoConheceuKeys,
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
          whatsapp: { errors: [""] },
          personal_reference_code: { errors: [""] },
          referal_code: { errors: [""] },
          faturamento: { errors: [""] },
          conheceu_beergam: { errors: [""] },
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
    if (!UserSchema.safeParse(UserInfo).success) {
      return false;
    }
    return true;
  }
  return (
    <div className="h-full bg-beergam-white p-8 rounded-xl gap-4 flex flex-col">
      <h1 className="text-beergam-blue-primary">Cadastre-se</h1>
      <div>
        <Fields.wrapper>
          <Fields.label
            text="DIGITE SEU ENDEREÇO DE E-MAIL"
            tailWindClasses="!text-beergam-gray-light capitalize"
          />
          <Fields.input
            type="text"
            name="email
          "
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
      <div className="grid grid-cols-2 gap-4">
        <Fields.wrapper>
          <Fields.label text="NOME COMPLETO / RAZÃO SOCIAL"></Fields.label>
          <Fields.input
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
            style={{ width: "100px", position: "absolute", top: "-30%" }}
          ></Fields.select>
          <Fields.label
            text="DOCUMENTO"
            tailWindClasses="opacity-0 relative z-[-1]"
          ></Fields.label>
          <Fields.input
            value={docValue ?? ""}
            placeholder="Documento"
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
      <div className="grid grid-cols-2 gap-4">
        <Fields.wrapper>
          <Fields.label text="DIGITE SUA SENHA" />
          <Fields.input
            value={password}
            type="password"
            placeholder="Senha"
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
      <div className="grid grid-cols-2 gap-4">
        <Fields.wrapper>
          <Fields.label text="CÓDIGO DE INDICAÇÃO" />
          <Fields.input
            value={UserInfo.referal_code ?? ""}
            placeholder="Código de Indicação"
            onChange={(e) =>
              setUserInfo({ referal_code: e.target.value as string })
            }
          ></Fields.input>
        </Fields.wrapper>
        <Fields.wrapper>
          <Fields.label text="WHATSAPP" />
          <Fields.input
            value={UserInfo.whatsapp}
            placeholder="Whatsapp"
            onChange={(e) =>
              setUserInfo({ whatsapp: e.target.value as string })
            }
            error={
              UserInfo.whatsapp.length > 0 || isSubmited
                ? UserFieldErrors.properties?.whatsapp?.errors?.[0]
                  ? {
                      error: true,
                      message: UserFieldErrors.properties.whatsapp.errors[0],
                    }
                  : { error: false, message: "" }
                : { error: false, message: "" }
            }
          ></Fields.input>
        </Fields.wrapper>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Fields.wrapper>
          <Fields.label text="COMO CONHECEU A BEERGAM" />
          <Fields.select
            value={UserInfo.conheceu_beergam}
            options={Object.keys(ComoConheceu).map((key) => ({
              value: key,
              label: ComoConheceu[key as ComoConheceuKeys],
            }))}
            onChange={(e) =>
              setUserInfo({
                conheceu_beergam: e.target.value as ComoConheceuKeys,
              })
            }
          ></Fields.select>
        </Fields.wrapper>
        <Fields.wrapper>
          <Fields.label text="FATURAMENTO MENSAL" />
          <Fields.select
            value={UserInfo.faturamento}
            options={Object.keys(FaixaFaturamento).map((key) => ({
              value: key,
              label: FaixaFaturamento[key as FaixaFaturamentoKeys],
            }))}
            onChange={(e) =>
              setUserInfo({
                faturamento: e.target.value as FaixaFaturamentoKeys,
              })
            }
          ></Fields.select>
        </Fields.wrapper>
      </div>
      <button
        onClick={() => {
          const result = HandleSubmit();
          console.log("resultado:", result);
          if (!result) {
            setIsSubmited(true);
            return;
          }
          setIsSubmited(false);
        }}
        className="p-2 rounded-2xl bg-beergam-orange text-beergam-white roundend hover:bg-beergam-blue-primary"
      >
        Criar conta grátis
      </button>
      {UserInfo.personal_reference_code == "14_DIAS_FREE" && (
        <p className="text-center font-bold text-beergam-blue-primary">
          Não pedimos cartão de crédito.
        </p>
      )}
      <p className="text-beergam-gray font-medium">
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
    </div>
  );
}

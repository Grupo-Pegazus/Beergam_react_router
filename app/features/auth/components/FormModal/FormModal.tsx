import { useEffect, useReducer, useState } from "react";
import { Form, Link } from "react-router";
import { z } from "zod";
import { Fields } from "~/src/components/utils/_fields";
import {
  type ColaboradorUserForm,
  ColaboradorUserFormSchema,
  type MasterUserForm,
  MasterUserFormSchema,
} from "../../typing";

type TFormType = "login" | "register";
type TUserType = "master" | "colaborador";

interface ActionData {
  error: boolean;
  message: string;
}

interface FormModalProps {
  formType: TFormType;
  userType?: TUserType;
  actionError?: ActionData;
}

function FormHelpNavigation({ formType }: FormModalProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <label className="text-beergam-gray font-medium" htmlFor="">
        {formType === "login" ? "Sem conta?" : "Já tem conta?"}
      </label>
      <Link
        className="text-beergam-blue-primary hover:text-beergam-orange font-medium"
        to={formType === "login" ? "/register" : "/login"}
      >
        {formType === "login" ? "Cadastre-se" : "Entrar"}
      </Link>
    </div>
  );
}

function ButtonChangeUserType({
  currentUserType,
  userType,
  callback,
}: {
  currentUserType: TUserType;
  userType: TUserType;
  callback: (userType: TUserType) => void;
}) {
  return (
    <button
      className={`relative text-beergam-blue-primary cursor-pointer hover:text-beergam-orange after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-beergam-orange font-medium after:transition-all after:duration-300 ${currentUserType === userType ? "after:opacity-100 text-beergam-orange" : "after:opacity-0"}`}
      onClick={() => callback(userType)}
    >
      {userType === "master" ? "Empregador" : "Colaborador"}
    </button>
  );
}

export default function FormModal({
  formType,
  userType = "master",
  actionError,
}: FormModalProps) {
  const [currentUserType, setCurrentUserType] = useState<TUserType>(userType);
  const [isSubmited, setIsSubmited] = useState(false);
  const [MasterUserInfo, setMasterUserInfo] = useReducer(
    (state: MasterUserForm, action: Partial<MasterUserForm>) => {
      return { ...state, ...action };
    },
    { email: "", password: "" } as MasterUserForm
  );
  const [ColaboradorUserInfo, setColaboradorUserInfo] = useReducer(
    (state: ColaboradorUserForm, action: Partial<ColaboradorUserForm>) => {
      return { ...state, ...action };
    },
    { master_pin: "", pin: "", password: "" } as ColaboradorUserForm
  );
  const [stateActionError, setStateActionError] = useState<ActionData | null>(
    actionError || null
  );
  const parseMasterUserResult = MasterUserFormSchema.safeParse(MasterUserInfo);
  const masterFieldErrors = parseMasterUserResult.success
    ? {
        properties: { email: { errors: [""] }, password: { errors: [""] } },
      }
    : z.treeifyError(parseMasterUserResult.error);
  const parseColaboradorUserResult =
    ColaboradorUserFormSchema.safeParse(ColaboradorUserInfo);
  const colaboradorFieldErrors = parseColaboradorUserResult.success
    ? {
        properties: {
          master_pin: { errors: [""] },
          pin: { errors: [""] },
          password: { errors: [""] },
        },
      }
    : z.treeifyError(parseColaboradorUserResult.error);
  function ChangeUserType(userType: TUserType) {
    setCurrentUserType(userType);
    setIsSubmited(false);
    setStateActionError(null);
  }
  useEffect(() => {
    setStateActionError(actionError || null);
  }, [actionError]);
  type MasterResult = ReturnType<typeof MasterUserFormSchema.safeParse>;
  type ColabResult = ReturnType<typeof ColaboradorUserFormSchema.safeParse>;

  function HandleSubmit(
    userResult: MasterResult | ColabResult,
    userType: TUserType
  ) {
    let onlyPasswordError = true;
    if (!userResult.success) {
      if (userType === "master") {
        onlyPasswordError =
          !masterFieldErrors.properties?.email?.errors?.[0] &&
          !!masterFieldErrors.properties?.password?.errors?.[0];
      }
      if (userType === "colaborador") {
        onlyPasswordError =
          !colaboradorFieldErrors.properties?.master_pin?.errors?.[0] &&
          !colaboradorFieldErrors.properties?.pin?.errors?.[0] &&
          !!colaboradorFieldErrors.properties?.password?.errors?.[0];
      }
      if (!onlyPasswordError) {
        return false;
      }
    }
    return true;
  }
  const modalHeight = currentUserType === "master" ? "h-[524px]" : "h-[629px]";
  return (
    <div
      className={`flex relative z-10 flex-col gap-4 bg-beergam-white rounded-4xl w-[90%]  mx-auto p-8 transition-height ${modalHeight} sm:w-1/3 sm:max-w-[32rem]`}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-beergam-blue-primary">Bem vindo</h1>
        <div className="flex flex-col gap-2">
          <FormHelpNavigation formType={formType} />
        </div>
      </div>
      <div className="flex gap-2.5">
        <ButtonChangeUserType
          currentUserType={currentUserType}
          userType="master"
          callback={ChangeUserType}
        />
        <ButtonChangeUserType
          currentUserType={currentUserType}
          userType="colaborador"
          callback={ChangeUserType}
        />
      </div>
      <Form
        method="post"
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          const result = HandleSubmit(
            currentUserType === "master"
              ? parseMasterUserResult
              : parseColaboradorUserResult,
            currentUserType
          );
          if (!result) {
            e.preventDefault();
            setIsSubmited(true);
            return;
          }
          setIsSubmited(false);
          // if (currentUserType == "master") {
          //   if (!parseMasterUserResult.success) {
          //     const onlyPasswordError =
          //       !masterFieldErrors.properties?.email?.errors?.[0] &&
          //       !!masterFieldErrors.properties?.password?.errors?.[0];

          //     if (!onlyPasswordError) {
          //       e.preventDefault();
          //       setIsSubmited(true);
          //     }
          //   }
          // } else {
          //   if (!parseColaboradorUserResult.success) {
          //     const onlyPasswordError =
          //       !colaboradorFieldErrors.properties?.master_pin?.errors?.[0] &&
          //       !colaboradorFieldErrors.properties?.pin?.errors?.[0] &&
          //       !!colaboradorFieldErrors.properties?.password?.errors?.[0];

          //     if (!onlyPasswordError) {
          //       e.preventDefault();
          //       setIsSubmited(true);
          //     }
          //   }
          // }
        }}
      >
        {currentUserType == "master" ? (
          <>
            <Fields.wrapper>
              <Fields.label
                text="ENTRE COM SEU ENDEREÇO DE E-MAIL"
                tailWindClasses="!text-beergam-gray-light"
              />
              <Fields.input
                type="text"
                name="email"
                placeholder="Email"
                value={MasterUserInfo.email}
                onChange={(e) =>
                  setMasterUserInfo({ email: e.target.value as string })
                }
                error={
                  MasterUserInfo.email.length > 0
                    ? masterFieldErrors.properties?.email?.errors?.[0]
                      ? {
                          message: masterFieldErrors.properties.email.errors[0],
                          error: true,
                        }
                      : { message: "", error: false }
                    : isSubmited
                      ? {
                          message: "Por favor, preencha o e-mail.",
                          error: true,
                        }
                      : { message: "", error: false }
                }
              />
            </Fields.wrapper>
            <Fields.wrapper>
              <Fields.label
                text="INSIRA SUA SENHA DE ACESSO"
                tailWindClasses="!text-beergam-gray-light"
              />
              <Fields.input
                type="password"
                name="password"
                placeholder="Senha"
                value={MasterUserInfo.password}
                onChange={(e) =>
                  setMasterUserInfo({ password: e.target.value as string })
                }
                error={
                  MasterUserInfo.password.length === 0 && isSubmited
                    ? {
                        message: "Por favor, preencha a senha.",
                        error: true,
                      }
                    : { message: "", error: false }
                }
              />
              {/* {masterFieldErrors?.password && masterFieldErrors.password.length >= 0 && (
            <span className="text-xs text-red-500 mt-1">
              {masterFieldErrors.password[0]}
            </span>
          )} */}
            </Fields.wrapper>
          </>
        ) : (
          <>
            <Fields.wrapper>
              <Fields.label
                text="INSIRA O PIN DO EMPREGADOR"
                tailWindClasses="!text-beergam-gray-light"
              />
              <Fields.input
                type="text"
                name="master_pin"
                placeholder="Pin do Empregador"
                value={ColaboradorUserInfo.master_pin}
                onChange={(e) =>
                  setColaboradorUserInfo({
                    master_pin: e.target.value as string,
                  })
                }
                error={
                  isSubmited &&
                  colaboradorFieldErrors.properties?.master_pin?.errors?.[0]
                    ? {
                        message:
                          colaboradorFieldErrors.properties.master_pin
                            .errors[0],
                        error: true,
                      }
                    : { message: "", error: false }
                }
              />
            </Fields.wrapper>
            <Fields.wrapper>
              <Fields.label
                text="INSIRA O SEU PIN"
                tailWindClasses="!text-beergam-gray-light"
              />
              <Fields.input
                type="text"
                name="pin"
                placeholder="Pin"
                value={ColaboradorUserInfo.pin}
                onChange={(e) =>
                  setColaboradorUserInfo({
                    pin: e.target.value as string,
                  })
                }
                error={
                  isSubmited &&
                  colaboradorFieldErrors.properties?.pin?.errors?.[0]
                    ? {
                        message:
                          colaboradorFieldErrors.properties.pin.errors[0],
                        error: true,
                      }
                    : { message: "", error: false }
                }
              />
            </Fields.wrapper>
            <Fields.wrapper>
              <Fields.label
                text="INSIRA SUA SENHA DE ACESSO"
                tailWindClasses="!text-beergam-gray-light"
              />
              <Fields.input
                type="password"
                name="password"
                placeholder="Senha"
                value={ColaboradorUserInfo.password}
                onChange={(e) =>
                  setColaboradorUserInfo({
                    password: e.target.value as string,
                  })
                }
              />
            </Fields.wrapper>
          </>
        )}
        <button
          className="w-fit text-beergam-blue-primary hover:text-beergam-orange font-medium"
          type="button"
        >
          Esqueceu sua senha?
        </button>
        <button
          type="submit"
          className="p-2 rounded-2xl bg-beergam-blue-primary text-beergam-white hover:bg-beergam-orange"
        >
          Enviar
        </button>
      </Form>
      {stateActionError?.error && !isSubmited && (
        <p className="text-red-500">{stateActionError.message}</p>
      )}
    </div>
  );
}

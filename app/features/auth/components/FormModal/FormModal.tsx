import { useReducer, useState } from "react";
import { Form, Link } from "react-router";
import { z } from "zod";
import { UserRoles } from "~/features/user/typings/BaseUser";
import { Fields } from "~/src/components/utils/_fields";
import beergam_flower_logo from "~/src/img/beergam_flower_logo.webp";
import {
  type ColaboradorUserForm,
  ColaboradorUserFormSchema,
  type MasterUserForm,
  MasterUserFormSchema,
} from "../../typing";

interface FormModalProps {
  userType?: UserRoles;
}

function FormHelpNavigation() {
  return (
    <div className="flex flex-row gap-2 sm:flex-col sm:gap-0.5">
      <label className="text-beergam-gray font-medium" htmlFor="">
        Sem conta?
      </label>
      <Link
        className="text-beergam-blue-primary hover:text-beergam-orange font-medium"
        to={"/registro"}
      >
        Cadastre-se
      </Link>
    </div>
  );
}

function ButtonChangeUserType({
  currentUserType,
  userType,
  callback,
}: {
  currentUserType: UserRoles;
  userType: UserRoles;
  callback: (userType: UserRoles) => void;
}) {
  return (
    <button
      className={`relative text-beergam-blue-primary cursor-pointer hover:text-beergam-orange after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-beergam-orange font-medium after:transition-all after:duration-300 ${currentUserType === userType ? "after:opacity-100 text-beergam-orange" : "after:opacity-0"}`}
      onClick={() => callback(userType)}
    >
      {userType === UserRoles.MASTER ? "Empregador" : "Colaborador"}
    </button>
  );
}

export default function FormModal({
  userType = UserRoles.MASTER,
}: FormModalProps) {
  const [currentUserType, setCurrentUserType] = useState<UserRoles>(userType);
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
  function ChangeUserType(userType: UserRoles) {
    setCurrentUserType(userType);
    setIsSubmited(false);
  }
  type MasterResult = ReturnType<typeof MasterUserFormSchema.safeParse>;
  type ColabResult = ReturnType<typeof ColaboradorUserFormSchema.safeParse>;
  function HandleSubmit(
    userResult: MasterResult | ColabResult,
    userType: UserRoles
  ) {
    const isLoading = localStorage.getItem("loginLoading") == "true";
    if (isLoading) return false;
    let onlyPasswordError = true;
    if (!userResult.success) {
      if (userType === UserRoles.MASTER) {
        if (MasterUserInfo.password.length === 0) {
          return false;
        }
        onlyPasswordError =
          !masterFieldErrors.properties?.email?.errors?.[0] &&
          !!masterFieldErrors.properties?.password?.errors?.[0];
      }
      if (userType === UserRoles.COLAB) {
        if (ColaboradorUserInfo.password.length === 0) {
          return false;
        }
        onlyPasswordError =
          !colaboradorFieldErrors.properties?.master_pin?.errors?.[0] &&
          !colaboradorFieldErrors.properties?.pin?.errors?.[0] &&
          !!colaboradorFieldErrors.properties?.password?.errors?.[0];
      }
      if (!onlyPasswordError) {
        return false;
      }
    }
    localStorage.setItem("loginLoading", "true");
    return true;
  }
  const modalHeight =
    currentUserType === UserRoles.MASTER ? "sm:h-[490px]" : "sm:h-[595px]"; //524px e 629px
  return (
    <div
      className={`flex shadow-lg/55 relative z-10 flex-col gap-4 bg-beergam-white h-full w-[100%] mx-auto my-auto p-8 transition-height ${modalHeight} sm:w-2/3 sm:max-w-[32rem] sm:rounded-4xl`}
    >
      <div className="block w-16 h-16 sm:hidden">
        <img
          src={beergam_flower_logo}
          alt="beergam_flower_logo"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex justify-between items-center">
        <h1 className="text-beergam-blue-primary">Bem vindo</h1>
        <div className="hidden flex-col gap-2 sm:flex">
          <FormHelpNavigation />
        </div>
      </div>
      <div className="flex gap-2.5">
        <ButtonChangeUserType
          currentUserType={currentUserType}
          userType={UserRoles.MASTER}
          callback={ChangeUserType}
        />
        <ButtonChangeUserType
          currentUserType={currentUserType}
          userType={UserRoles.COLAB}
          callback={ChangeUserType}
        />
      </div>
      <Form
        method="post"
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          const result = HandleSubmit(
            currentUserType === UserRoles.MASTER
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
        }}
      >
        <input type="hidden" name="role" value={currentUserType} />
        {currentUserType == UserRoles.MASTER ? (
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
                error={
                  ColaboradorUserInfo.password.length === 0 && isSubmited
                    ? {
                        message: "Por favor, preencha a senha.",
                        error: true,
                      }
                    : { message: "", error: false }
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
        <div className="flex gap-2 sm:hidden">
          <FormHelpNavigation />
        </div>
        <button
          type="submit"
          className="p-2 rounded-2xl bg-beergam-blue-primary text-beergam-white hover:bg-beergam-orange"
        >
          Entrar
        </button>
      </Form>
    </div>
  );
}

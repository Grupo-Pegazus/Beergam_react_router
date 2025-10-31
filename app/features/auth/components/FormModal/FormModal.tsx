import { useReducer, useState } from "react";
import { Link, useFetcher } from "react-router";
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
  const fetcher = useFetcher();
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
    { pin: "", password: "" } as ColaboradorUserForm
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
  function HandleFetch() {
    const result = HandleSubmit(
      currentUserType === UserRoles.MASTER
        ? parseMasterUserResult
        : parseColaboradorUserResult,
      currentUserType
    );
    console.log("result do handle fetch", result);
    console.log("colaboradorFieldErrors", colaboradorFieldErrors);
    if (!result) {
      setIsSubmited(true);
      return;
    }
    fetcher.submit(
      JSON.stringify({
        role: currentUserType,
        data:
          currentUserType === UserRoles.MASTER
            ? MasterUserInfo
            : ColaboradorUserInfo,
      }),
      { method: "post", encType: "application/json" }
    );
    setIsSubmited(false);
  }
  return (
    <div
      className={`flex shadow-lg/55 relative z-10 flex-col gap-4 bg-beergam-white h-full w-[100%] mx-auto my-auto p-8 sm:w-2/3 sm:max-w-[32rem] sm:rounded-4xl sm:h-[490px]`}
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          HandleFetch();
        }}
        className="flex flex-col gap-4"
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
                  MasterUserInfo.email.length == 0 && isSubmited
                    ? "Por favor, preencha o e-mail."
                    : masterFieldErrors.properties?.email?.errors?.[0] &&
                        MasterUserInfo.email.length > 0
                      ? masterFieldErrors.properties.email.errors[0]
                      : undefined
                }
                dataTooltipId="email-input"
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
                dataTooltipId="password-input"
                error={
                  MasterUserInfo.password.length === 0 && isSubmited
                    ? "Por favor, preencha a senha."
                    : undefined
                }
              />
            </Fields.wrapper>
          </>
        ) : (
          <>
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
                  ColaboradorUserInfo.pin.length == 0 && isSubmited
                    ? "Por favor, preencha o pin do colaborador."
                    : colaboradorFieldErrors.properties?.pin?.errors?.[0] &&
                        ColaboradorUserInfo.pin.length > 0
                      ? colaboradorFieldErrors.properties.pin.errors[0]
                      : undefined
                }
                dataTooltipId="pin-input"
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
                    ? "Por favor, preencha a senha."
                    : undefined
                }
                dataTooltipId="password-colab-input"
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
          onClick={HandleFetch}
          className="p-2 rounded-2xl bg-beergam-blue-primary text-beergam-white hover:bg-beergam-orange"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

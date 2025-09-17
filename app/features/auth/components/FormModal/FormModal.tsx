import { useEffect, useReducer, useState } from "react";
import { Form, Link } from "react-router";
import { z } from "zod";
import { Fields } from "~/src/components/utils/_fields";
import { MasterUserFormSchema, type MasterUserForm } from "../../typing";

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
  setCurrentUserType,
}: {
  currentUserType: TUserType;
  userType: TUserType;
  setCurrentUserType: (userType: TUserType) => void;
}) {
  return (
    <button
      className={`relative text-beergam-blue-primary cursor-pointer hover:text-beergam-orange after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-beergam-orange font-medium after:transition-all after:duration-300 ${currentUserType === userType ? "after:opacity-100 text-beergam-orange" : "after:opacity-0"}`}
      onClick={() => setCurrentUserType(userType)}
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
  const parseMasterUserResult = MasterUserFormSchema.safeParse(MasterUserInfo);
  const fieldErrors = parseMasterUserResult.success
    ? { properties: { email: { errors: [""] }, password: { errors: [""] } } }
    : z.treeifyError(parseMasterUserResult.error);
  useEffect(() => {
    setIsSubmited(false);
  }, [MasterUserInfo]);
  return (
    <div className="flex flex-col gap-4 bg-beergam-white rounded-4xl w-2/6 mx-auto p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-beergam-blue-primary !text-6xl">Bem vindo</h1>
        <div className="flex flex-col gap-2">
          <FormHelpNavigation formType={formType} />
        </div>
      </div>
      <div className="flex gap-2.5">
        <ButtonChangeUserType
          currentUserType={currentUserType}
          userType="master"
          setCurrentUserType={setCurrentUserType}
        />
        <ButtonChangeUserType
          currentUserType={currentUserType}
          userType="colaborador"
          setCurrentUserType={setCurrentUserType}
        />
      </div>
      <Form method="post" className="flex flex-col gap-4">
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
              MasterUserInfo.email.length === 0
                ? {
                    message: "Por favor, preencha o e-mail.",
                    error: isSubmited && true,
                  }
                : fieldErrors.properties?.email?.errors?.[0]
                  ? {
                      message: fieldErrors.properties.email.errors[0],
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
          />
          {/* {fieldErrors?.password && fieldErrors.password.length >= 0 && (
            <span className="text-xs text-red-500 mt-1">
              {fieldErrors.password[0]}
            </span>
          )} */}
        </Fields.wrapper>
        <button type="submit">Enviar</button>
      </Form>
      {actionError?.error && (
        <p className="text-red-500">{actionError.message}</p>
      )}
    </div>
  );
}

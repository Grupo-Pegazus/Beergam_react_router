import { useState } from "react";
import { Form, Link } from "react-router";
import { Fields } from "~/src/components/utils/_fields";

type TFormType = "login" | "register";
type TUserType = "master" | "colaborador";

interface FormModalProps {
  formType: TFormType;
  userType?: TUserType;
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
}: FormModalProps) {
  const [currentUserType, setCurrentUserType] = useState<TUserType>(userType);
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
      <Form>
        <Fields.wrapper>
          <Fields.label
            text="ENTRE COM SEU ENDEREÇO DE E-MAIL"
            tailWindClasses="!text-beergam-gray-light"
          />
          <Fields.input type="email" placeholder="Email" value="" />
        </Fields.wrapper>
      </Form>
    </div>
  );
}

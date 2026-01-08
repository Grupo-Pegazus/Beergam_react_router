import { Paper } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import PageLayout from "~/features/auth/components/PageLayout/PageLayout";
import { useLogoutFlow } from "~/features/auth/hooks/useLogoutFlow";
import { UserRoles } from "~/features/user/typings/BaseUser";
import type { IColab } from "~/features/user/typings/Colab";
import type { IUser } from "~/features/user/typings/User";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { CDN_IMAGES } from "~/src/constants/cdn-images";
import LoginForm from "./components/LoginForm/index";
export default function LoginPage({
  userType = UserRoles.MASTER,
  isLoggedIn,
}: {
  userType: UserRoles;
  isLoggedIn: { success: boolean; user: IUser | IColab };
}) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [currentUserType, setCurrentUserType] = useState<UserRoles>(userType);
  const { isLoggingOut, logout } = useLogoutFlow({
    redirectTo: "/login",
  });
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
        className={`relative text-beergam-typography-primary cursor-pointer hover:text-beergam-orange after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-beergam-orange font-medium after:transition-all after:duration-300 ${currentUserType === userType ? "after:opacity-100 text-beergam-orange!" : "after:opacity-0!"}`}
        onClick={() => callback(userType)}
      >
        {userType === UserRoles.MASTER ? "Empregador" : "Colaborador"}
      </button>
    );
  }
  const handleLoginSuccess = useCallback(() => {
    setIsRedirecting(true);
  }, []);

  const handleUserTypeChange = useCallback((userType: UserRoles) => {
    setCurrentUserType(userType);
  }, []);

  const Form = useMemo(() => {
    return (
      <div
        className={`flex shadow-lg/55 relative z-10 flex-col gap-4 bg-beergam-section-background! h-auto w-full md:mx-auto md:my-auto p-8 md:w-2/3 md:max-w-lg md:rounded-4xl`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between items-start">
          <div className="flex gap-2 items-center">
            <Link
              to="/"
              className="block w-10 h-10 cursor-pointer hover:opacity-80"
            >
              <img
                src={CDN_IMAGES.BERGAMOTA_LOGO}
                alt="beergam_flower_logo"
                className="w-full h-full object-contain"
              />
            </Link>
            <h1 className="text-beergam-typography-primary">Bem vindo</h1>
          </div>
          <div className="hidden md:block">
            <p className="text-beergam-typography-secondary font-medium">
              Sem conta?
            </p>
            <Link
              to="/registro"
              className="text-beergam-typography-primary hover:text-beergam-orange font-medium"
            >
              Cadastre-se
            </Link>
          </div>
        </div>
        <div className="flex justify-between items-center gap-2">
          <div className="flex gap-2.5">
            <ButtonChangeUserType
              currentUserType={currentUserType}
              userType={UserRoles.MASTER}
              callback={handleUserTypeChange}
            />
            <ButtonChangeUserType
              currentUserType={currentUserType}
              userType={UserRoles.COLAB}
              callback={handleUserTypeChange}
            />
          </div>
        </div>
        <LoginForm userType={currentUserType} onSuccess={handleLoginSuccess} />
      </div>
    );
  }, [currentUserType, handleLoginSuccess, handleUserTypeChange]);
  function FormLoggedIn() {
    return (
      <Paper className="flex flex-col gap-4! text-beergam-blue-primary text-center">
        <h2 className="text-beergam-blue-primary">Continuar Conectado?</h2>
        <p className="">
          Você já possui uma sessão ativa como:{" "}
          <span className="font-bold text-beergam-orange">
            {isLoggedIn.user.name}
          </span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          <BeergamButton
            title="Continuar"
            icon="arrow_uturn_right"
            link="/interno/choosen_account"
            mainColor="beergam-orange"
          />
          <BeergamButton
            title="Sair"
            onClick={() => {
              if (isLoggingOut) return;
              logout();
            }}
            icon="logout"
            mainColor="beergam-red"
          />
        </div>
      </Paper>
    );
  }
  return (
    <PageLayout
      tailwindClassName="flex md:items-center max-h-full! overflow-y-auto! md:justify-center"
      hideHeader={true}
    >
      {isLoggedIn.success && !isRedirecting && isLoggedIn.user !== null ? (
        <FormLoggedIn />
      ) : (
        Form
      )}
    </PageLayout>
  );
}

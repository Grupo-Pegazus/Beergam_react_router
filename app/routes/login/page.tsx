import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import PageLayout from "~/features/auth/components/PageLayout/PageLayout";
import { useLogoutFlow } from "~/features/auth/hooks/useLogoutFlow";
import { setLastActivity } from "~/features/auth/utils/sessionActivityStorage";
import { isSubscriptionError } from "~/features/auth/utils";
import { isFree } from "~/features/plans/planUtils";
import { subscriptionService } from "~/features/plans/subscriptionService";
import { authService } from "~/features/auth/service";
import authStore from "~/features/store-zustand";
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
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
  const navigate = useNavigate();
  const isMountedRef = useRef(true);
  const { isLoggingOut, logout } = useLogoutFlow({
    redirectTo: "/login",
  });

  // Limpa o ref quando o componente desmontar
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
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

  const handleContinue = useCallback(async () => {
    if (isLoadingSubscription) return;
    
    setIsLoadingSubscription(true);
    try {
      await subscriptionService.getSubscription();
      // Verifica se o componente ainda está montado antes de atualizar estado
      if (!isMountedRef.current) return;
      // Verifica se o usuário ainda está logado após a requisição
      // Se o refresh token expirar durante a requisição, o interceptor chama logout() automaticamente
      // e limpa o user. Nesse caso, não navega (o AuthLayout já vai redirecionar para /login)
      const currentUser = authStore.getState().user;
      if (!currentUser) {
        setIsLoadingSubscription(false);
        return;
      }

      await authService.checkLogin();
      
      // Verifica se há erro de subscription (ex: CANCELED)
      // Se houver, navega para a página de configuração de assinatura
      // Isso evita loop de redirecionamento com o AuthLayout
      const authError = authStore.getState().error;
      const subscription = authStore.getState().subscription;
      
      if (authError && isSubscriptionError(authError)) {
        // Se há erro de subscription, navega para a página de assinatura
        setLastActivity();
        navigate("/interno/config?session=Minha Assinatura", { replace: true });
        setIsLoadingSubscription(false);
        return;
      }
      
      // Verifica se a subscription é válida antes de navegar para /interno/choosen_account
      // Uma subscription válida precisa:
      // 1. Não ser null
      // 2. Ter start_date não null
      // 3. Não ter status "CANCELED"
      // Se não for válida, navega para a página de configuração de assinatura
      if (!subscription || !subscription.start_date) {
        // Subscription não existe ou não tem start_date
        setLastActivity();
        navigate("/interno/config?session=Minha Assinatura", { replace: true });
        setIsLoadingSubscription(false);
        return;
      }
      
      // Verifica também o status da subscription diretamente
      // (caso o erro não tenha sido setado ainda)
      // O status vem da API como string "CANCELED", precisa fazer cast para comparar
      if ((subscription.status as string) === "CANCELED") {
        setLastActivity();
        navigate("/interno/config?session=Minha Assinatura", { replace: true });
        setIsLoadingSubscription(false);
        return;
      }
      
      // Navega para o destino correto conforme o tipo de plano
      setLastActivity();
      if (isFree(subscription)) {
        navigate("/interno", { replace: true });
      } else {
        navigate("/interno/choosen_account");
      }
    } catch (error) {
      // Este catch nunca será executado pois getSubscription não lança exceções
      // Mas mantemos para segurança futura
      console.error("Erro inesperado ao buscar subscription:", error);
      if (isMountedRef.current) {
        const currentUser = authStore.getState().user;
        if (currentUser) {
          const currentSub = authStore.getState().subscription;
          setLastActivity();
          if (isFree(currentSub)) {
            navigate("/interno", { replace: true });
          } else {
            navigate("/interno/choosen_account");
          }
        }
      }
    } finally {
      // Só atualiza estado se o componente ainda estiver montado
      if (isMountedRef.current) {
        setIsLoadingSubscription(false);
      }
    }
  }, [isLoadingSubscription, navigate]);

  const Form = useMemo(() => {
    return (
      <div
        className={`flex shadow-lg/55 relative z-10 flex-col gap-4 bg-beergam-mui-paper! h-auto w-full md:mx-auto md:my-auto p-8 md:w-2/3 md:max-w-lg md:rounded-4xl`}
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
      <div
        className={`flex shadow-lg/55 relative z-10 flex-col gap-4 bg-beergam-mui-paper! h-auto w-full mx-auto my-auto p-4 sm:p-6 md:p-8 md:w-2/3 md:max-w-lg md:rounded-4xl`}
      >
        <h2 className="text-lg sm:text-xl font-semibold text-beergam-typography-primary text-center">
          Continuar Conectado?
        </h2>
        <p className="text-sm sm:text-base text-beergam-typography-secondary text-center px-2">
          Você já possui uma sessão ativa como:{" "}
          <span className="font-bold text-beergam-orange">
            {isLoggedIn.user.name}
          </span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full">
          <BeergamButton
            title="Continuar"
            icon="arrow_uturn_right"
            onClick={handleContinue}
            loading={isLoadingSubscription}
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
      </div>
    );
  }
  return (
    <PageLayout
      tailwindClassName="flex md:items-center max-h-full! overflow-y-auto! md:justify-center px-4 sm:px-6"
      hideHeader={true}
      paddingTop={false}
    >
      {isLoggedIn.success && !isRedirecting && isLoggedIn.user !== null ? (
        <FormLoggedIn />
      ) : (
        Form
      )}
    </PageLayout>
  );
}

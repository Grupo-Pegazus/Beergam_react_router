import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useSocketContext } from "~/features/socket/context/SocketContext";
import authStore from "~/features/store-zustand";
import { UserRoles } from "~/features/user/typings/BaseUser";
import { Fields } from "~/src/components/utils/_fields";
import { CDN_IMAGES } from "~/src/constants/cdn-images";
import toast from "~/src/utils/toast";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { BeergamTurnstile, type BeergamTurnstileRef } from "~/src/components/utils/BeergamTurnstile";
import { authService } from "../../../../features/auth/service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ColaboradorUserForm,
  ColaboradorUserFormSchema,
  type MasterUserForm,
  MasterUserFormSchema,
} from "../../../../features/auth/typing";
import RecoveryModal from "../RecoveryModal/RecoveryModal";

interface FormModalProps {
  userType?: UserRoles;
}

function FormHelpNavigation() {
  const { state } = useLocation();
  const homeSelectedPlan = state?.plan;
  return (
    <div className="flex flex-row gap-2 sm:flex-col sm:gap-0.5">
      <label className="text-beergam-gray font-medium" htmlFor="">
        Sem conta?
      </label>
      <Link
        className="text-beergam-blue-primary hover:text-beergam-orange font-medium"
        to={"/registro"}
        state={{ plan: homeSelectedPlan }}
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
  const login = authStore.use.login();
  const setAuthError = authStore.use.setAuthError();
  const navigate = useNavigate();
  const { connectSession, connectOnlineStatus } = useSocketContext();
  const [currentUserType, setCurrentUserType] = useState<UserRoles>(userType);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const { state } = useLocation();
  const homeSelectedPlan = state?.plan;

  // Form para Master
  const masterForm = useForm<MasterUserForm>({
    resolver: zodResolver(MasterUserFormSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur", // Valida no blur (quando sai do campo)
  });

  // Form para Colaborador
  const colaboradorForm = useForm<ColaboradorUserForm>({
    resolver: zodResolver(ColaboradorUserFormSchema),
    defaultValues: { pin: "", password: "" },
    mode: "onBlur",
  });

  // Seleciona o form ativo baseado no tipo de usuário
  const activeForm = currentUserType === UserRoles.MASTER ? masterForm : colaboradorForm;
  const { handleSubmit, reset } = activeForm;
  const turnstileRef = useRef<BeergamTurnstileRef>(null);

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: async (data: MasterUserForm | ColaboradorUserForm) => {
      const token = turnstileRef.current?.getToken() || "";
      const response = await authService.login(data, token, currentUserType as UserRoles);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      // Resetar Turnstile após sucesso
      turnstileRef.current?.reset();

      const userData = response.data.user;
      const subscriptionData = response.data.subscription;

      login(subscriptionData, userData);

      // Conectar sockets após login bem-sucedido
      setTimeout(() => {
        connectSession();
        connectOnlineStatus();
      }, 100);

      if (!subscriptionData || subscriptionData?.start_date === null) {
        setAuthError("SUBSCRIPTION_NOT_FOUND");
        navigate("/interno/subscription", {
          state: { plan: homeSelectedPlan },
          viewTransition: true,
        });
      } else {
        navigate("/interno/choosen_account", { viewTransition: true });
      }

      return response;
    },
    onError: (error: Error) => {
      // Resetar Turnstile em caso de erro
      turnstileRef.current?.reset();
      toast.error(error.message || "Erro ao fazer login. Tente novamente.");
    },
  });

  // Reset do form quando trocar o tipo de usuário
  useEffect(() => {
    reset();
    loginMutation.reset();
    turnstileRef.current?.reset();
  }, [currentUserType]);

  function ChangeUserType(userType: UserRoles) {
    setCurrentUserType(userType);
  }

  function onFormSubmit(data: MasterUserForm | ColaboradorUserForm) {
    loginMutation.mutate(data);
  }

  return (
    <div
      className={`flex shadow-lg/55 relative z-10 flex-col gap-4 bg-beergam-white h-auto w-full mx-auto my-auto p-8 sm:w-2/3 sm:max-w-lg sm:rounded-4xl`}
    >
      <div className="block w-16 h-16 sm:hidden">
        <img
          src={CDN_IMAGES.BEERGAM_FLOWER_LOGO}
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
        onSubmit={handleSubmit(onFormSubmit)}
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
                placeholder="Email"
                {...masterForm.register("email")}
                error={masterForm.formState.errors.email?.message}
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
                placeholder="Senha"
                {...masterForm.register("password")}
                error={masterForm.formState.errors.password?.message}
                dataTooltipId="password-input"
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
                placeholder="Pin"
                {...colaboradorForm.register("pin")}
                error={colaboradorForm.formState.errors.pin?.message}
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
                placeholder="Senha"
                {...colaboradorForm.register("password")}
                error={colaboradorForm.formState.errors.password?.message}
                dataTooltipId="password-colab-input"
              />
            </Fields.wrapper>
          </>
        )}
        <button
          type="button"
          onClick={() => setIsRecoveryModalOpen(true)}
          className="w-fit text-beergam-blue-primary hover:text-beergam-orange font-medium text-left"
        >
          Esqueceu sua senha?
        </button>
        <BeergamTurnstile
          ref={turnstileRef}
          resetTrigger={currentUserType}
        />
        <div className="flex gap-2 sm:hidden">
          <FormHelpNavigation />
        </div>
        <BeergamButton
          title="Entrar"
          mainColor="beergam-blue-primary"
          animationStyle="slider"
          type="submit"
          className="w-full rounded-2xl"
          disabled={loginMutation.isPending}
          fetcher={{
            fecthing: loginMutation.isPending,
            completed: loginMutation.isSuccess,
            error: loginMutation.isError,
            mutation: loginMutation,
          }}
        />
      </form>
      <RecoveryModal
        isOpen={isRecoveryModalOpen}
        onClose={() => setIsRecoveryModalOpen(false)}
      />
    </div>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { authService } from "~/features/auth/service";
import { useSocketContext } from "~/features/socket/context/SocketContext";
import { setLastActivity } from "~/features/auth/utils/sessionActivityStorage";
import authStore from "~/features/store-zustand";
import UserFields from "~/features/user/components/UserFields";
import { UserRoles } from "~/features/user/typings/BaseUser";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { SubscriptionStatus } from "~/features/user/typings/BaseUser";
import {
  BeergamTurnstile,
  type BeergamTurnstileRef,
} from "~/src/components/utils/BeergamTurnstile";
import RecoveryModal from "../RecoveryModal/RecoveryModal";
import { LoginFormSchema } from "../typing";

export default function LoginForm({
  userType,
  onSuccess,
}: {
  userType: UserRoles;
  onSuccess: () => void;
}) {
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const storeLogin = authStore.use.login();
  const turnstileRef = useRef<BeergamTurnstileRef>(null);
  const { connectSession, connectOnlineStatus } = useSocketContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const loginMutation = useMutation({
    mutationFn: ({
      data,
      token,
    }: {
      data: z.infer<typeof LoginFormSchema>;
      token: string;
    }) => {
      return authService.login(data, token, userType);
    },
    onSuccess: (data) => {
      if (!data.success) {
        throw new Error(data.message);
      }
      storeLogin(data.data.subscription, data.data.user);
      authService.checkLogin();
      setLastActivity();
      // Remove todas as queries do cache e invalida para forçar refetch
      queryClient.removeQueries();
      queryClient.invalidateQueries();
      setTimeout(() => {
        connectSession();
        connectOnlineStatus();
      }, 100);
      if (
        data.data.subscription == null ||
        data.data.subscription?.start_date == null
      ) {
        navigate("/interno/config?session=Minha Assinatura", {
          viewTransition: true,
        });
      } else if (data.data.subscription?.status === SubscriptionStatus.CANCELED) {
        navigate("/interno/config?session=Minha Assinatura", {
          viewTransition: true,
        });
      } else {
        navigate("/interno/choosen_account", { viewTransition: true });
      }
      onSuccess();
      return data.message;
    },
    onError: (error) => {
      turnstileRef.current?.reset();
      setTurnstileToken("");
      storeLogin(null, null);
      return `Erro ao fazer login: ${error.message}`;
    },
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      userRole: userType,
    },
  });
  useEffect(() => {
    setValue("pin", null);
    setValue("email", null);
    setValue("userRole", userType);
    setTurnstileToken("");
    turnstileRef.current?.reset();
  }, [userType]);

  const onSubmit = (data: z.infer<typeof LoginFormSchema>) => {
    const token = turnstileRef.current?.getToken() || turnstileToken;
    const dataToSend =
      userType === UserRoles.MASTER
        ? { email: data.email, password: data.password }
        : { pin: data.pin, password: data.password };
    const request = loginMutation.mutateAsync({ data: dataToSend, token });
    toast.promise(request, {
      loading: "Fazendo login...",
      success: "Login realizado com sucesso",
      error: (error) => {
        console.log("Erro do login", error);
        if (error instanceof Error) {
          return error.message;
        }
        return "Erro ao fazer login";
      },
    });
  };
  return (
    <>
      {userType === UserRoles.MASTER ? (
        <UserFields
          label="Email"
          placeholder="Entre com seu endereço de E-mail"
          canAlter={true}
          {...register("email")}
          error={errors.email?.message}
        />
      ) : (
        <UserFields
          label="PIN"
          placeholder="Entre com seu PIN"
          type="text"
          canAlter={true}
          {...register("pin")}
          error={errors.pin?.message}
        />
      )}
      <UserFields
        label="Senha"
        type="password"
        canAlter={true}
        placeholder="Digite sua senha de acesso"
        {...register("password")}
        error={errors.password?.message}
      />
      {userType === UserRoles.MASTER && (
        <button
          type="button"
          className="text-beergam-typography-primary hover:text-beergam-orange font-medium text-left w-fit"
          onClick={() => setIsRecoveryModalOpen(true)}
        >
          Esqueceu sua senha?
        </button>
      )}
      <BeergamTurnstile ref={turnstileRef} />
      <BeergamButton
        title="Entrar"
        mainColor="beergam-orange"
        className="w-full rounded-2xl"
        onClick={handleSubmit(onSubmit, (errors) => {
          console.log(errors);
          toast.error("Você possui erros pendentes no formulário.");
        })}
        fetcher={{
          fecthing: loginMutation.isPending,
          completed: loginMutation.isSuccess,
          error: loginMutation.isError,
          mutation: loginMutation,
        }}
      />
      <RecoveryModal
        isOpen={isRecoveryModalOpen}
        onClose={() => setIsRecoveryModalOpen(false)}
      />
      <div className="block md:hidden">
        <p className="text-beergam-gray font-medium">Sem conta?</p>
        <Link
          to="/registro"
          className="text-beergam-typography-primary font-medium"
        >
          Cadastre-se
        </Link>
      </div>
    </>
  );
}

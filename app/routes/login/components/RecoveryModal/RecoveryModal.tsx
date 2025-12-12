import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BeergamTurnstile, type BeergamTurnstileRef } from "~/src/components/utils/BeergamTurnstile";
import { Fields } from "~/src/components/utils/_fields";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { Modal } from "~/src/components/utils/Modal";
import toast from "~/src/utils/toast";
import { recoveryService } from "~/features/recovery/service";
import {
  type SendRecoveryCodeForm,
  SendRecoveryCodeFormSchema,
  type ResetPasswordForm,
  ResetPasswordFormSchema,
} from "~/features/recovery/typing";

type RecoveryStep = "send_code" | "verify_code" | "reset_password";

interface RecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecoveryModal({ isOpen, onClose }: RecoveryModalProps) {
  const [currentStep, setCurrentStep] = useState<RecoveryStep>("send_code");
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const turnstileRef = useRef<BeergamTurnstileRef>(null);

  const sendCodeForm = useForm<SendRecoveryCodeForm>({
    resolver: zodResolver(SendRecoveryCodeFormSchema),
    defaultValues: { email: "" },
    mode: "onBlur",
  });

  const resetPasswordForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      email: "",
      code: "",
      new_password: "",
      confirm_password: "",
    },
    mode: "onBlur",
  });

  const sendCodeMutation = useMutation({
    mutationFn: async (data: SendRecoveryCodeForm) => {
      const token = turnstileRef.current?.getToken() || "";
      if (!token) {
        throw new Error("Por favor, complete a verificação de segurança.");
      }

      const response = await recoveryService.sendRecoveryCode(data.email, token);

      if (!response.success) {
        throw new Error(response.message);
      }

      turnstileRef.current?.reset();
      setEmail(data.email);
      return response;
    },
    onSuccess: () => {
      toast.success("Código enviado! Verifique sua caixa de entrada ou pasta de spam.");
      setCurrentStep("verify_code");
    },
    onError: (error: Error) => {
      turnstileRef.current?.reset();
      toast.error(error.message || "Erro ao enviar código. Tente novamente.");
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: async ({ email, code }: { email: string; code: string }) => {
      const response = await recoveryService.verifyCode(email, code);

      if (!response.success) {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: () => {
      resetPasswordForm.setValue("email", email);
      resetPasswordForm.setValue("code", code);
      setCurrentStep("reset_password");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao verificar código. Tente novamente.");
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordForm) => {
      const response = await recoveryService.resetPassword(
        data.email,
        data.code,
        data.new_password
      );

      if (!response.success) {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: () => {
      toast.success("Senha alterada com sucesso!");
      setTimeout(() => {
        handleClose();
      }, 1500);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao redefinir senha. Tente novamente.");
    },
  });

  const handleSendCode = (data: SendRecoveryCodeForm) => {
    sendCodeMutation.mutate(data);
  };

  const handleVerifyCode = () => {
    if (!code || code.length !== 6) {
      toast.error("Por favor, insira um código válido de 6 caracteres.");
      return;
    }

    if (!/^[0-9A-F]{6}$/.test(code)) {
      toast.error("O código deve conter apenas números e letras maiúsculas (A-F).");
      return;
    }

    if (!email) {
      toast.error("Email não encontrado. Por favor, comece novamente.");
      setCurrentStep("send_code");
      return;
    }

    verifyCodeMutation.mutate({ email, code });
  };

  const handleResetPassword = (data: ResetPasswordForm) => {
    resetPasswordMutation.mutate(data);
  };

  const handleClose = () => {
    setCurrentStep("send_code");
    setEmail("");
    setCode("");
    sendCodeForm.reset();
    resetPasswordForm.reset();
    turnstileRef.current?.reset();
    onClose();
  };

  const handleBack = () => {
    if (currentStep === "verify_code") {
      setCurrentStep("send_code");
      setCode("");
      sendCodeForm.reset();
    } else if (currentStep === "reset_password") {
      setCurrentStep("verify_code");
      resetPasswordForm.reset();
    }
  };

  const handleResendCode = () => {
    // Volta para a etapa de envio com o email preenchido
    setCurrentStep("send_code");
    setCode("");
    if (email) {
      sendCodeForm.setValue("email", email);
    }
    // Reset do Turnstile para permitir nova verificação
    turnstileRef.current?.reset();
  };

  const getModalTitle = () => {
    if (currentStep === "send_code") return "Recuperar Senha";
    if (currentStep === "verify_code") return "Verificar Código";
    return "Nova Senha";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={getModalTitle()}
      className="z-1000"
      contentClassName="max-w-lg"
      disableClickAway={currentStep !== "send_code"}
    >
      <div className="flex flex-col gap-4">
          {currentStep === "send_code" && (
            <form
              onSubmit={sendCodeForm.handleSubmit(handleSendCode)}
              className="flex flex-col gap-4"
            >
              <p className="text-beergam-gray text-sm">
                Digite seu e-mail cadastrado e enviaremos um código de verificação.
              </p>
              <Fields.wrapper>
                <Fields.label
                  text="E-MAIL"
                  tailWindClasses="!text-beergam-gray-light"
                />
                <Fields.input
                  type="email"
                  placeholder="Email"
                  {...sendCodeForm.register("email")}
                  error={sendCodeForm.formState.errors.email?.message}
                  dataTooltipId="recovery-email-input"
                />
              </Fields.wrapper>
              <BeergamTurnstile ref={turnstileRef} />
              <BeergamButton
                title="Enviar Código"
                mainColor="beergam-blue-primary"
                animationStyle="slider"
                type="submit"
                className="w-full rounded-2xl"
                disabled={sendCodeMutation.isPending}
                fetcher={{
                  fecthing: sendCodeMutation.isPending,
                  completed: sendCodeMutation.isSuccess,
                  error: sendCodeMutation.isError,
                  mutation: sendCodeMutation,
                }}
              />
            </form>
          )}

          {currentStep === "verify_code" && (
            <div className="flex flex-col gap-4">
              <p className="text-beergam-gray text-sm">
                Digite o código de 6 caracteres que enviamos para{" "}
                <span className="font-semibold">{email}</span>
              </p>
              <Fields.wrapper>
                <Fields.label
                  text="CÓDIGO DE VERIFICAÇÃO"
                  tailWindClasses="!text-beergam-gray-light"
                />
                <Fields.input
                  type="text"
                  placeholder="XXXXXX"
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase().replace(/[^0-9A-F]/g, "");
                    setCode(value);
                  }}
                  className="text-center text-2xl font-mono tracking-widest"
                  dataTooltipId="recovery-code-input"
                />
              </Fields.wrapper>
              <div className="flex gap-2">
                <BeergamButton
                  title="Voltar"
                  mainColor="beergam-gray"
                  animationStyle="slider"
                  type="button"
                  className="w-full rounded-2xl"
                  onClick={handleBack}
                />
                <BeergamButton
                  title="Verificar"
                  mainColor="beergam-blue-primary"
                  animationStyle="slider"
                  type="button"
                  className="w-full rounded-2xl"
                  onClick={handleVerifyCode}
                  disabled={code.length !== 6 || verifyCodeMutation.isPending}
                  fetcher={{
                    fecthing: verifyCodeMutation.isPending,
                    completed: verifyCodeMutation.isSuccess,
                    error: verifyCodeMutation.isError,
                    mutation: verifyCodeMutation,
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleResendCode}
                className="w-fit text-beergam-blue-primary hover:text-beergam-orange font-medium text-sm"
              >
                Não recebeu o código? Reenviar
              </button>
            </div>
          )}

          {currentStep === "reset_password" && (
            <form
              onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)}
              className="flex flex-col gap-4"
            >
              <p className="text-beergam-gray text-sm">
                Digite sua nova senha. Ela deve conter pelo menos 8 caracteres,
                incluindo letras maiúsculas, minúsculas, números e caracteres especiais.
              </p>
              <Fields.wrapper>
                <Fields.label
                  text="NOVA SENHA"
                  tailWindClasses="!text-beergam-gray-light"
                />
                <Fields.input
                  type="password"
                  placeholder="Nova senha"
                  {...resetPasswordForm.register("new_password")}
                  error={resetPasswordForm.formState.errors.new_password?.message}
                  dataTooltipId="recovery-new-password-input"
                />
              </Fields.wrapper>
              <Fields.wrapper>
                <Fields.label
                  text="CONFIRMAR SENHA"
                  tailWindClasses="!text-beergam-gray-light"
                />
                <Fields.input
                  type="password"
                  placeholder="Confirmar senha"
                  {...resetPasswordForm.register("confirm_password")}
                  error={resetPasswordForm.formState.errors.confirm_password?.message}
                  dataTooltipId="recovery-confirm-password-input"
                />
              </Fields.wrapper>
              <input type="hidden" {...resetPasswordForm.register("email")} />
              <input type="hidden" {...resetPasswordForm.register("code")} />
              <div className="flex gap-2">
                <BeergamButton
                  title="Voltar"
                  mainColor="beergam-gray"
                  animationStyle="slider"
                  type="button"
                  className="w-full rounded-2xl"
                  onClick={handleBack}
                />
                <BeergamButton
                  title="Redefinir Senha"
                  mainColor="beergam-blue-primary"
                  animationStyle="slider"
                  type="submit"
                  className="w-full rounded-2xl"
                  disabled={resetPasswordMutation.isPending}
                  fetcher={{
                    fecthing: resetPasswordMutation.isPending,
                    completed: resetPasswordMutation.isSuccess,
                    error: resetPasswordMutation.isError,
                    mutation: resetPasswordMutation,
                  }}
                />
              </div>
            </form>
          )}
      </div>
    </Modal>
  );
}


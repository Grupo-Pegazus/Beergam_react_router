import { useMemo, useCallback, useEffect, useState } from "react";
import * as Sentry from "@sentry/react-router";
import authStore from "../../store-zustand";
import { FloatingButton } from "~/src/components/utils/FloatingButton";
import type { FloatingButtonSize } from "~/src/components/utils/FloatingButton";

export interface SentryFeedbackProps {
  /**
   * Tamanho do botão
   * @default "md"
   */
  size?: FloatingButtonSize;
}

/**
 * Componente que renderiza o botão de feedback do Sentry
 * apenas quando o usuário está autenticado.
 * 
 * O user_pin será incluído automaticamente no feedback
 * através do contexto do Sentry configurado pelo SentryUserSync.
 */
export function SentryFeedback({ size = "md" }: SentryFeedbackProps = {}) {
  const user = authStore.use.user();
  const success = authStore.use.success();
  const [isSentryReady, setIsSentryReady] = useState(false);

  // Verifica se o Sentry está pronto
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 20;
    
    const checkSentryReady = () => {
      try {
        const feedback = Sentry.getFeedback();
        if (feedback) {
          setIsSentryReady(true);
          if (import.meta.env.DEV) {
            console.log("✅ Sentry Feedback está pronto e disponível");
          }
          return; // Para o loop quando encontrar
        }
      } catch {
        // Ignora erros e continua tentando
      }
      
      // Tenta novamente após um pequeno delay (máximo 20 tentativas = ~2 segundos)
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(checkSentryReady, 100);
      } else {
        if (import.meta.env.DEV) {
          console.warn("⚠️ Sentry Feedback não ficou disponível após várias tentativas");
        }
      }
    };

    // Verifica se o Sentry deve estar habilitado
    const shouldCheck = 
      process.env.NODE_ENV === "production" || 
      import.meta.env.VITE_ENABLE_SENTRY === "true";

    if (shouldCheck) {
      // Inicia a verificação após um pequeno delay para dar tempo do Sentry inicializar
      setTimeout(checkSentryReady, 200);
    }
  }, []);

  // Só renderiza se o usuário estiver logado
  const isAuthenticated = useMemo(
    () => success === true && user !== null && user.pin !== null && user.pin !== undefined,
    [success, user]
  );

  const handleOpenFeedback = useCallback(async () => {
    // Permite testar em desenvolvimento se VITE_ENABLE_SENTRY estiver habilitado
    const isProduction = process.env.NODE_ENV === "production";
    const isDevWithSentry = import.meta.env.DEV && import.meta.env.VITE_ENABLE_SENTRY === "true";
    
    if (!isProduction && !isDevWithSentry) {
      console.log("💡 Para testar o feedback em desenvolvimento, defina VITE_ENABLE_SENTRY=true no .env");
      return;
    }

    if (!isSentryReady) {
      console.warn("⚠️ Sentry ainda não está pronto. Aguarde alguns instantes e tente novamente.");
      return;
    }

    try {
      const feedback = Sentry.getFeedback();
      if (!feedback) {
        console.warn("⚠️ Feedback integration não está inicializada");
        if (import.meta.env.DEV) {
          console.log("💡 O Sentry pode ainda estar inicializando. Tente novamente em alguns segundos.");
        }
        return;
      }

      // Cria e abre o formulário de feedback
      // Todas as customizações (textos, tema) já estão configuradas no feedbackIntegration
      // O user_pin será incluído automaticamente via contexto do Sentry configurado pelo SentryUserSync
      const form = await feedback.createForm({
        tags: {
          "feedback.source": "manual_button",
        },
      });
      form.appendToDom();
      form.open();
      
      if (import.meta.env.DEV) {
        console.log("✅ Formulário de feedback aberto em modo desenvolvimento");
      }
    } catch (error) {
      console.error("❌ Erro ao abrir formulário de feedback:", error);
      if (import.meta.env.DEV) {
        console.log("💡 Verifique se o Sentry está configurado corretamente");
      }
    }
  }, [isSentryReady]);

  if (!isAuthenticated) {
    return null;
  }

  // Mostra o botão mesmo se o Sentry não estiver pronto (para feedback visual)
  // mas desabilita se não estiver pronto
  return (
    <FloatingButton
      size={size}
      onClick={handleOpenFeedback}
      disabled={!isSentryReady}
      className={`bg-beergam-primary text-white hover:shadow-xl focus:ring-beergam-primary ${
        !isSentryReady ? "opacity-50 cursor-not-allowed" : ""
      }`}
      aria-label={isSentryReady ? "Enviar feedback" : "Aguardando inicialização do Sentry"}
      title={isSentryReady ? "Enviar feedback" : "Aguardando inicialização do Sentry"}
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
        />
      </svg>
    </FloatingButton>
  );
}

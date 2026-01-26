import * as Sentry from "@sentry/react-router";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { injectSpeedInsights } from '@vercel/speed-insights';

injectSpeedInsights();

// Permite testar Sentry em desenvolvimento usando VITE_ENABLE_SENTRY=true
const shouldInitSentry =
  process.env.NODE_ENV === 'production' ||
  import.meta.env.VITE_ENABLE_SENTRY === 'true';

// Inicializa o Sentry após o React estar pronto para evitar conflitos
function initSentry() {
  if (!shouldInitSentry) return;

  try {
    const isDev = import.meta.env.DEV;
    const shouldSendEvents = process.env.NODE_ENV === 'production' || import.meta.env.VITE_SENTRY_ENABLED === 'true';

    Sentry.init({
      dsn: "https://d60970e1a513659438f62932021d473b@o4508965755158528.ingest.us.sentry.io/4510121563193344",
      // Adds request headers and IP for users, for more info visit:
      // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
      sendDefaultPii: true,
      // Em desenvolvimento, mantém habilitado para que as integrações funcionem
      // mas usa beforeSend para filtrar eventos se necessário
      enabled: true, // Sempre habilitado para que as integrações funcionem
      // Ambiente para identificar de onde veio o evento
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
      integrations: [
        // Session Replay
        Sentry.replayIntegration(),
        // User Feedback Widget - será controlado manualmente via componente SentryFeedback
        Sentry.feedbackIntegration({
          autoInject: false, // Não cria botão automático, usamos nosso próprio
          colorScheme: "system",
          // Textos customizados em português
          formTitle: "Enviar Feedback",
          submitButtonLabel: "Enviar",
          cancelButtonLabel: "Cancelar",
          nameLabel: "Nome",
          namePlaceholder: "Seu nome",
          emailLabel: "E-mail",
          emailPlaceholder: "seu@email.com",
          messageLabel: "Mensagem",
          messagePlaceholder: "Descreva o problema ou envie seu feedback...",
          successMessageText: "Obrigado pelo seu feedback!",
          // Tema customizado com cores do Beergam
          themeLight: {
            background: "#ffffff",
            foreground: "#284277",
            accentBackground: "#284277",
            accentForeground: "#ffffff",
            border: "rgba(0, 0, 0, 0.2)",
            success: "#87de72",
            error: "#de7272",
          },
          themeDark: {
            background: "#15181d",
            foreground: "#ffffff",
            accentBackground: "#ff8a00",
            accentForeground: "#ffffff",
            border: "transparent",
            success: "#87de72",
            error: "#de7272",
          },
        }),
      ],
      replaysSessionSampleRate: 0.1, // Capture 10% of all sessions
      replaysOnErrorSampleRate: 1.0, // Capture 100% of sessions with an error
      // Em desenvolvimento, mostra logs no console para debug
      debug: isDev && import.meta.env.VITE_SENTRY_DEBUG === 'true',
      // Filtra eventos em desenvolvimento se não quiser enviar para o Sentry
      beforeSend(event, hint) {
        // Se não deve enviar eventos em desenvolvimento, retorna null
        if (!shouldSendEvents && isDev) {
          if (import.meta.env.VITE_SENTRY_DEBUG === 'true') {
            console.log('🚫 Evento do Sentry bloqueado (modo desenvolvimento):', event.type || event.event_id);
          }
          return null;
        }
        return event;
      },
    });

    if (import.meta.env.DEV) {
      console.log('🔧 Sentry inicializado em modo desenvolvimento para testes');
      // Verifica se o feedback está disponível após inicialização
      // Tenta várias vezes porque pode levar um tempo para inicializar
      let attempts = 0;
      const maxAttempts = 10;
      const checkFeedback = setInterval(() => {
        attempts++;
        const feedback = Sentry.getFeedback();
        if (feedback) {
          console.log('✅ Feedback integration disponível após inicialização');
          clearInterval(checkFeedback);
        } else if (attempts >= maxAttempts) {
          console.warn('⚠️ Feedback integration não está disponível após várias tentativas.');
          console.log('💡 Verifique se a integração foi adicionada corretamente nas configurações do Sentry.');
          clearInterval(checkFeedback);
        }
      }, 200);
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar Sentry:', error);
  }
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );

  // Inicializa o Sentry após o React estar pronto
  // Mas de forma mais rápida para que o feedback esteja disponível logo
  if (shouldInitSentry) {
    // Usa um timeout menor para inicializar mais rapidamente
    setTimeout(initSentry, 100);
  }
});
import { useEffect } from "react";
import * as Sentry from "@sentry/react-router";
import authStore from "../../store-zustand";

/**
 * Componente que sincroniza o contexto do usuário do Sentry
 * com o estado de autenticação da aplicação.
 * 
 * Atualiza automaticamente o user_pin e outras informações
 * do usuário no Sentry quando o usuário faz login/logout.
 */
export function SentryUserSync() {
  const user = authStore.use.user();
  const success = authStore.use.success();

  useEffect(() => {
    if (success && user?.pin) {
      // Define o contexto do usuário no Sentry
      Sentry.setUser({
        id: user.pin,
        username: user.name,
        // Adiciona o user_pin como tag customizada
        // Isso será incluído automaticamente em todos os eventos
      });

      // Define tags customizadas que serão incluídas no feedback
      Sentry.setTag("user_pin", user.pin);
      Sentry.setTag("user_role", user.role);
      
      if (import.meta.env.DEV) {
        console.log("✅ Sentry: Contexto do usuário atualizado", {
          user_pin: user.pin,
          username: user.name,
          role: user.role,
        });
      }
    } else {
      // Remove o contexto do usuário quando faz logout
      Sentry.setUser(null);
      Sentry.setTag("user_pin", undefined);
      Sentry.setTag("user_role", undefined);
      
      if (import.meta.env.DEV) {
        console.log("🔓 Sentry: Contexto do usuário removido (logout)");
      }
    }
  }, [success, user]);

  return null;
}

import { useLocation } from "react-router";
import { ThemeToggle } from "../ThemeToggle";
import { SentryFeedback } from "~/features/sentry/components/SentryFeedback";
import { WhatsAppButton } from "../WhatsAppButton";
import { type FloatingButtonSize } from "../FloatingButton";

export interface FloatingActionButtonsProps {
  /**
   * Tamanho dos botões flutuantes
   * @default "lg"
   */
  size?: FloatingButtonSize;
}

/**
 * Componente que organiza os botões de ação flutuantes no canto inferior direito
 * Mantém os botões organizados verticalmente com espaçamento adequado
 * 
 * Adapta-se automaticamente ao layout:
 * - Mobile: ajusta posição para não sobrepor a navegação inferior
 * - Desktop: posiciona normalmente no canto inferior direito
 * 
 * Usa o sistema de tamanhos padronizados (sm, md, lg) que pode ser aplicado
 * a qualquer botão flutuante do sistema através do componente FloatingButton
 */
export function FloatingActionButtons({
  size = "lg",
}: FloatingActionButtonsProps = {}) {
  const location = useLocation();

  const isInternalRoute = location.pathname.startsWith("/interno");
  
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end transition-all duration-300 ${
        isInternalRoute ? "floating-action-buttons" : ""
      }`}
    >
      <WhatsAppButton size={size} />

      <SentryFeedback size={size} />

      <ThemeToggle size={size} />
    </div>
  );
}

import { ThemeToggle } from "../ThemeToggle";
import { SentryFeedback } from "~/features/sentry/components/SentryFeedback";
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
 * Usa o sistema de tamanhos padronizados (sm, md, lg) que pode ser aplicado
 * a qualquer botão flutuante do sistema através do componente FloatingButton
 */
export function FloatingActionButtons({
  size = "lg",
}: FloatingActionButtonsProps = {}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex gap-3 items-end">
      {/* Botão de Feedback do Sentry */}
      <SentryFeedback size={size} />

      {/* Botão de Toggle de Tema */}
      <ThemeToggle size={size} />
    </div>
  );
}

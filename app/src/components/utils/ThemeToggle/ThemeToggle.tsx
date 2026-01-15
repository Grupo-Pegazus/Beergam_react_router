import Svg from "~/src/assets/svgs/_index";
import { useTheme } from "~/src/hooks/useTheme";
import { FloatingButton, type FloatingButtonSize } from "../FloatingButton";

export interface ThemeToggleProps {
  /**
   * Tamanho do botão
   * @default "md"
   */
  size?: FloatingButtonSize;
}

/**
 * Componente fixo na tela para alternar entre temas claro e escuro
 * Usa o sistema de tamanhos padronizados de FloatingButton
 */
export function ThemeToggle({ size = "md" }: ThemeToggleProps = {}) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <FloatingButton
      size={size}
      onClick={toggleTheme}
      className="bg-beergam-blue text-white hover:bg-beergam-blue-dark focus:ring-beergam-blue group"
      aria-label={
        isDark ? "Alternar para modo claro" : "Alternar para modo escuro"
      }
      title={
        isDark
          ? "Modo Escuro - Clique para modo claro"
          : "Modo Claro - Clique para modo escuro"
      }
    >
      <div className="relative w-full h-full">
        {/* Ícone do Sol - aparece no modo escuro */}
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 rotate-90 scale-0"
          }`}
        >
          <Svg.sun className="w-full h-full" />
        </div>

        {/* Ícone da Lua - aparece no modo claro */}
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            isDark
              ? "opacity-0 -rotate-90 scale-0"
              : "opacity-100 rotate-0 scale-100"
          }`}
        >
          <Svg.moon className="w-full h-full" />
        </div>
      </div>
    </FloatingButton>
  );
}

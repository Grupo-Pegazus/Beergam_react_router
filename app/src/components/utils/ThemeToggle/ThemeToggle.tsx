import Svg from "~/src/assets/svgs/_index";
import { useTheme } from "~/src/hooks/useTheme";

/**
 * Componente fixo na tela para alternar entre temas claro e escuro
 * Posicionado no canto inferior direito da tela
 */
export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed flex bottom-6 right-6 z-50 items-center justify-center w-14 h-14 rounded-full bg-beergam-blue text-white shadow-lg hover:bg-beergam-blue-dark hover:scale-110 active:scale-95 transition-all duration-300 group"
      aria-label={
        isDark ? "Alternar para modo claro" : "Alternar para modo escuro"
      }
      title={
        isDark
          ? "Modo Escuro - Clique para modo claro"
          : "Modo Claro - Clique para modo escuro"
      }
    >
      <div className="relative w-6 h-6">
        {/* Ícone do Sol - aparece no modo escuro */}
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 rotate-90 scale-0"
          }`}
        >
          <Svg.sun width={24} height={24} />
        </div>

        {/* Ícone da Lua - aparece no modo claro */}
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            isDark
              ? "opacity-0 -rotate-90 scale-0"
              : "opacity-100 rotate-0 scale-100"
          }`}
        >
          <Svg.moon width={24} height={24} />
        </div>
      </div>
    </button>
  );
}

import { useThemeContext } from "~/src/components/utils/ThemeProvider/ThemeProvider";

/**
 * Hook para acessar o tema dark mode
 * Suporta três modos: light, dark e system (respeita preferência do sistema)
 *
 * @deprecated Use useThemeContext diretamente se precisar do contexto completo
 * Este hook mantém compatibilidade com código existente
 */
export function useTheme() {
  return useThemeContext();
}

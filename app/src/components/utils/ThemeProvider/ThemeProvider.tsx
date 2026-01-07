import { useEffect } from "react";
import { useTheme } from "~/src/hooks/useTheme";

/**
 * Provider que inicializa o tema no carregamento da página
 * Deve ser usado no root da aplicação para evitar FOUC (Flash of Unstyled Content)
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();

  // Inicializa o tema antes do primeiro render (evita FOUC)
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "system";
    const root = window.document.documentElement;

    let shouldBeDark = false;

    if (theme === "system") {
      shouldBeDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    } else {
      shouldBeDark = theme === "dark";
    }

    root.classList.remove("light", "dark");
    if (shouldBeDark) {
      root.classList.add("dark");
    } else {
      root.classList.add("light");
    }
  }, []);

  return <>{children}</>;
}


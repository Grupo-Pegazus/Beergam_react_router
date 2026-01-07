import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

/**
 * Hook para gerenciar o tema dark mode
 * Suporta três modos: light, dark e system (respeita preferência do sistema)
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Verifica se está no navegador
    if (typeof window === "undefined") return "system";

    // Tenta recuperar do localStorage
    const stored = localStorage.getItem("theme") as Theme | null;
    return stored || "system";
  });

  const [isDark, setIsDark] = useState(false);

  // Atualiza a classe 'dark' no HTML baseado no tema
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove classes anteriores
    root.classList.remove("light", "dark");

    let shouldBeDark = false;

    if (theme === "system") {
      // Verifica a preferência do sistema
      shouldBeDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    } else {
      shouldBeDark = theme === "dark";
    }

    // Aplica a classe dark se necessário
    if (shouldBeDark) {
      root.classList.add("dark");
    } else {
      root.classList.add("light");
    }

    setIsDark(shouldBeDark);

    // Salva no localStorage
    if (theme !== "system") {
      localStorage.setItem("theme", theme);
    } else {
      localStorage.removeItem("theme");
    }
  }, [theme]);

  // Escuta mudanças na preferência do sistema quando o tema é "system"
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      
      if (e.matches) {
        root.classList.add("dark");
        setIsDark(true);
      } else {
        root.classList.add("light");
        setIsDark(false);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("light");
    } else {
      // Se for system, alterna para dark ou light baseado no estado atual
      setTheme(isDark ? "light" : "dark");
    }
  };

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
  };
}


import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  setTheme: (newTheme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Provider que gerencia o tema dark mode e compartilha o estado entre componentes
 * Deve ser usado no root da aplicação para evitar FOUC (Flash of Unstyled Content)
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Verifica se está no navegador
    if (typeof window === "undefined") return "system";

    // Tenta recuperar do localStorage
    const stored = localStorage.getItem("theme") as Theme | null;
    return stored || "system";
  });

  const [isDark, setIsDark] = useState(false);

  // Inicializa o tema antes do primeiro render (evita FOUC)
  useEffect(() => {
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

    setIsDark(shouldBeDark);
  }, []);

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

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook para acessar o contexto do tema
 * Deve ser usado dentro de um ThemeProvider
 */
export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      "useThemeContext deve ser usado dentro de um ThemeProvider"
    );
  }
  return context;
}

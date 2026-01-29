import { createContext, useContext, useId, useMemo } from "react";
import { ResponsiveContainer } from "recharts";
import type { ChartConfig, ChartContainerProps } from "./types";

/**
 * Contexto do Chart para compartilhar configuração entre componentes
 */
interface ChartContextValue {
  config: ChartConfig;
}

const ChartContext = createContext<ChartContextValue | null>(null);

/**
 * Hook para acessar a configuração do gráfico
 */
export function useChart() {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChart deve ser usado dentro de um ChartContainer");
  }
  return context;
}

/**
 * Gera variáveis CSS para as cores do gráfico
 */
function generateColorVariables(config: ChartConfig): React.CSSProperties {
  const variables: Record<string, string> = {};

  Object.entries(config).forEach(([key, value]) => {
    if (value.color) {
      variables[`--color-${key}`] = value.color;
    }
    if (value.theme) {
      // Para temas, usa a cor light por padrão (CSS vai sobrescrever no dark mode)
      variables[`--color-${key}`] = value.theme.light;
    }
  });

  return variables as React.CSSProperties;
}

/**
 * Gera estilos CSS para dark mode
 */
function generateDarkModeStyles(config: ChartConfig, id: string): string {
  const darkStyles: string[] = [];

  Object.entries(config).forEach(([key, value]) => {
    if (value.theme?.dark) {
      darkStyles.push(`--color-${key}: ${value.theme.dark};`);
    }
  });

  if (darkStyles.length === 0) return "";

  return `.dark #${id} { ${darkStyles.join(" ")} }`;
}

/**
 * Container principal do gráfico
 * 
 * Provê contexto de configuração e responsividade para os componentes filhos.
 * Use com componentes do Recharts (BarChart, LineChart, AreaChart, etc.)
 * 
 * @example
 * ```tsx
 * <ChartContainer config={chartConfig} className="min-h-[200px]">
 *   <BarChart data={data}>
 *     <Bar dataKey="desktop" fill="var(--color-desktop)" />
 *   </BarChart>
 * </ChartContainer>
 * ```
 */
export function ChartContainer({
  config,
  children,
  className = "",
  id: providedId,
}: ChartContainerProps) {
  const generatedId = useId();
  const id = providedId ?? `chart-${generatedId.replace(/:/g, "")}`;

  const colorVariables = useMemo(() => generateColorVariables(config), [config]);
  const darkModeStyles = useMemo(() => generateDarkModeStyles(config, id), [config, id]);

  const contextValue = useMemo(() => ({ config }), [config]);

  return (
    <ChartContext.Provider value={contextValue}>
      {darkModeStyles && (
        <style dangerouslySetInnerHTML={{ __html: darkModeStyles }} />
      )}
      <div
        id={id}
        className={`w-full ${className}`}
        style={colorVariables}
      >
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

export default ChartContainer;

/**
 * 📊 Beergam Chart Components
 * 
 * Sistema de gráficos baseado em Recharts com estilos customizados.
 * Inspirado no shadcn/ui Chart (https://ui.shadcn.com/docs/components/chart)
 * 
 * @example Basic Bar Chart
 * ```tsx
 * import { 
 *   ChartContainer, 
 *   ChartTooltip, 
 *   ChartTooltipContent,
 *   ChartLegend,
 *   ChartLegendContent,
 *   type ChartConfig 
 * } from "~/src/components/ui/Chart";
 * import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
 * 
 * const chartConfig: ChartConfig = {
 *   desktop: {
 *     label: "Desktop",
 *     color: "var(--color-beergam-orange)",
 *   },
 *   mobile: {
 *     label: "Mobile", 
 *     color: "var(--color-beergam-blue)",
 *   },
 * };
 * 
 * const data = [
 *   { month: "Jan", desktop: 186, mobile: 80 },
 *   { month: "Feb", desktop: 305, mobile: 200 },
 * ];
 * 
 * export function MyChart() {
 *   return (
 *     <ChartContainer config={chartConfig} className="min-h-[300px]">
 *       <BarChart data={data} accessibilityLayer>
 *         <CartesianGrid vertical={false} />
 *         <XAxis dataKey="month" />
 *         <YAxis />
 *         <ChartTooltip content={<ChartTooltipContent />} />
 *         <ChartLegend content={<ChartLegendContent />} />
 *         <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
 *         <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
 *       </BarChart>
 *     </ChartContainer>
 *   );
 * }
 * ```
 */

// Componentes principais
export { ChartContainer, useChart } from "./ChartContainer";
export { ChartTooltip, ChartTooltipContent } from "./ChartTooltip";
export { ChartLegend, ChartLegendContent } from "./ChartLegend";

// Tipos
export type {
  ChartConfig,
  ChartConfigItem,
  ChartContainerProps,
  ChartTooltipContentProps,
  ChartLegendContentProps,
} from "./types";

// Constantes de cores
export { CHART_COLORS, CHART_COLOR_PALETTE } from "./types";

/**
 * Estilos padrão para o CartesianGrid
 */
export const chartGridStyle = {
  strokeDasharray: "3 3",
  stroke: "var(--color-beergam-typography-secondary)",
  opacity: 0.3,
};

/**
 * Estilos padrão para os eixos X e Y
 */
export const chartAxisStyle = {
  stroke: "var(--color-beergam-typography-secondary)",
  fontSize: 11,
  tick: { fill: "var(--color-beergam-typography-secondary)" },
  tickLine: false,
  axisLine: false,
};

/**
 * Estilos padrão para XAxis com labels angulados
 */
export const chartXAxisAngledStyle = {
  ...chartAxisStyle,
  angle: -45,
  textAnchor: "end" as const,
  height: 60,
  interval: "preserveStartEnd" as const,
};

/**
 * Formatadores comuns para valores
 */
export const chartFormatters = {
  /** Formata valor como moeda BRL */
  currency: (value: number): string =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value),

  /** Formata valor como moeda BRL com centavos */
  currencyFull: (value: number): string =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value),

  /** Formata valor como número com separador de milhares */
  number: (value: number): string =>
    new Intl.NumberFormat("pt-BR").format(value),

  /** Formata valor como porcentagem */
  percent: (value: number): string =>
    new Intl.NumberFormat("pt-BR", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100),

  /** Formata valor abreviado (1K, 1M, etc) */
  compact: (value: number): string =>
    new Intl.NumberFormat("pt-BR", {
      notation: "compact",
      compactDisplay: "short",
    }).format(value),
};

/**
 * Helper para criar configuração de gráfico rapidamente
 * 
 * @example
 * ```tsx
 * const config = createChartConfig({
 *   faturamento: "Faturamento Bruto",
 *   lucro: "Lucro Líquido",
 * });
 * // Usa cores da paleta automaticamente
 * ```
 */
export function createChartConfig(
  labels: Record<string, string>,
  colors?: Record<string, string>
): Record<string, { label: string; color: string }> {
  const palette = [
    "var(--color-beergam-orange)",
    "var(--color-beergam-blue)",
    "var(--color-beergam-green)",
    "var(--color-beergam-purple)",
    "var(--color-beergam-red)",
    "var(--color-beergam-yellow)",
  ];

  return Object.fromEntries(
    Object.entries(labels).map(([key, label], index) => [
      key,
      {
        label,
        color: colors?.[key] || palette[index % palette.length],
      },
    ])
  );
}

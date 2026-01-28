import type { ComponentType, SVGProps } from "react";

/**
 * Configuração de um item do gráfico
 * Define label, cor e ícone para cada série de dados
 */
export interface ChartConfigItem {
  /** Label legível para humanos (ex: "Faturamento Bruto") */
  label: string;
  /** Cor do item - pode ser variável CSS (var(--color-x)) ou valor direto (hex, hsl, oklch) */
  color?: string;
  /** Objeto de tema com cores para light e dark mode */
  theme?: {
    light: string;
    dark: string;
  };
  /** Ícone opcional para exibir na legenda */
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

/**
 * Configuração completa do gráfico
 * Mapeia as chaves dos dados para suas configurações visuais
 */
export type ChartConfig = Record<string, ChartConfigItem>;

/**
 * Props do ChartContainer
 */
export interface ChartContainerProps {
  /** Configuração do gráfico com labels, cores e ícones */
  config: ChartConfig;
  /** Conteúdo do gráfico (componentes Recharts) */
  children: React.ReactNode;
  /** Classes CSS adicionais */
  className?: string;
  /** ID único para o gráfico */
  id?: string;
}

/**
 * Props do ChartTooltipContent
 */
export interface ChartTooltipContentProps {
  /** Esconde o label do tooltip */
  hideLabel?: boolean;
  /** Esconde o indicador de cor */
  hideIndicator?: boolean;
  /** Estilo do indicador: dot (círculo), line (linha) ou dashed (tracejado) */
  indicator?: "dot" | "line" | "dashed";
  /** Chave para usar como label (se diferente do padrão) */
  labelKey?: string;
  /** Chave para usar como nome (se diferente do padrão) */
  nameKey?: string;
  /** Formatador customizado para o valor */
  valueFormatter?: (value: number | string) => string;
  /** Classes CSS adicionais */
  className?: string;
  /** Título do tooltip */
  title?: string;
}

/**
 * Props do ChartLegendContent
 */
export interface ChartLegendContentProps {
  /** Chave para usar como nome (se diferente do padrão) */
  nameKey?: string;
  /** Esconde os ícones da legenda */
  hideIcon?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Cores padrão do tema Beergam para gráficos
 */
export const CHART_COLORS = {
  orange: "var(--color-beergam-orange)",
  blue: "var(--color-beergam-blue)",
  green: "var(--color-beergam-green)",
  red: "var(--color-beergam-red)",
  purple: "var(--color-beergam-purple)",
  yellow: "var(--color-beergam-yellow)",
  primary: "var(--color-beergam-primary)",
  secondary: "var(--color-beergam-typography-secondary)",
} as const;

/**
 * Paleta de cores para múltiplas séries
 */
export const CHART_COLOR_PALETTE = [
  CHART_COLORS.orange,
  CHART_COLORS.blue,
  CHART_COLORS.green,
  CHART_COLORS.purple,
  CHART_COLORS.red,
  CHART_COLORS.yellow,
] as const;

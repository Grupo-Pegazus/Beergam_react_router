/**
 * Tamanhos disponíveis para botões flutuantes
 */
export type FloatingButtonSize = "sm" | "md" | "lg";

/**
 * Configuração de tamanhos para botões flutuantes
 * Define width, height e padding para cada tamanho
 */
export const FLOATING_BUTTON_SIZES: Record<
  FloatingButtonSize,
  {
    container: string;
    icon: string;
  }
> = {
  sm: {
    container: "w-10 h-10 p-2",
    icon: "h-4 w-4",
  },
  md: {
    container: "w-12 h-12 p-2.5",
    icon: "h-5 w-5",
  },
  lg: {
    container: "w-14 h-14 p-3",
    icon: "h-6 w-6",
  },
};

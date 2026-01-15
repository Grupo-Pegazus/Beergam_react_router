import { type ReactNode, type ButtonHTMLAttributes } from "react";
import { FLOATING_BUTTON_SIZES, type FloatingButtonSize } from "./types";

export interface FloatingButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  /**
   * Tamanho do botão flutuante
   * @default "md"
   */
  size?: FloatingButtonSize;
  /**
   * Conteúdo do botão (geralmente um ícone)
   */
  children: ReactNode;
  /**
   * Classes CSS adicionais para o container do botão
   */
  className?: string;
  /**
   * Classes CSS adicionais para o ícone interno
   */
  iconClassName?: string;
}

/**
 * Componente base para botões flutuantes
 * Fornece tamanhos padronizados (sm, md, lg) e estilos consistentes
 * 
 * @example
 * ```tsx
 * <FloatingButton size="lg" onClick={handleClick}>
 *   <Icon />
 * </FloatingButton>
 * ```
 */
export function FloatingButton({
  size = "md",
  children,
  className = "",
  iconClassName = "",
  ...props
}: FloatingButtonProps) {
  const sizeConfig = FLOATING_BUTTON_SIZES[size];

  return (
    <button
      {...props}
      className={`flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${sizeConfig.container} ${className}`}
    >
      <div className={`${sizeConfig.icon} ${iconClassName}`}>{children}</div>
    </button>
  );
}

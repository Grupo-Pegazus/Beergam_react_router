import { type ReactNode } from "react";
import { useCensorship } from "./CensorshipContext";

interface TextCensoredProps {
  children: ReactNode;
  censorshipKey: string;
  replacement?: string; // Padrão: "*"
  className?: string;
  forceCensor?: boolean; // Força a censura independentemente do estado no localStorage
}

export function TextCensored({
  children,
  censorshipKey,
  replacement = "*",
  className,
  forceCensor = false,
}: TextCensoredProps) {
  const { isCensored } = useCensorship();
  const censored = forceCensor || isCensored(censorshipKey);

  if (censored) {
    // Se estiver censurado, substitui o texto por estrelas
    const text = typeof children === "string" ? children : String(children);
    const censoredText = text.replace(/./g, replacement);
    return <span className={className}>{censoredText}</span>;
  }

  return <span className={className}>{children}</span>;
}


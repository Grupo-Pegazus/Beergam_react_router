import { type ReactNode } from "react";
import { useCensorship } from "./CensorshipContext";
import { type TPREDEFINED_CENSORSHIP_KEYS } from "./typings";

interface TextCensoredProps {
  children: ReactNode;
  censorshipKey: TPREDEFINED_CENSORSHIP_KEYS;
  replacement?: string; // Padrão: "*"
  className?: string;
  forceCensor?: boolean; // Força a censura independentemente do estado no localStorage
  maxCharacters?: number;
}

export function TextCensored({
  children,
  censorshipKey,
  replacement = "*",
  className,
  forceCensor = false,
  maxCharacters = 100,
}: TextCensoredProps) {
  const { isCensored } = useCensorship();
  const censored = forceCensor || isCensored(censorshipKey);

  if (censored) {
    // Se estiver censurado, substitui o texto por estrelas
    const text = typeof children === "string" ? children : String(children);
    const censoredText = text.replace(/./g, replacement);
    const censoredTextTruncated = censoredText.slice(0, maxCharacters);
    return <span className={className}>{censoredTextTruncated}</span>;
  }

  return <span className={className}>{children}</span>;
}

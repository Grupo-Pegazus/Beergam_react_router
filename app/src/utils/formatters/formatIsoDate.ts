const ISO_DATE_REGEX =
  /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})?/g;

/**
 * Converte uma string ISO em data/hora legível no locale informado.
 * Mantém a string original quando o parse falha.
 */
export function formatIsoDate(isoString: string, locale = "pt-BR"): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return isoString;
  }

  return date.toLocaleString(locale, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

/**
 * Varre um texto e converte todas as ocorrências ISO detectadas.
 */
export function formatIsoDateInText(
  text: string,
  locale = "pt-BR"
): string {
  return text.replace(ISO_DATE_REGEX, (match) => formatIsoDate(match, locale));
}


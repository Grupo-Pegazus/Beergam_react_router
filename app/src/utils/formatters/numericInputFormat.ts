/**
 * Formatadores e parsers para uso em inputs numéricos (ex.: moeda, inteiro, decimal).
 * Permite exibir valor formatado no input e obter número puro no onChange.
 */

export type NumericFormatType = "currency" | "integer" | "decimal";

export interface NumericFormatConfig {
  /** Converte valor numérico para string de exibição */
  format: (value: number) => string;
  /** Converte string digitada (ou exibida) para número; retorna NaN se inválido */
  parse: (display: string) => number;
}

/** Remove tudo que não for dígito ou separador decimal (vírgula ou ponto) */
function stripNonNumeric(value: string): string {
  return value.replace(/[^\d,.-]/g, "").replace(".", ",");
}

/** Normaliza número em pt-BR: "1.234,56" -> 1234.56. Aceita "." e "," como decimal */
function parsePtBrNumber(value: string): number {
  if (!value || value.trim() === "") return Number.NaN;
  const cleaned = stripNonNumeric(value)
    .replace(/\./g, "")
    .replace(",", ".");
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

/** Verifica se a string é um valor parcial (ex: "1." ou "1,") que não deve ser formatado */
export function isPartialDecimal(value: string): boolean {
  if (typeof value !== "string" || !value.trim()) return false;
  const cleaned = value.replace(/[^\d,.]/g, "");
  return /^\d+[.,]$/.test(cleaned);
}

/** Formata número para exibição em pt-BR com 2 decimais (moeda) */
function formatPtBrCurrency(value: number): string {
  if (!Number.isFinite(value)) return "";
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export const numericFormats: Record<NumericFormatType, NumericFormatConfig> = {
  currency: {
    format: (value) => formatPtBrCurrency(value),
    parse: (display) => parsePtBrNumber(display),
  },
  integer: {
    format: (value) =>
      Number.isFinite(value) ? Math.round(value).toLocaleString("pt-BR") : "",
    parse: (display) => {
      const cleaned = display.replace(/\D/g, "");
      if (cleaned === "") return Number.NaN;
      const parsed = parseInt(cleaned, 10);
      return Number.isFinite(parsed) ? parsed : Number.NaN;
    },
  },
  decimal: {
    format: (value) =>
      Number.isFinite(value)
        ? value.toLocaleString("pt-BR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 4,
          })
        : "",
    parse: (display) => parsePtBrNumber(display),
  },
};

/** Retorna configuração de formatação pelo tipo (e opcional escala para decimal) */
export function getNumericFormat(
  type: NumericFormatType,
  decimalScale?: number
): NumericFormatConfig {
  const base = numericFormats[type];
  if (type === "decimal" && decimalScale != null) {
    return {
      format: (value) =>
        Number.isFinite(value)
          ? value.toLocaleString("pt-BR", {
              minimumFractionDigits: 0,
              maximumFractionDigits: decimalScale,
            })
          : "",
      parse: base.parse,
    };
  }
  return base;
}

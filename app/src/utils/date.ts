import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

/**
 * Converte "YYYY-MM-DD" para ISO preservando o dia no timezone local.
 *
 * new Date("2025-02-01") interpreta como meia-noite UTC, causando off-by-one
 * em fusos negativos (ex: Brasil UTC-3 → dia 1 vira 31/01).
 *
 * Usar new Date(y, m-1, d) cria a data no horário local corretamente.
 */
export function dateStringToISO(date: string): string {
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, y, m, d] = match.map(Number);
    return new Date(y, m - 1, d).toISOString();
  }
  return new Date(date).toISOString();
}

/**
 * Converte "YYYY-MM-DD" para Dayjs no timezone local.
 * Evita o bug de dayjs("2025-02-01") interpretar como UTC.
 */
export function dateStringToDayjs(value: string): Dayjs {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, y, m, d] = match.map(Number);
    return dayjs().year(y).month(m - 1).date(d).startOf("day");
  }
  return dayjs(value);
}

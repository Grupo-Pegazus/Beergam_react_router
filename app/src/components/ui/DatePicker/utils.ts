import dayjs, { type Dayjs } from "dayjs";

/**
 * Converte string para Dayjs de forma segura.
 * Suporta YYYY-MM-DD, ISO com hora, etc.
 */
export function parseToDayjs(value?: string | null): Dayjs | null {
  if (!value || typeof value !== "string") return null;

  const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateOnlyMatch) {
    const [, y, m, d] = dateOnlyMatch.map(Number);
    const parsed = dayjs().year(y).month(m - 1).date(d).startOf("day");
    if (!parsed.isValid()) return null;

    const timePart = value.split("T")[1];
    if (timePart) {
      const [h, min, sec] = timePart
        .split(/[:\s.]/)
        .map((n) => parseInt(n, 10) || 0);
      return parsed.hour(h).minute(min).second(sec);
    }
    return parsed;
  }

  const d = dayjs(value);
  return d.isValid() ? d : null;
}

/**
 * Formata Dayjs para string ISO (com hora quando aplicável)
 */
export function toISOString(d: Dayjs): string {
  return d.toISOString();
}

/**
 * Formata Dayjs para YYYY-MM-DD
 */
export function toDateString(d: Dayjs): string {
  return d.format("YYYY-MM-DD");
}

/**
 * Formata Dayjs para YYYY-MM-DDTHH:mm:ss (datetime local)
 */
export function toDateTimeString(d: Dayjs): string {
  return d.format("YYYY-MM-DDTHH:mm:ss");
}

/**
 * Retorna timezone local do navegador (ex: America/Sao_Paulo)
 */
export function getLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Formata timezone para exibição curta
 */
export function formatTimezoneShort(tz: string): string {
  const parts = tz.split("/");
  return parts[parts.length - 1]?.replace(/_/g, " ") ?? tz;
}

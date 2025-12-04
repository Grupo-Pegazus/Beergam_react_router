/**
 * Mapeia o level_id do Mercado Livre para cores de reputação
 * Níveis: 1 (red) → 2 (orange) → 3 (yellow) → 4 (light_green) → 5 (green)
 */
export function getMeliReputationColor(
  levelId: string | null | undefined
): "red" | "orange" | "yellow" | "light_green" | "green" | "slate" {
  if (!levelId) return "slate";

  const level = parseInt(levelId, 10);
  if (isNaN(level)) return "slate";

  if (level <= 1) return "red";
  if (level === 2) return "orange";
  if (level === 3) return "yellow";
  if (level === 4) return "light_green";
  if (level >= 5) return "green";

  return "slate";
}
export function getColorName(
  color: ReturnType<typeof getMeliReputationColor>
): string {
  const names: Record<typeof color, string> = {
    red: "Vermelho",
    orange: "Laranja",
    yellow: "Amarelo",
    light_green: "Verde Claro",
    green: "Verde",
    slate: "Cinza",
  };
  return names[color];
}

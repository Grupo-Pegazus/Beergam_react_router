import Typography from "@mui/material/Typography";
import { useMemo } from "react";

interface SpeedometerProps {
  value: number | null;
  size?: number;
  className?: string;
  numberToCompare?: number;
  mode?: "asc" | "desc";
}

export default function Speedometer({
  value,
  size = 40,
  className = "",
  numberToCompare = 100,
  mode = "desc",
}: SpeedometerProps) {
  const normalizedValue = useMemo(() => {
    if (value === null || numberToCompare === null || numberToCompare === 0)
      return null;
    return Math.max(0, Math.min(100, (value / numberToCompare) * 100));
  }, [value, numberToCompare]);

  const angle = useMemo(() => {
    if (normalizedValue === null) return 0;
    // Velocímetro vai de -135° (esquerda) a 135° (direita) = 270° total
    // -135° = 0%, 0° = 50%, 135° = 100%
    return -135 + (normalizedValue / 100) * 270;
  }, [normalizedValue]);

  const color = useMemo(() => {
    if (normalizedValue === null) return "var(--color-beergam-gray)"; // slate-400

    if (mode === "asc") {
      // Ascendente: quanto mais próximo do numberToCompare, mais vermelho
      if (normalizedValue >= 80) return "var(--color-beergam-red)"; // red-500
      if (normalizedValue >= 60) return "var(--color-beergam-yellow)"; // yellow-500
      return "var(--color-beergam-primary)"; // green-500
    } else {
      // Decrescente: quanto mais longe do numberToCompare, mais vermelho
      if (normalizedValue >= 80) return "var(--color-beergam-primary)"; // green-500
      if (normalizedValue >= 60) return "var(--color-beergam-yellow)"; // yellow-500
      return "var(--color-beergam-red)"; // red-500
    }
  }, [normalizedValue, mode]);

  const trackColor = useMemo(() => {
    if (normalizedValue === null) return "var(--color-beergam-gray)"; // slate-300

    if (mode === "asc") {
      // Ascendente: quanto mais próximo do numberToCompare, mais vermelho
      if (normalizedValue >= 80)
        return "var(--color-beergam-typography-secondary)"; // red-100
      if (normalizedValue >= 60)
        return "var(--color-beergam-typography-secondary)"; // yellow-100
      return "var(--color-beergam-typography-secondary)"; // green-100
    } else {
      // Decrescente: quanto mais longe do numberToCompare, mais vermelho
      if (normalizedValue >= 80)
        return "var(--color-beergam-typography-secondary)"; // green-100
      if (normalizedValue >= 60)
        return "var(--color-beergam-typography-secondary)"; // yellow-100
      return "var(--color-beergam-typography-secondary)"; // red-100
    }
  }, [normalizedValue, mode]);

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;
  const strokeWidth = size * 0.08;

  // Calcular o ponto final do arco
  const startAngleRad = (-135 * Math.PI) / 180;

  // Garantir que o ângulo final não ultrapasse os limites do velocímetro
  const clampedEndAngle = Math.max(-135, Math.min(135, angle));
  const clampedEndAngleRad = (clampedEndAngle * Math.PI) / 180;

  const startX = centerX + radius * Math.cos(startAngleRad);
  const startY = centerY + radius * Math.sin(startAngleRad);
  const endX = centerX + radius * Math.cos(clampedEndAngleRad);
  const endY = centerY + radius * Math.sin(clampedEndAngleRad);

  // Calcular largeArcFlag baseado na diferença angular real
  // Se a diferença angular for maior que 180°, usar largeArcFlag = 1
  const angleDifference = clampedEndAngle - -135;
  const largeArcFlag =
    normalizedValue !== null && angleDifference > 180 ? 1 : 0;

  const arcPath =
    normalizedValue !== null && normalizedValue > 0
      ? `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`
      : "";

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
      >
        {/* Track (fundo cinza) */}
        <path
          d={`M ${centerX + radius * Math.cos(startAngleRad)} ${centerY + radius * Math.sin(startAngleRad)} A ${radius} ${radius} 0 1 1 ${centerX + radius * Math.cos((135 * Math.PI) / 180)} ${centerY + radius * Math.sin((135 * Math.PI) / 180)}`}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Value arc (arco colorido) */}
        {normalizedValue !== null && arcPath && (
          <path
            d={arcPath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        )}
      </svg>
      {/* Número no centro */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Typography
          variant="caption"
          sx={{
            fontSize: size * 0.25,
            fontWeight: 700,
            color:
              normalizedValue !== null ? color : "var(--color-beergam-gray)",
            lineHeight: 1,
          }}
        >
          {normalizedValue !== null ? value : "—"}
        </Typography>
      </div>
    </div>
  );
}

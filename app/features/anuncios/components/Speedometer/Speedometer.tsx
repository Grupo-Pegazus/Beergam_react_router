import { useMemo } from "react";
import Typography from "@mui/material/Typography";

interface SpeedometerProps {
  value: number | null;
  size?: number;
  className?: string;
}

export default function Speedometer({ value, size = 40, className = "" }: SpeedometerProps) {
  const normalizedValue = useMemo(() => {
    if (value === null) return null;
    return Math.max(0, Math.min(100, value));
  }, [value]);

  const angle = useMemo(() => {
    if (normalizedValue === null) return 0;
    // Velocímetro vai de -135° (esquerda) a 135° (direita) = 270° total
    // -135° = 0%, 0° = 50%, 135° = 100%
    return -135 + (normalizedValue / 100) * 270;
  }, [normalizedValue]);

  const color = useMemo(() => {
    if (normalizedValue === null) return "#94a3b8"; // slate-400
    if (normalizedValue >= 80) return "#22c55e"; // green-500
    if (normalizedValue >= 60) return "#eab308"; // yellow-500
    return "#ef4444"; // red-500
  }, [normalizedValue]);

  const trackColor = useMemo(() => {
    if (normalizedValue === null) return "#cbd5e1"; // slate-300
    if (normalizedValue >= 80) return "#dcfce7"; // green-100
    if (normalizedValue >= 60) return "#fef9c3"; // yellow-100
    return "#fee2e2"; // red-100
  }, [normalizedValue]);

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;
  const strokeWidth = size * 0.08;

  // Calcular o ponto final do arco
  const endAngleRad = (angle * Math.PI) / 180;
  const endX = centerX + radius * Math.cos(endAngleRad);
  const endY = centerY + radius * Math.sin(endAngleRad);

  // Criar o path do arco (semicírculo de -135° a 135°)
  const startAngleRad = (-135 * Math.PI) / 180;
  const largeArcFlag = normalizedValue !== null && normalizedValue > 50 ? 1 : 0;

  const arcPath = normalizedValue !== null
    ? `M ${centerX + radius * Math.cos(startAngleRad)} ${centerY + radius * Math.sin(startAngleRad)} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`
    : "";

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
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
            color: normalizedValue !== null ? color : "#94a3b8",
            lineHeight: 1,
          }}
        >
          {normalizedValue !== null ? Math.round(normalizedValue) : "—"}
        </Typography>
      </div>
    </div>
  );
}


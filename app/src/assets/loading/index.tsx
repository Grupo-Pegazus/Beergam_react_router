interface LoadingProps {
  tailwindClasses?: string;
  color?: string;
  size?: string;
  speed?: number;
}

export default function Loading({
  tailwindClasses = "",
  color = "#183153",
  size = "2.8rem",
  speed = 0.9,
}: LoadingProps) {
  const rotations = [
    "rotate-[0deg]",
    "rotate-[45deg]",
    "rotate-[90deg]",
    "rotate-[135deg]",
    "rotate-[180deg]",
    "rotate-[225deg]",
    "rotate-[270deg]",
    "rotate-[315deg]",
  ];

  const delays = [0, -0.875, -0.75, -0.625, -0.5, -0.375, -0.25, -0.125];

  // Converte hex para rgba para o shadow
  const hexToRgba = (hex: string, alpha: number = 0.3): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const shadowColor = hexToRgba(color, 0.3);
  const animationDuration = `${speed * 1.111}s`;

  return (
    <div
      className={`relative flex items-center justify-start ${tailwindClasses}`}
      style={{
        height: size,
        width: size,
      }}
    >
      {rotations.map((rotationClass, index) => (
        <div
          key={rotationClass}
          className={`absolute inset-0 flex items-center justify-start h-full w-full ${rotationClass}`}
        >
          <div
            className="h-[20%] w-[20%] rounded-full opacity-50 animate-pulse-loading"
            style={{
              backgroundColor: "var(--color-beergam-primary)",
              boxShadow: `0 0 20px ${shadowColor}`,
              animationDelay: `${delays[index] * speed}s`,
              animationDuration: animationDuration,
            }}
          />
        </div>
      ))}
    </div>
  );
}

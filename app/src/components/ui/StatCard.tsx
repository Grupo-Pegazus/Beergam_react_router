import { Paper } from "@mui/material";
import type { PropsWithChildren, ReactNode } from "react";
import { TextCensored } from "../utils/Censorship";
import { type TPREDEFINED_CENSORSHIP_KEYS } from "../utils/Censorship/typings";

type StatVariant = "soft" | "solid";

interface StatCardProps extends PropsWithChildren {
  icon?: ReactNode;
  title: string;
  value?: ReactNode;
  maintainColor?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  variant?: StatVariant;
  censorshipKey?: TPREDEFINED_CENSORSHIP_KEYS;
  color?:
    | "blue"
    | "purple"
    | "emerald"
    | "amber"
    | "rose"
    | "slate"
    | "red"
    | "orange"
    | "yellow"
    | "light_green"
    | "green";
  bgColor?: string;
}

function colorTokens(
  color: NonNullable<StatCardProps["color"]>,
  variant: StatVariant
) {
  // Ajusta cores para header/realce conforme o tema escolhido
  const map = {
    blue: {
      ring: "ring-blue-200",
      softBg: "from-blue-50 to-indigo-50",
      solidBg: "from-blue-500 to-indigo-600",
      solidText: "text-white",
      accentText: "text-blue-700",
      iconBg: "from-blue-100 to-indigo-100",
    },
    purple: {
      ring: "ring-purple-200",
      softBg: "from-purple-50 to-fuchsia-50",
      solidBg: "from-purple-500 to-fuchsia-600",
      solidText: "text-white",
      accentText: "text-purple-700",
      iconBg: "from-purple-100 to-fuchsia-100",
    },
    emerald: {
      ring: "ring-emerald-200",
      softBg: "from-emerald-50 to-teal-50",
      solidBg: "from-emerald-500 to-teal-600",
      solidText: "text-white",
      accentText: "text-emerald-700",
      iconBg: "from-emerald-100 to-teal-100",
    },
    amber: {
      ring: "ring-amber-200",
      softBg: "from-amber-50 to-orange-50",
      solidBg: "from-amber-500 to-orange-600",
      solidText: "text-white",
      accentText: "text-amber-700",
      iconBg: "from-amber-100 to-orange-100",
    },
    rose: {
      ring: "ring-rose-200",
      softBg: "from-rose-50 to-pink-50",
      solidBg: "from-rose-500 to-pink-600",
      solidText: "text-white",
      accentText: "text-rose-700",
      iconBg: "from-rose-100 to-pink-100",
    },
    slate: {
      ring: "ring-slate-200",
      softBg: "from-slate-50 to-gray-50",
      solidBg: "from-slate-700 to-gray-800",
      solidText: "text-white",
      accentText: "text-slate-700",
      iconBg: "from-slate-100 to-gray-100",
    },
    red: {
      ring: "ring-red-200",
      softBg: "from-red-50 to-rose-50",
      solidBg: "from-red-500 to-rose-600",
      solidText: "text-white",
      accentText: "text-red-700",
      iconBg: "from-red-100 to-rose-100",
    },
    orange: {
      ring: "ring-orange-200",
      softBg: "from-orange-50 to-amber-50",
      solidBg: "from-orange-500 to-amber-600",
      solidText: "text-white",
      accentText: "text-orange-700",
      iconBg: "from-orange-100 to-amber-100",
    },
    yellow: {
      ring: "ring-yellow-200",
      softBg: "from-yellow-50 to-amber-50",
      solidBg: "from-yellow-500 to-amber-600",
      solidText: "text-white",
      accentText: "text-yellow-700",
      iconBg: "from-yellow-100 to-amber-100",
    },
    light_green: {
      ring: "ring-green-200",
      softBg: "from-green-50 to-emerald-50",
      solidBg: "from-green-400 to-emerald-500",
      solidText: "text-white",
      accentText: "text-green-700",
      iconBg: "from-green-100 to-emerald-100",
    },
    green: {
      ring: "ring-emerald-200",
      softBg: "from-emerald-50 to-teal-50",
      solidBg: "from-emerald-500 to-teal-600",
      solidText: "text-white",
      accentText: "text-emerald-700",
      iconBg: "from-emerald-100 to-teal-100",
    },
  } as const;

  const t = map[color];
  return {
    ring: t.ring,
    headerBg:
      variant === "solid"
        ? `bg-linear-to-r ${t.solidBg}`
        : `bg-linear-to-r ${t.iconBg}`,
    titleColor: variant === "solid" ? t.solidText : "text-[#475569]",
    valueColor:
      variant === "solid" ? t.solidText : "text-beergam-typography-tertiary",
    cardBg: variant === "solid" ? `bg-linear-to-r ${t.solidBg}` : `bg-white`,
    accentText: t.accentText,
  };
}

export default function StatCard({
  icon,
  title,
  value,
  loading = false,
  className,
  onClick,
  variant = "soft",
  color = "slate",
  maintainColor = false,
  children,
  censorshipKey,
  bgColor = "beergam-mui-paper",
}: StatCardProps) {
  const tokens = colorTokens(color, variant);

  // Mapa de classes de background com -light para o Tailwind detectar
  // IMPORTANTE: Classes completas são necessárias para o Tailwind detectar durante a compilação
  const bgColorLightMap: Record<
    | "blue"
    | "purple"
    | "emerald"
    | "amber"
    | "rose"
    | "slate"
    | "red"
    | "orange"
    | "yellow"
    | "light_green"
    | "green",
    string
  > = {
    blue: "bg-beergam-blue-light",
    purple: "bg-beergam-purple-light",
    red: "bg-beergam-red-light",
    orange: "bg-beergam-orange-light",
    green: "bg-green-50", // Usando cor padrão do Tailwind já que beergam-green-light não existe
    yellow: "bg-yellow-50", // Usando cor padrão do Tailwind já que beergam-yellow-light não existe
    emerald: "bg-emerald-50", // Usando cor padrão do Tailwind
    amber: "bg-amber-50", // Usando cor padrão do Tailwind
    rose: "bg-rose-50", // Usando cor padrão do Tailwind
    slate: "bg-slate-50", // Usando cor padrão do Tailwind
    light_green: "bg-green-50", // Usando cor padrão do Tailwind
  };

  const iconBgColor = maintainColor
    ? bgColorLightMap[color]
    : "bg-beergam-primary!";

  return (
    <Paper
      role={onClick ? "button" : undefined}
      onClick={onClick}
      className={[
        "group relative flex flex-col justify-between h-full",
        "p-3 md:p-4 lg:p-5",
        "hover:-translate-y-px",
        "ring-1 ring-transparent hover:" + tokens.ring,
        `bg-${bgColor}`,
        onClick ? "cursor-pointer" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          {icon ? (
            <div
              className={[
                "w-9 h-9 md:w-11 md:h-11 rounded-xl text-beergam-white! grid place-items-center shadow-inner shrink-0",
                iconBgColor,
                // tokens.headerBg,
              ].join(" ")}
            >
              {icon}
            </div>
          ) : null}
          <span
            className={[
              "text-xs md:text-sm font-medium truncate text-beergam-typography-secondary",
              tokens.titleColor,
            ].join(" ")}
          >
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {censorshipKey ? (
            <TextCensored
              className={[
                "text-lg! md:text-xl! lg:text-2xl! font-extrabold! shrink-0",
                tokens.valueColor,
              ].join(" ")}
              censorshipKey={censorshipKey}
            >
              {loading ? "—" : value}
            </TextCensored>
          ) : (
            <div
              className={[
                "text-lg md:text-xl lg:text-2xl font-extrabold shrink-0",
                tokens.valueColor,
              ].join(" ")}
            >
              {loading ? "—" : value}
            </div>
          )}
        </div>
      </div>
      {children ? (
        <div
          className={["mt-3", variant === "solid" ? "opacity-90" : ""].join(
            " "
          )}
        >
          {children}
        </div>
      ) : null}
      {variant === "soft" ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-black/5 to-transparent rounded-b-2xl" />
      ) : null}
    </Paper>
  );
}

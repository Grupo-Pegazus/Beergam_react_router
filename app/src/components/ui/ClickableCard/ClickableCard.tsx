import { Link } from "react-router";
import Typography from "@mui/material/Typography";
import Svg from "~/src/assets/svgs/_index";

export interface ClickableCardProps {
  /** Título do card */
  title: string;
  /** Descrição do card */
  description: string;
  /** Ícone a ser exibido (chave do objeto Svg) */
  icon: keyof typeof Svg;
  /** Cor principal do card (classe Tailwind) */
  mainColor: "beergam-orange" | "beergam-blue-primary" | "beergam-green" | "beergam-red" | "beergam-gray";
  /** Link de destino */
  to: string;
  /** Classe CSS adicional */
  className?: string;
}

const colorClasses = {
  "beergam-orange": {
    border: "hover:border-beergam-orange",
    iconBg: "bg-beergam-orange/10 group-hover:bg-beergam-orange/20",
    iconColor: "text-beergam-orange",
    chevronColor: "group-hover:text-beergam-orange",
  },
  "beergam-blue-primary": {
    border: "hover:border-beergam-blue-primary",
    iconBg: "bg-beergam-blue-primary/10 group-hover:bg-beergam-blue-primary/20",
    iconColor: "text-beergam-blue-primary",
    chevronColor: "group-hover:text-beergam-blue-primary",
  },
  "beergam-green": {
    border: "hover:border-beergam-green",
    iconBg: "bg-beergam-green/10 group-hover:bg-beergam-green/20",
    iconColor: "text-beergam-green",
    chevronColor: "group-hover:text-beergam-green",
  },
  "beergam-red": {
    border: "hover:border-beergam-red",
    iconBg: "bg-beergam-red/10 group-hover:bg-beergam-red/20",
    iconColor: "text-beergam-red",
    chevronColor: "group-hover:text-beergam-red",
  },
  "beergam-gray": {
    border: "hover:border-beergam-gray",
    iconBg: "bg-beergam-gray/10 group-hover:bg-beergam-gray/20",
    iconColor: "text-beergam-gray",
    chevronColor: "group-hover:text-beergam-gray",
  },
};

export default function ClickableCard({
  title,
  description,
  icon,
  mainColor,
  to,
  className = "",
}: ClickableCardProps) {
  const IconComponent = Svg[icon];
  const colors = colorClasses[mainColor];

  return (
    <Link
      to={to}
      className={`group relative flex flex-col p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 border-slate-200 bg-linear-to-br from-white to-slate-50 ${colors.border} hover:shadow-lg transition-all duration-200 ${className}`}
    >
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className={`p-2 sm:p-2.5 md:p-3 rounded-lg ${colors.iconBg} transition-colors`}>
          <IconComponent tailWindClasses={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 ${colors.iconColor}`} />
        </div>
        <Svg.chevron
          tailWindClasses={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 ${colors.chevronColor} group-hover:translate-x-1 transition-all shrink-0`}
        />
      </div>
      <Typography variant="h6" fontWeight={600} className="text-slate-900 mb-1 text-sm sm:text-base md:text-lg">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" className="text-xs sm:text-sm leading-tight sm:leading-normal">
        {description}
      </Typography>
    </Link>
  );
}


import { Paper } from "@mui/material";
import {
  ColabLevel,
  FormatColabLevel,
} from "~/features/user/typings/Colab";

type ColabLevelBadgeProps = {
  level: ColabLevel;
  className?: string;
};

export default function ColabLevelBadge({
  level,
  className = "!w-fit",
}: ColabLevelBadgeProps) {
  const isAdmin =
    ColabLevel[level as unknown as keyof typeof ColabLevel] === ColabLevel.ADMIN;

  return (
    <Paper
      className={`flex items-center gap-2 !p-2 rounded-2xl ${className}`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          isAdmin ? "bg-beergam-orange" : "bg-beergam-blue-primary"
        }`}
      ></div>
      <p className="text-xs">{FormatColabLevel(level)}</p>
    </Paper>
  );
}


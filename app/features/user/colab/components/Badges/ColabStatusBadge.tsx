import { Paper } from "@mui/material";
import { FormatUserStatus, UserStatus } from "~/features/user/typings/BaseUser";

type ColabStatusBadgeProps = {
  status: UserStatus;
  className?: string;
};

export default function ColabStatusBadge({
  status,
  className = "!w-fit",
}: ColabStatusBadgeProps) {
  const isActive =
    UserStatus[status as unknown as keyof typeof UserStatus] ===
    UserStatus.ACTIVE;

  return (
    <Paper
      className={`flex items-center gap-2 !p-2 rounded-2xl ${className}`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          isActive ? "bg-beergam-orange" : "bg-beergam-gray"
        }`}
      ></div>
      <p className="text-xs">{FormatUserStatus(status)}</p>
    </Paper>
  );
}


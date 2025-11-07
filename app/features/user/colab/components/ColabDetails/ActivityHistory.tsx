import { Paper } from "@mui/material";

export type ActivityItem = {
  id: string | number;
  timestamp: Date | string;
  title: string;
  description?: string;
  status?: "success" | "warning" | "danger" | "info";
};

function formatDateTime(value: Date | string): string {
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return "--:--";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month} ${hours}:${minutes}`;
}

export default function ActivityHistory({
  items,
  title = "Histórico",
}: {
  items: ActivityItem[];
  title?: string;
}) {
  return (
    <Paper className="flex flex-col gap-3 border-1 border-beergam-gray-light rounded-md p-4 h-full max-h-full overflow-auto">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{title}</span>
      </div>

      <div className="flex flex-col gap-2">
        {items.length === 0 && (
          <p className="text-sm opacity-70">Sem atividade registrada.</p>
        )}
        {items.map((item) => {
          const color =
            item.status === "success"
              ? "bg-green-500"
              : item.status === "warning"
                ? "bg-yellow-500"
                : item.status === "danger"
                  ? "bg-red-500"
                  : "bg-beergam-blue-primary";
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 border border-beergam-gray-light rounded-md px-3 py-2"
            >
              <span
                className={`inline-block w-2 h-2 rounded-full mt-2 ${color}`}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="text-xs opacity-70">
                    {formatDateTime(item.timestamp)}
                  </span>
                </div>
                {item.description && (
                  <p className="text-xs opacity-80 mt-0.5">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Paper>
  );
}

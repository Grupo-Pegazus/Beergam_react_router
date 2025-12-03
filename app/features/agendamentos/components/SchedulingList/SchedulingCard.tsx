import { Chip, Typography } from "@mui/material";
import MainCards from "~/src/components/ui/MainCards";
import CopyButton from "~/src/components/ui/CopyButton";
import type { SchedulingList } from "../../typings";
import {
  formatDateTime,
  formatSchedulingStatus,
  formatSchedulingType,
  getStatusColor,
} from "../../utils";
import Svg from "~/src/assets/svgs/_index";

interface SchedulingCardProps {
  scheduling: SchedulingList;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onCancel?: (id: string) => void;
  onReceive?: (id: string) => void;
}

export default function SchedulingCard({
  scheduling,
  onView,
  onEdit,
  onCancel,
  onReceive,
}: SchedulingCardProps) {
  const statusColor = getStatusColor(scheduling.status);

  return (
    <MainCards className="p-3 md:p-4 w-full min-w-0">
      <div className="flex flex-col gap-3 w-full min-w-0">
        {/* Header: ID e Data */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
            <div className="flex items-center gap-1">
              <Typography variant="caption" color="text.secondary" className="font-mono text-xs md:text-sm">
                #{scheduling.id.slice(0, 8)}
              </Typography>
              <CopyButton
                textToCopy={scheduling.id}
                successMessage="ID do agendamento copiado"
                ariaLabel="Copiar ID do agendamento"
              />
            </div>
            <span className="text-slate-300 hidden md:inline">|</span>
            <Typography variant="caption" color="text.secondary" className="text-xs md:text-sm">
              {formatDateTime(scheduling.created_at)}
            </Typography>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip
              label={formatSchedulingType(scheduling.type)}
              size="small"
              sx={{
                height: 22,
                fontSize: "0.65rem",
                fontWeight: 600,
                backgroundColor: scheduling.type === "ENTRY" ? "#e0f2fe" : "#fef3c7",
                color: scheduling.type === "ENTRY" ? "#0369a1" : "#92400e",
                "& .MuiChip-label": {
                  px: 0.75,
                },
              }}
            />
            <Chip
              label={formatSchedulingStatus(scheduling.status)}
              size="small"
              sx={{
                height: 22,
                fontSize: "0.65rem",
                fontWeight: 600,
                backgroundColor:
                  statusColor === "warning"
                    ? "#fef3c7"
                    : statusColor === "success"
                      ? "#d1fae5"
                      : "#fee2e2",
                color:
                  statusColor === "warning"
                    ? "#92400e"
                    : statusColor === "success"
                      ? "#065f46"
                      : "#991b1b",
                "& .MuiChip-label": {
                  px: 0.75,
                },
              }}
            />
          </div>
        </div>

        {/* Título */}
        <div>
          <Typography variant="body1" fontWeight={600} className="text-slate-900 text-sm md:text-base">
            {scheduling.title}
          </Typography>
        </div>

        {/* Informações */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Svg.clock tailWindClasses="h-4 w-4 text-slate-500" />
            <Typography variant="caption" color="text.secondary" className="text-xs md:text-sm">
              Data prevista: {formatDateTime(scheduling.estimated_arrival_date)}
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            <Svg.box tailWindClasses="h-4 w-4 text-slate-500" />
            <Typography variant="caption" color="text.secondary" className="text-xs md:text-sm">
              {scheduling.items_count} {scheduling.items_count === 1 ? "item" : "itens"}
            </Typography>
          </div>
          {scheduling.observation && (
            <div className="flex items-start gap-2">
              <Svg.information_circle tailWindClasses="h-4 w-4 text-slate-500 mt-0.5" />
              <Typography variant="caption" color="text.secondary" className="text-xs md:text-sm line-clamp-2">
                {scheduling.observation}
              </Typography>
            </div>
          )}
        </div>

        {/* Botões de ação */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
          {onView && (
            <button
              onClick={() => onView(scheduling.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-beergam-blue-primary hover:bg-beergam-blue-primary/90 text-white text-sm font-medium transition-colors min-w-[120px]"
            >
              <Svg.eye width={18} height={18} />
              <span>Visualizar</span>
            </button>
          )}
          {scheduling.status === "PENDING" && onEdit && (
            <button
              onClick={() => onEdit(scheduling.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-beergam-orange hover:bg-beergam-orange/90 text-white text-sm font-medium transition-colors min-w-[120px]"
            >
              <Svg.pencil width={18} height={18} />
              <span>Editar</span>
            </button>
          )}
          {scheduling.status !== "CANCELLED" && onCancel && (
            <button
              onClick={() => onCancel(scheduling.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors min-w-[120px]"
            >
              <Svg.circle_x width={18} height={18} />
              <span>Cancelar</span>
            </button>
          )}
          {scheduling.status === "PENDING" && onReceive && (
            <button
              onClick={() => onReceive(scheduling.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors min-w-[120px]"
            >
              <Svg.check width={18} height={18} />
              <span>Dar Baixa</span>
            </button>
          )}
        </div>
      </div>
    </MainCards>
  );
}


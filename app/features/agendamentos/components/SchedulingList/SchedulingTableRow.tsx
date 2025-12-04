import { TableRow, TableCell, Chip, IconButton, Menu, MenuItem } from "@mui/material";
import CopyButton from "~/src/components/ui/CopyButton";
import type { SchedulingList } from "../../typings";
import {
  formatDateTime,
  formatSchedulingStatus,
  formatSchedulingType,
  getStatusColor,
} from "../../utils";
import Svg from "~/src/assets/svgs/_index";
import { useState } from "react";

interface SchedulingTableRowProps {
  scheduling: SchedulingList;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onCancel?: (id: string) => void;
  onReceive?: (id: string) => void;
}

export default function SchedulingTableRow({
  scheduling,
  onView,
  onEdit,
  onCancel,
  onReceive,
}: SchedulingTableRowProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const statusColor = getStatusColor(scheduling.status);
  const canEdit = scheduling.status === "PENDING";
  const canCancel = scheduling.status !== "CANCELLED";
  const canReceive = scheduling.status === "PENDING";

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: "view" | "edit" | "cancel" | "receive") => {
    handleMenuClose();
    switch (action) {
      case "view":
        onView?.(scheduling.id);
        break;
      case "edit":
        onEdit?.(scheduling.id);
        break;
      case "cancel":
        onCancel?.(scheduling.id);
        break;
      case "receive":
        onReceive?.(scheduling.id);
        break;
    }
  };

  return (
    <>
      <TableRow
        className="hover:bg-slate-50/50 transition-colors cursor-pointer"
        onClick={() => onView?.(scheduling.id)}
      >
        <TableCell>
          <div className="flex items-center gap-1">
            <span className="font-mono text-xs text-slate-600">
              #{scheduling.id.slice(0, 8)}
            </span>
            <CopyButton
              textToCopy={scheduling.id}
              successMessage="ID do agendamento copiado"
              ariaLabel="Copiar ID do agendamento"
            />
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-slate-900 text-sm">
              {scheduling.title}
            </span>
            {scheduling.observation && (
              <span className="text-xs text-slate-500 line-clamp-1">
                {scheduling.observation}
              </span>
            )}
          </div>
        </TableCell>
        <TableCell align="center">
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
        </TableCell>
        <TableCell align="center">
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
        </TableCell>
        <TableCell 
          align="left" 
          sx={{ 
            display: { xs: "none", lg: "table-cell" },
          }}
        >
          <span className="text-sm text-slate-600">
            {formatDateTime(scheduling.estimated_arrival_date)}
          </span>
        </TableCell>
        <TableCell align="center">
          <span className="text-sm text-slate-600">
            {scheduling.items_count}
          </span>
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()} align="center">
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              color: "var(--color-beergam-black)",
              width: 45,
              height: 45,
              padding: "10px",
            }}
          >
            <Svg.elipsis_horizontal tailWindClasses="w-8 h-8" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        {onView && (
          <MenuItem onClick={() => handleAction("view")}>
            <Svg.eye tailWindClasses="w-4 h-4 mr-2" />
            Visualizar
          </MenuItem>
        )}
        {canEdit && onEdit && (
          <MenuItem onClick={() => handleAction("edit")}>
            <Svg.pencil tailWindClasses="w-4 h-4 mr-2" />
            Editar
          </MenuItem>
        )}
        {canReceive && onReceive && (
          <MenuItem onClick={() => handleAction("receive")}>
            <Svg.check tailWindClasses="w-4 h-4 mr-2" />
            Dar Baixa
          </MenuItem>
        )}
        {canCancel && onCancel && (
          <MenuItem onClick={() => handleAction("cancel")} sx={{ color: "error.main" }}>
            <Svg.circle_x tailWindClasses="w-4 h-4 mr-2" />
            Cancelar
          </MenuItem>
        )}
      </Menu>
    </>
  );
}


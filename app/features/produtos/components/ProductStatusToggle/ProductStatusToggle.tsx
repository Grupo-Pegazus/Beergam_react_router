import { Chip, Switch, Typography } from "@mui/material";

interface ProductStatusToggleProps {
  status: string;
  isActive: boolean;
  isMutating: boolean;
  onToggle: () => void;
}

/**
 * Componente reutilizável para controle de status de produto
 * Exibe switch de toggle entre Ativo e Inativo
 */
export default function ProductStatusToggle({
  status,
  isActive,
  isMutating,
  onToggle,
}: ProductStatusToggleProps) {
  // Sempre mostra o switch para permitir alternar entre Ativo e Inativo
  return (
    <div className="flex items-center gap-2">
      <Typography
        variant="caption"
        color={isActive ? "text.secondary" : "text.disabled"}
        sx={{ fontSize: "0.7rem" }}
      >
        Inativo
      </Typography>
      <div className="relative">
        <Switch
          checked={isActive}
          onChange={onToggle}
          disabled={isMutating}
          sx={{
            "& .MuiSwitch-thumb": {
              boxShadow: "0px 1px 2px rgba(15, 23, 42, 0.25)",
            },
          }}
        />
        {isMutating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        )}
      </div>
      <Typography
        variant="caption"
        color={isActive ? "text.primary" : "text.disabled"}
        sx={{ fontSize: "0.7rem", fontWeight: 600 }}
      >
        Ativo
      </Typography>
    </div>
  );
}


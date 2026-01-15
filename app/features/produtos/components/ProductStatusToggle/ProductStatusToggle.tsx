import { Switch } from "@mui/material";

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
  isActive,
  isMutating,
  onToggle,
}: ProductStatusToggleProps) {
  return (
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
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-beergam-blue-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}

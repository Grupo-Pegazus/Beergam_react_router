import { Stack } from "@mui/material";
import BeergamButton from "~/src/components/utils/BeergamButton";

export interface FilterActionsProps {
  onReset?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  resetLabel?: string;
  submitLabel?: string;
  submittingLabel?: string;
}

/**
 * Componente de ações dos filtros (botões de reset e submit)
 */
export function FilterActions({
  onReset,
  onSubmit,
  isSubmitting = false,
  resetLabel = "Limpar filtros",
  submitLabel = "Pesquisar",
  submittingLabel = "Buscando...",
}: FilterActionsProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      justifyContent="flex-end"
    >
      {onReset && (
        <BeergamButton
          title={resetLabel}
          mainColor="beergam-red"
          animationStyle="slider"
          onClick={onReset}
          className="rounded-full px-3"
        />
      )}
      {onSubmit && (
        <BeergamButton
          title={isSubmitting ? submittingLabel : submitLabel}
          mainColor="beergam-green"
          animationStyle="slider"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="rounded-full px-4"
        />
      )}
    </Stack>
  );
}


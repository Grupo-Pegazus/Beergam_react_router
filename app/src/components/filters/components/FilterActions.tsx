import { Button, Stack } from "@mui/material";

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
        <Button
          variant="outlined"
          color="error"
          onClick={onReset}
          sx={{
            borderRadius: 999,
            px: 3,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {resetLabel}
        </Button>
      )}
      {onSubmit && (
        <Button
          variant="contained"
          color="success"
          onClick={onSubmit}
          disabled={isSubmitting}
          sx={{
            borderRadius: 999,
            px: 4,
            textTransform: "none",
            fontWeight: 700,
            boxShadow: "0 10px 25px -12px rgba(34,197,94,0.65)",
          }}
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      )}
    </Stack>
  );
}


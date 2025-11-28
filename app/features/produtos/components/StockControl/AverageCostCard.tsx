import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import type { StockTrackingResponse } from "../../typings";
import { useRecalculateAverageCost } from "../../hooks";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import Svg from "~/src/assets/svgs/_index";

interface AverageCostCardProps {
  data: StockTrackingResponse;
  productId: string;
}

export default function AverageCostCard({
  data,
  productId,
}: AverageCostCardProps) {
  const { average_cost } = data;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const recalculateMutation = useRecalculateAverageCost();

  const handleRecalculate = () => {
    setConfirmOpen(true);
  };

  const handleConfirmRecalculate = () => {
    recalculateMutation.mutate(productId, {
      onSuccess: () => {
        setConfirmOpen(false);
      },
    });
  };

  const isSynced = average_cost.is_synced;
  const calculated = parseFloat(average_cost.calculated || "0");
  const stored = parseFloat(average_cost.stored || "0");

  return (
    <>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Custo Médio de Estoque
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={handleRecalculate}
              disabled={recalculateMutation.isPending}
              startIcon={
                recalculateMutation.isPending ? (
                  <CircularProgress size={16} />
                ) : (
                  <Svg.arrow_path tailWindClasses="h-4 w-4" />
                )
              }
            >
              Recalcular
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                bgcolor: "grey.50",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Custo Médio Armazenado:
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {formatCurrency(average_cost.stored || "0.00")}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                bgcolor: "grey.50",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Custo Médio Calculado:
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {formatCurrency(average_cost.calculated || "0.00")}
              </Typography>
            </Box>

            {!isSynced && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                Os valores não estão sincronizados. Considere recalcular o custo
                médio.
              </Alert>
            )}

            {isSynced && (
              <Alert severity="success" sx={{ mt: 1 }}>
                Os valores estão sincronizados.
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmar Recálculo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja recalcular o custo médio de estoque? Esta
            ação irá atualizar o valor armazenado com base em todas as
            movimentações de entrada registradas.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleConfirmRecalculate}
            variant="contained"
            disabled={recalculateMutation.isPending}
          >
            {recalculateMutation.isPending ? "Recalculando..." : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}


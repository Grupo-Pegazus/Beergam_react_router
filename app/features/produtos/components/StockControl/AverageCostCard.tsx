import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Alert as MuiAlert,
} from "@mui/material";
import type { StockTrackingResponse } from "../../typings";
import { useRecalculateAverageCost } from "../../hooks";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import BeergamButton from "~/src/components/utils/BeergamButton";
import Alert from "~/src/components/utils/Alert";

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
            <BeergamButton
              title="Recalcular"
              mainColor="beergam-blue-primary"
              animationStyle="fade"
              onClick={handleRecalculate}
              disabled={recalculateMutation.isPending}
              className="text-sm"
            />
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
              <MuiAlert severity="warning" sx={{ mt: 1 }}>
                Os valores não estão sincronizados. Considere recalcular o custo
                médio.
              </MuiAlert>
            )}

            {isSynced && (
              <MuiAlert severity="success" sx={{ mt: 1 }}>
                Os valores estão sincronizados.
              </MuiAlert>
            )}
          </Box>
        </CardContent>
      </Card>

      <Alert
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirmar Recálculo"
        type="warning"
        onConfirm={handleConfirmRecalculate}
        confirmText={recalculateMutation.isPending ? "Recalculando..." : "Confirmar"}
        cancelText="Cancelar"
      >
        <p>
          Tem certeza que deseja recalcular o custo médio de estoque? Esta
          ação irá atualizar o valor armazenado com base em todas as
          movimentações de entrada registradas.
        </p>
      </Alert>
    </>
  );
}


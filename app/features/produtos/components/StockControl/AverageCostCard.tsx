import {
  Box,
  Card,
  CardContent,
  Alert as MuiAlert,
  Paper,
  Typography,
} from "@mui/material";
import Alert from "~/src/components/utils/Alert";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { useModal } from "~/src/components/utils/Modal/useModal";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import { useRecalculateAverageCost } from "../../hooks";
import type { StockTrackingResponse } from "../../typings";

interface AverageCostCardProps {
  data: StockTrackingResponse;
  productId: string;
}

export default function AverageCostCard({
  data,
  productId,
}: AverageCostCardProps) {
  const { average_cost } = data;
  const recalculateMutation = useRecalculateAverageCost();
  const { openModal, closeModal } = useModal();

  const handleRecalculate = () => {
    openModal(
      <Alert
        type="warning"
        confirmText={
          recalculateMutation.isPending ? "Recalculando..." : "Confirmar"
        }
        cancelText="Cancelar"
        onClose={closeModal}
        mutation={recalculateMutation}
        onConfirm={() => {
          recalculateMutation.mutate(productId, {
            onSuccess: () => {
              closeModal();
            },
          });
        }}
      >
        <p>
          Tem certeza que deseja recalcular o custo médio de estoque? Esta ação
          irá atualizar o valor armazenado com base em todas as movimentações de
          entrada registradas.
        </p>
      </Alert>,
      {
        title: "Confirmar Recálculo",
      }
    );
  };

  const isSynced = average_cost.is_synced;

  return (
    <>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              gap: { xs: 2, sm: 0 },
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              className="text-base sm:text-lg text-beergam-typography-primary"
            >
              Custo Médio de Estoque
            </Typography>
            <BeergamButton
              title="Recalcular"
              animationStyle="fade"
              onClick={handleRecalculate}
              disabled={recalculateMutation.isPending}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Paper
              className="bg-beergam-section-background! flex justify-between items-center"
              sx={
                {
                  // display: "flex",
                  // flexDirection: { xs: "column", sm: "row" },
                  // justifyContent: "space-between",
                  // alignItems: { xs: "flex-start", sm: "center" },
                  // gap: { xs: 1, sm: 0 },
                  // p: { xs: 1.5, sm: 2 },
                  // bgcolor: "var(--color-beergam-section-background)",
                  // borderRadius: 1,
                }
              }
            >
              <Typography
                variant="body2"
                color="text.secondary"
                className="text-xs sm:text-sm text-beergam-typography-secondary!"
              >
                Custo Médio Armazenado:
              </Typography>
              <Typography
                variant="h6"
                fontWeight={600}
                className="text-sm sm:text-base md:text-lg"
              >
                {formatCurrency(average_cost.stored || "0.00")}
              </Typography>
            </Paper>

            <Paper className="bg-beergam-section-background! flex justify-between items-center">
              <Typography variant="body2" className="text-xs sm:text-sm">
                Custo Médio Calculado:
              </Typography>
              <Typography
                variant="h6"
                fontWeight={600}
                className="text-sm sm:text-base md:text-lg"
              >
                {formatCurrency(average_cost.calculated || "0.00")}
              </Typography>
            </Paper>

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
    </>
  );
}

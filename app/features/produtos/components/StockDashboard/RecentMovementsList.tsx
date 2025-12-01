import type { StockDashboardResponse } from "../../typings";
import StockMovementsTable, { type StockMovementEntry } from "../StockControl/StockMovementsTable";

interface RecentMovementsListProps {
  movements: StockDashboardResponse["recent_movements"];
}

export default function RecentMovementsList({
  movements,
}: RecentMovementsListProps) {
  // Converter movimentações recentes para StockMovementEntry
  const movementsData: StockMovementEntry[] = movements.map((movement) => ({
    id: movement.id,
    quantity: movement.quantity,
    modification_type: movement.modification_type,
    reason: movement.reason,
    unity_cost: movement.unity_cost,
    total_value: movement.total_value,
    description: movement.description,
    created_at: movement.created_at,
    product: movement.product,
    variation: movement.variation,
  }));

  return (
    <StockMovementsTable
      movements={movementsData}
      showProductColumn={true}
      emptyMessage="Nenhuma movimentação recente encontrada."
    />
  );
}


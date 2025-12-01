import type { StockTrackingResponse } from "../../typings";
import StockMovementsTable, { type StockMovementEntry } from "./StockMovementsTable";

interface StockTrackingTableProps {
  data: StockTrackingResponse;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  hasVariations?: boolean;
}

export default function StockTrackingTable({
  data,
  onPageChange,
  onPageSizeChange,
  hasVariations = false,
}: StockTrackingTableProps) {
  const { stock_tracking } = data;

  // Converter StockTrackingEntry para StockMovementEntry
  const movements: StockMovementEntry[] = stock_tracking.items.map((entry) => ({
    id: entry.id,
    quantity: entry.quantity,
    modification_type: entry.modification_type,
    reason: entry.reason,
    unity_cost: entry.unity_cost,
    total_value: entry.total_value,
    description: entry.description,
    created_at: entry.created_at,
    meta: entry.meta,
  }));

  return (
    <StockMovementsTable
      movements={movements}
      pagination={{
        total: stock_tracking.total,
        page: stock_tracking.page,
        page_size: stock_tracking.page_size,
        onPageChange,
        onPageSizeChange,
      }}
      showVariationColumn={hasVariations}
      emptyMessage="Nenhuma movimentação registrada ainda."
    />
  );
}

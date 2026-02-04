import type { StockTrackingResponse } from "../../typings";
import StockMovementsTable, { type StockMovementEntry } from "./StockMovementsTable";

interface StockTrackingTableProps {
  data: StockTrackingResponse;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  hasVariations?: boolean;
  variations?: Array<{ product_variation_id: string; title: string; sku: string | null }>;
  /** Quando true, a página é lida/escrita na URL (`?page=N`). @default false */
  syncPageWithUrl?: boolean;
}

export default function StockTrackingTable({
  data,
  onPageChange,
  onPageSizeChange,
  hasVariations = false,
  variations = [],
  syncPageWithUrl = false,
}: StockTrackingTableProps) {
  const { stock_tracking, product_info } = data;

  // Converter StockTrackingEntry para StockMovementEntry
  const movements: StockMovementEntry[] = stock_tracking.items.map((entry) => {
    const baseMovement: StockMovementEntry = {
      id: entry.id,
      quantity: entry.quantity,
      modification_type: entry.modification_type,
      reason: entry.reason,
      unity_cost: entry.unity_cost,
      total_value: entry.total_value,
      description: entry.description,
      created_at: entry.created_at,
      meta: entry.meta,
    };

    // Se há variação na meta, buscar informações da variação
    // A meta pode ter product_variation_id ou variation_id
    const meta = entry.meta as { product_variation_id?: string | number | null; variation_id?: string | null; sku?: string | null; variation_sku?: string | null } | null;
    const variationIdFromMeta = meta?.product_variation_id 
      ? String(meta.product_variation_id)
      : meta?.variation_id 
        ? String(meta.variation_id)
        : null;

    if (variationIdFromMeta && hasVariations) {
      const variation = variations.find(
        (v) => String(v.product_variation_id) === variationIdFromMeta
      );
      
      if (variation) {
        baseMovement.variation = {
          variation_id: variation.product_variation_id,
          product_id: product_info.product_id,
          title: variation.title,
          sku: variation.sku || meta?.sku || meta?.variation_sku || null,
        };
      } else {
        // Se a variação não foi encontrada na lista, mas existe na meta, criar objeto básico
        baseMovement.variation = {
          variation_id: variationIdFromMeta,
          product_id: product_info.product_id,
          title: `Variação ${variationIdFromMeta}`,
          sku: meta?.sku || meta?.variation_sku || null,
        };
      }
    }

    // Se não há variação ou a variação não foi encontrada, usar informações do produto
    if (!baseMovement.variation) {
      baseMovement.product = {
        product_id: product_info.product_id,
        title: product_info.title,
        sku: product_info.sku,
      };
    }

    return baseMovement;
  });

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
      showVariationColumn={false}
      showProductColumn={true}
      emptyMessage="Nenhuma movimentação registrada ainda."
      syncPageWithUrl={syncPageWithUrl}
    />
  );
}

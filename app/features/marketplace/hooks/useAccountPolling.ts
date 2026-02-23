import { useMemo } from "react";
import type { BaseMarketPlace } from "../typings";
import { MarketplaceStatusParse } from "../typings";
import { useImportProgressMap } from "./useImportProgress";
import type { ImportProgress } from "../typings";

/**
 * Hook que faz polling de contas em processamento usando o endpoint import_progress.
 * Retorna um Map com o progresso de cada conta em PROCESSING.
 */
export function useAccountPolling(
  accounts: BaseMarketPlace[]
): Map<string, ImportProgress | null> {
  const processingIds = useMemo(
    () =>
      accounts
        .filter((acc) => acc.status_parse === MarketplaceStatusParse.PROCESSING)
        .map((acc) => acc.marketplace_shop_id),
    [accounts]
  );

  return useImportProgressMap(processingIds);
}

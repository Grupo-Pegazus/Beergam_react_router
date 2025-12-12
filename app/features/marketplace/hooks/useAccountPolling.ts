import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { marketplaceService } from "../service";
import { MarketplaceStatusParse, type BaseMarketPlace } from "../typings";

const POLLING_INTERVAL = 5000;

/**
 * Hook que faz polling de contas em processamento
 */
export function useAccountPolling(accounts: BaseMarketPlace[]) {
  const queryClient = useQueryClient();
  const pollingIntervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    const processingAccounts = accounts.filter(
      (account) => account.status_parse === MarketplaceStatusParse.PROCESSING
    );

    // Limpa intervalos de contas que não estão mais em processamento
    pollingIntervalsRef.current.forEach((interval, accountId) => {
      const accountStillProcessing = processingAccounts.some(
        (acc) => acc.marketplace_shop_id === accountId
      );
      if (!accountStillProcessing) {
        clearInterval(interval);
        pollingIntervalsRef.current.delete(accountId);
      }
    });

    // Cria intervalos para novas contas em processamento
    processingAccounts.forEach((account) => {
      const accountId = account.marketplace_shop_id;

      // Se já existe um intervalo para esta conta, não cria outro
      if (pollingIntervalsRef.current.has(accountId)) {
        return;
      }

      const interval = setInterval(async () => {
        try {
          const response =
            await marketplaceService.checkAccountProcessingStatus(accountId);

          if (response.success && response.data.processed) {
            // Conta foi processada, invalida a query para atualizar a lista
            queryClient.invalidateQueries({
              queryKey: ["marketplacesAccounts"],
            });
            // Limpa o intervalo desta conta
            clearInterval(interval);
            pollingIntervalsRef.current.delete(accountId);
          }
        } catch (error) {
          console.error(
            `Erro ao verificar status da conta ${accountId}:`,
            error
          );
        }
      }, POLLING_INTERVAL);

      pollingIntervalsRef.current.set(accountId, interval);
    });

    // Cleanup: limpa todos os intervalos quando o componente desmonta ou accounts muda
    return () => {
      pollingIntervalsRef.current.forEach((interval) => {
        clearInterval(interval);
      });
      pollingIntervalsRef.current.clear();
    };
  }, [accounts, queryClient]);
}

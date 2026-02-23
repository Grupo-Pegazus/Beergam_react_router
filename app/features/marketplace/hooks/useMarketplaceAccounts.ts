import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ImportProgress } from "~/features/marketplace/typings";
import { marketplaceService } from "~/features/marketplace/service";
import type { BaseMarketPlace } from "~/features/marketplace/typings";
import authStore from "~/features/store-zustand";
import toast from "~/src/utils/toast";
import { useAccountPolling } from "./useAccountPolling";

export function useMarketplaceAccounts() {
  const queryClient = useQueryClient();
  const current = authStore.use.marketplace();
  const { data, isLoading, error } = useQuery({
    queryKey: ["marketplacesAccounts"],
    queryFn: () => marketplaceService.getMarketplacesAccounts(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const select = useMutation({
    mutationFn: async (acc: BaseMarketPlace) => {
      const res = await marketplaceService.SelectMarketplaceAccount(
        acc.marketplace_shop_id,
        acc.marketplace_type
      );
      return res;
    },
    onSuccess: async (res) => {
      if (res.success) {
        authStore.setState({ marketplace: res.data });

        await queryClient.invalidateQueries();

        await queryClient.refetchQueries();

        toast.success("Conta selecionada");
      } else {
        toast.error(res.message);
      }
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Erro ao selecionar conta";
      toast.error(message);
    },
  });

  const accounts: BaseMarketPlace[] = Array.isArray(data?.data)
    ? (data.data as BaseMarketPlace[])
    : [];

  const progressMap: Map<string, ImportProgress | null> =
    useAccountPolling(accounts);

  return {
    current,
    accounts,
    isLoading,
    error,
    progressMap,
    selectAccount: (acc: BaseMarketPlace) => select.mutate(acc),
    selectAccountAsync: (acc: BaseMarketPlace) => select.mutateAsync(acc),
    isSelecting: select.isPending,
  } as const;
}

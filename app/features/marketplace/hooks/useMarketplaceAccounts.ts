import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { marketplaceService } from "~/features/marketplace/service";
import type { BaseMarketPlace } from "~/features/marketplace/typings";
import authStore from "~/features/store-zustand";
import toast from "~/src/utils/toast";

export function useMarketplaceAccounts() {
  const queryClient = useQueryClient();
  const current = authStore.use.marketplace();
  const { data, isLoading, error } = useQuery({
    queryKey: ["marketplacesAccounts"],
    queryFn: () => marketplaceService.getMarketplacesAccounts(),
    refetchOnWindowFocus: false,
  });

  const select = useMutation({
    mutationFn: async (acc: BaseMarketPlace) => {
      const res = await marketplaceService.SelectMarketplaceAccount(
        acc.marketplace_shop_id,
        acc.marketplace_type
      );
      return res;
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ refetchType: "active" });
        authStore.setState({ marketplace: res.data });
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

  const accounts: BaseMarketPlace[] = (data?.data as BaseMarketPlace[]) || [];

  return {
    current,
    accounts,
    isLoading,
    error,
    selectAccount: (acc: BaseMarketPlace) => select.mutate(acc),
    selectAccountAsync: (acc: BaseMarketPlace) => select.mutateAsync(acc),
    isSelecting: select.isPending,
  } as const;
}

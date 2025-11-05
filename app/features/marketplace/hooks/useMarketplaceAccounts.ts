import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "~/store";
import { marketplaceService } from "~/features/marketplace/service";
import { setMarketplace } from "~/features/marketplace/redux";
import type { BaseMarketPlace, MarketplaceOrderParseStatus, MarketplaceStatusParse } from "~/features/marketplace/typings";
import toast from "react-hot-toast";

export function useMarketplaceAccounts() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const current = useSelector((s: RootState) => s.marketplace.marketplace);

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
        dispatch(
          setMarketplace({
            marketplace_shop_id: res.data.marketplace_shop_id,
            marketplace_name: res.data.marketplace_name,
            marketplace_image: res.data.marketplace_image,
            marketplace_type: res.data.marketplace_type,
            status_parse: res.data.status_parse as MarketplaceStatusParse,
            orders_parse_status: res.data.orders_parse_status as MarketplaceOrderParseStatus,
          })
        );
        queryClient.invalidateQueries({ refetchType: "active" });
        toast.success("Conta selecionada");
      } else {
        toast.error(res.message);
      }
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Erro ao selecionar conta";
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



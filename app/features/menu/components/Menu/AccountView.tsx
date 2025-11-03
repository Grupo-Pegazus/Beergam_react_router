import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "~/store";
import { MarketplaceType, MarketplaceTypeLabel, type BaseMarketPlace } from "~/features/marketplace/typings";
import { marketplaceService } from "~/features/marketplace/service";
import { setMarketplace } from "~/features/marketplace/redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import toast from "react-hot-toast";

const selectAccount = async (acc: BaseMarketPlace) => {
    const res = await marketplaceService.SelectMarketplaceAccount(
        acc.marketplace_shop_id,
        acc.marketplace_type as MarketplaceType
    )
    return res;
}

export default function AccountView({ expanded = true }: { expanded?: boolean }) {
    const marketplace = useSelector((state: RootState) => state.marketplace.marketplace);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { data: accountsData, isLoading: accountsLoading } = useQuery({
        queryKey: ["marketplaces-accounts"],
        queryFn: () => marketplaceService.getMarketplacesAccounts(),
    });
    const select = useMutation({
        mutationFn: selectAccount,
        onSuccess: (data) => {
            if (data.success) {
                dispatch(setMarketplace(data.data));
                queryClient.invalidateQueries({ refetchType: "active" });
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    if (accountsLoading) {
        return <div className="p-3 text-sm opacity-70">Carregando contas...</div>;
    }
    if (!accountsData) {
        return <div className="p-3 text-sm opacity-70">Nenhuma conta encontrada</div>;
    }
    const accounts = accountsData.data as BaseMarketPlace[];



    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="flex items-center gap-2.5 bg-transparent border-0 p-0 cursor-pointer"
                    title="Trocar de conta"
                    aria-label="Trocar de conta de marketplace"
                >
                    {expanded && (
                        <div className="hidden md:flex flex-col min-w-0 text-right text-beergam-white">
                            <p className="font-semibold leading-4 truncate max-w-[200px]" title={marketplace?.marketplace_name}>
                                {marketplace?.marketplace_name}
                            </p>
                            <p className="text-xs opacity-70 leading-4">
                                {MarketplaceTypeLabel[marketplace?.marketplace_type as MarketplaceType]}
                            </p>
                        </div>
                    )}
                    <img
                        src={marketplace?.marketplace_image}
                        alt={marketplace?.marketplace_name}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                </button>

                {open && (
                    <div className="absolute right-0 mt-2 w-[320px] rounded-lg bg-white text-[#1e1f21] shadow-xl ring-1 ring-black/5 overflow-hidden z-50">
                        <div className="p-3 border-b border-black/10 flex items-center gap-3">
                            <img src={marketplace?.marketplace_image} alt={marketplace?.marketplace_name} className="w-10 h-10 rounded-full object-cover" />
                            <div className="min-w-0">
                                <p className="font-semibold truncate" title={marketplace?.marketplace_name}>{marketplace?.marketplace_name}</p>
                                <p className="text-xs opacity-70">{MarketplaceTypeLabel[marketplace?.marketplace_type as MarketplaceType]}</p>
                            </div>
                        </div>
                        <div className="max-h-[320px] overflow-auto">
                            {accounts.length ? (
                                accounts.map((acc) => (
                                    <button
                                        key={acc.marketplace_shop_id}
                                        onClick={() => {
                                            toast.promise(
                                                select.mutateAsync(acc).then(() => setOpen(false)),
                                                {
                                                    loading: "Trocando de conta...",
                                                    success: "Conta selecionada!",
                                                    error: (e: unknown) => (e instanceof Error ? e.message : "Erro ao selecionar conta"),
                                                }
                                            );
                                        }}
                                        className="w-full text-left p-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer"
                                    >
                                        <img src={acc.marketplace_image} alt={acc.marketplace_name} className="w-8 h-8 rounded-full object-cover" />
                                        <div className="min-w-0">
                                            <p className="truncate" title={acc.marketplace_name}>{acc.marketplace_name}</p>
                                            <p className="text-xs opacity-70">{MarketplaceTypeLabel[acc.marketplace_type as MarketplaceType]}</p>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="p-3 text-sm opacity-70">Nenhuma conta encontrada</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </ClickAwayListener>
    );
}
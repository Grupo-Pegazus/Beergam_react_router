import { useState, lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "~/store";
import { MarketplaceType, MarketplaceTypeLabel, MarketplaceStatusParse, type BaseMarketPlace } from "~/features/marketplace/typings";
import { marketplaceService } from "~/features/marketplace/service";
import { setMarketplace } from "~/features/marketplace/redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { logout } from "~/features/auth/redux";
import { menuService } from "../../service";
import Svg from "~/src/assets/svgs";
import StatusTag from "~/features/marketplace/components/StatusTag";
import Modal from "~/src/components/utils/Modal";
import Loading from "~/src/assets/loading";

// Lazy loading do modal de integração para otimizar performance
const CreateMarketplaceModal = lazy(() => import("~/routes/choosen_account/components/CreateMarketplaceModal"));

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
    const [showDropdown, setShowDropdown] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Controla animação de abertura/fechamento do dropdown
    useEffect(() => {
        if (open) {
            setShowDropdown(true);
        } else {
            const timer = setTimeout(() => setShowDropdown(false), 200);
            return () => clearTimeout(timer);
        }
    }, [open]);

    const handleLogout = async () => {
        const res = await menuService.logout();
        if (res.success) {
            dispatch(logout());
            navigate("/login");
        } else {
            toast.error(res.message);
        }
    }
    const { data: accountsData, isLoading: accountsLoading } = useQuery({
        queryKey: ["marketplacesAccounts"],
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

    // Invalida queries quando modal fecha para garantir dados atualizados
    const handleModalClose = () => {
        setModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["marketplacesAccounts"] });
    };

    if (accountsLoading) {
        return <div className="p-3 text-sm opacity-70">Carregando contas...</div>;
    }
    
    if (!accountsData) {
        return <div className="p-3 text-sm opacity-70">Nenhuma conta encontrada</div>;
    }
    
    const accounts = accountsData.data as BaseMarketPlace[];
    const otherAccounts = accounts.filter((acc) => acc.marketplace_shop_id !== marketplace?.marketplace_shop_id);

    return (
        <>
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="flex items-center gap-2.5 bg-transparent border-0 p-0 cursor-pointer hover:opacity-90 transition-opacity"
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
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
                    />
                </button>

                {showDropdown && (
                    <div className={`absolute right-0 mt-2 w-[340px] rounded-lg bg-white text-[#323130] shadow-xl border border-gray-200 overflow-hidden z-10 ${
                        open ? 'animate-slide-down' : 'animate-fade-out'
                    }`}>

                        {/* Current Account Info */}
                        {marketplace && (
                            <div className="px-4 py-3 border-b border-gray-200 relative">
                                <div className="flex items-start gap-3 mb-2">
                                    <div className={`w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shrink-0 ${marketplace.status_parse === MarketplaceStatusParse.PROCESSING ? 'opacity-60' : ''}`}>
                                        {marketplace.marketplace_image ? (
                                            <img 
                                                src={marketplace.marketplace_image} 
                                                alt={marketplace.marketplace_name} 
                                                className="w-full h-full rounded-full object-cover" 
                                            />
                                        ) : (
                                            <span className="text-white font-bold text-xl">
                                                {marketplace.marketplace_name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className={`font-semibold text-[#323130] truncate mb-1 ${marketplace.status_parse === MarketplaceStatusParse.PROCESSING ? 'opacity-60' : ''}`} title={marketplace.marketplace_name}>
                                            {marketplace.marketplace_name}
                                        </p>
                                        {/* Marketplace Type e Status de Pedidos na mesma linha */}
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <p className={`text-xs text-gray-600 ${marketplace.status_parse === MarketplaceStatusParse.PROCESSING ? 'opacity-60' : ''}`}>
                                                {MarketplaceTypeLabel[marketplace.marketplace_type as MarketplaceType]}
                                            </p>
                                            <StatusTag 
                                                status={marketplace.orders_parse_status} 
                                                type="orders" 
                                                className="text-[10px] py-0.5 px-2"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    navigate("/interno/perfil");
                                                }}
                                                className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium"
                                            >
                                                Minha conta
                                            </button>
                                            <span className="text-gray-300">•</span>
                                            <button 
                                                type="button"
                                                onClick={handleLogout}
                                                className="text-xs text-red-600 hover:text-red-700 hover:underline font-medium"
                                            >
                                                Sair
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Other Accounts Section */}
                        {otherAccounts.length > 0 && (
                            <div className="border-b border-gray-200">
                                <div className="max-h-[240px] overflow-y-auto">
                                    {otherAccounts.map((acc) => {
                                        const isProcessing = acc.status_parse === MarketplaceStatusParse.PROCESSING;
                                        return (
                                            <div key={acc.marketplace_shop_id} className="relative">
                                                {/* Overlay de processamento */}
                                                {isProcessing && (
                                                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-10">
                                                        <div className="text-white text-center flex flex-col items-center gap-2">
                                                            <Loading color="#ffffff" size="2rem" />
                                                            <p className="text-xs font-medium">Processando...</p>
                                                        </div>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        if (!isProcessing) {
                                                            toast.promise(
                                                                select.mutateAsync(acc).then(() => setOpen(false)),
                                                                {
                                                                    loading: "Trocando de conta...",
                                                                    success: "Conta selecionada!",
                                                                    error: (e: unknown) => (e instanceof Error ? e.message : "Erro ao selecionar conta"),
                                                                }
                                                            );
                                                        }
                                                    }}
                                                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer transition-colors group ${isProcessing ? 'opacity-60 cursor-not-allowed' : ''}`}
                                                    disabled={isProcessing}
                                                >
                                                    {acc.marketplace_image ? (
                                                        <img 
                                                            src={acc.marketplace_image} 
                                                            alt={acc.marketplace_name} 
                                                            className="w-10 h-10 rounded-full object-cover" 
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                                                            <span className="text-white font-semibold text-sm">
                                                                {acc.marketplace_name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-medium text-[#323130] group-hover:text-blue-600" title={acc.marketplace_name}>
                                                            {acc.marketplace_name}
                                                        </p>
                                                        {/* Marketplace Type e Status de Pedidos na mesma linha */}
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <p className="text-xs text-gray-500">
                                                                {MarketplaceTypeLabel[acc.marketplace_type as MarketplaceType]}
                                                            </p>
                                                            <StatusTag 
                                                                status={acc.orders_parse_status} 
                                                                type="orders" 
                                                                className="text-[10px] py-0.5 px-2"
                                                            />
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Add Account Button */}
                        <div className="p-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setModalOpen(true);
                                    setOpen(false);
                                }}
                                className="w-full text-left px-3 py-2.5 hover:bg-gray-50 flex items-center gap-3 cursor-pointer rounded transition-colors group"
                            >
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                                    <Svg.user_plus width={20} height={20} tailWindClasses="text-[#323130]" />
                                </div>
                                <span className="text-sm font-medium text-[#323130] group-hover:text-blue-600">
                                    Adicionar conta
                                </span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </ClickAwayListener>

        <Modal
            abrir={modalOpen}
            onClose={handleModalClose}
        >
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-beergam-orange border-t-transparent"></div>
                </div>
            }>
                <CreateMarketplaceModal
                    marketplacesAccounts={accounts}
                    modalOpen={modalOpen}
                />
            </Suspense>
        </Modal>
    </>
    );
}
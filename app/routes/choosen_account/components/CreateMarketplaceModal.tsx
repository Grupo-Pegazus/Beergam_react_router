import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type {
  BaseMarketPlace,
  MarketplaceType,
} from "~/features/marketplace/typings";
import { marketplaceService } from "~/features/marketplace/service";
import { getAvailableMarketplaces } from "~/features/marketplace/utils";
import Svg from "~/src/assets/svgs/_index";
import type { RootState } from "~/store";
import AvailableMarketplaceCard from "./AvailableMarketplaceCard";

export default function CreateMarketplaceModal({
  marketplacesAccounts,
  modalOpen,
}: {
  marketplacesAccounts: BaseMarketPlace[] | null;
  HandleIntegrationData?: (params: { Marketplace: MarketplaceType }) => void;
  modalOpen: boolean;
}) {
  const { subscription: rawSubscription } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  
  const subscription = Array.isArray(rawSubscription) 
    ? rawSubscription[0] ?? null 
    : rawSubscription;
  
  const maxAccounts = subscription?.plan?.benefits?.ML_accounts ?? 0;
  const currentAccountsCount = marketplacesAccounts?.length ?? 0;
  const remainingAccounts = Math.max(0, maxAccounts - currentAccountsCount);

  const [selectedMarketplace, setSelectedMarketplace] =
    useState<MarketplaceType | null>(null);
  const [integrationState, setIntegrationState] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = useCallback(() => {
    console.log("Parando polling...");
    
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsPolling(false);
    setIntegrationState(null);
    
    console.log("Polling parado e estados limpos");
  }, []);

  useEffect(() => {
    setSelectedMarketplace(null);
    setIntegrationState(null);
    setIsPolling(false);
    stopPolling();
  }, [modalOpen, stopPolling]);

  const openCenteredWindow = (url: string, width: number = 800, height: number = 800) => {

    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    const windowFeatures = [
      `width=${width}`,
      `height=${height}`,
      `left=${left}`,
      `top=${top}`,
      'toolbar=no',
      'location=no',
      'directories=no',
      'status=no',
      'menubar=no',
      'scrollbars=yes',
      'resizable=yes'
    ].join(',');

    return window.open(url, '_blank', windowFeatures);
  };

  const checkIntegrationStatus = useCallback(async (state: string) => {
    try {
      console.log("Verificando status da integração:", state);
      const response = await marketplaceService.checkIntegrationStatus(state);
      console.log("📊 Resposta do status:", response);
      
      if (response.success && response.data) {
        if (response.data.status === "success") {
          console.log("Integração realizada com sucesso!");
          stopPolling();
          queryClient.invalidateQueries({ refetchType: "active" });
          toast.success("Integração realizada com sucesso! Sua conta foi conectada.");
          return true;
        } else if (response.data.status === "error") {
          console.log("Erro na integração:", response.data.message);
          stopPolling();
          toast.error(`Erro na integração: ${response.data.message}`);
          return true;
        } else {
          console.log("Ainda processando...");
          return false;        }
      }
      return false;
    } catch (error) {
      console.error("Erro ao verificar status:", error);
      stopPolling();
      toast.error("Erro ao verificar status da integração");
      return true;
    }
  }, [stopPolling, queryClient]);

  useEffect(() => {
    if (isPolling && integrationState) {
      console.log("Iniciando polling para state:", integrationState);
      
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      pollingRef.current = setInterval(async () => {
        const isCompleted = await checkIntegrationStatus(integrationState);
        if (isCompleted) {
          stopPolling();
        }
      }, 3000);

      timeoutRef.current = setTimeout(() => {
        console.log("Timeout do polling - parando verificação");
        stopPolling();
      }, 600000); // 10 minutos

      return () => {
        stopPolling();
      };
    }
  }, [isPolling, integrationState, checkIntegrationStatus, stopPolling]);

  const handleSubmit = async () => {
    if (!selectedMarketplace) {
      return;
    }
    
    try {
      const response = await marketplaceService.IntegrationData(selectedMarketplace);
      
      if (response.success && response.data) {
        const integrationData = response.data;
        if (integrationData.integration_url) {
          const integrationWindow = openCenteredWindow(integrationData.integration_url);
          
          setIntegrationState(integrationData.state);
          setIsPolling(true);

          const checkClosed = setInterval(() => {
            if (integrationWindow && integrationWindow.closed) {
              clearInterval(checkClosed);
              console.log("Janela de integração foi fechada");
              stopPolling();
            }
          }, 1000);

          setTimeout(() => {
            clearInterval(checkClosed);
          }, 300000);
        }
      }
    } catch (error) {
      toast.error("Erro ao iniciar integração");
      console.error("Erro na integração:", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Conectar Marketplace
        </h2>
        <p className="text-gray-600 text-lg">
          Escolha uma plataforma para integrar sua loja
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-linear-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Lojas Conectadas</p>
              <p className="text-2xl font-bold text-blue-800">
                {marketplacesAccounts?.length || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg"><Svg.globe /></span>
            </div>
          </div>
        </div>
        
        <div className="bg-linear-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Contas Restantes</p>
              <p className="text-2xl font-bold text-green-800">
                {remainingAccounts}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg"><Svg.alert /></span>
            </div>
          </div>
        </div>
      </div>

      {/* Marketplace Grid */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {getAvailableMarketplaces().map((marketplace) => (
          <AvailableMarketplaceCard
            key={marketplace.value}
            marketplace={marketplace}
            isSelected={selectedMarketplace === marketplace.value}
            onCardClick={() => {
              setSelectedMarketplace(marketplace.value);
            }}
          />
        ))}
      </div>

        {/* Overlay para limite atingido */}
        {remainingAccounts <= 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Svg.lock_closed
                  width={40}
                  height={40}
                  tailWindClasses="stroke-red-500"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Limite Atingido
              </h3>
              <p className="text-gray-600 mb-4">
                Você atingiu o limite máximo de contas disponíveis no seu plano.
              </p>
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors">
                Ver Planos
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      {selectedMarketplace && (
        <div className="flex justify-center mb-6">
        <button
            onClick={handleSubmit}
            disabled={isPolling}
            className={`
              px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform
              ${isPolling 
                ? "bg-gray-400 cursor-not-allowed scale-95" 
                : "bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:scale-105 shadow-lg hover:shadow-xl"
              }
              text-white
            `}
          >
            {isPolling ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Aguardando integração...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                Conectar {selectedMarketplace.toUpperCase()}
              </div>
            )}
        </button>
        </div>
      )}

      {/* Polling Status */}
      {isPolling && (
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-blue-800 mb-2">
                Aguardando Autorização
              </h4>
              <p className="text-blue-700 mb-3">
                Complete a integração na nova janela que foi aberta. 
                Não feche esta página até finalizar o processo.
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Verificando status automaticamente...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

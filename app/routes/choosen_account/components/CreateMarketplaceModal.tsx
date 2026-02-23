import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import ImportProgressPanel from "~/features/marketplace/components/ImportProgress/ImportProgressPanel";
import { useImportProgress } from "~/features/marketplace/hooks/useImportProgress";
import { marketplaceService } from "~/features/marketplace/service";
import type {
  BaseMarketPlace,
  MarketplaceType,
} from "~/features/marketplace/typings";
import { getAvailableMarketplaces } from "~/features/marketplace/utils";
import authStore from "~/features/store-zustand";
import Svg from "~/src/assets/svgs/_index";
import MainCards from "~/src/components/ui/MainCards";
import BeergamButton from "~/src/components/utils/BeergamButton";
import toast from "~/src/utils/toast";
import AvailableMarketplaceCard from "./AvailableMarketplaceCard";

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 600000;
const WINDOW_CHECK_INTERVAL_MS = 1000;
const WINDOW_CHECK_MAX_MS = 300000;

type ModalView = "selection" | "importing";

export default function CreateMarketplaceModal({
  marketplacesAccounts,
  modalOpen,
}: {
  marketplacesAccounts: BaseMarketPlace[] | null;
  HandleIntegrationData?: (params: { Marketplace: MarketplaceType }) => void;
  modalOpen: boolean;
}) {
  const rawSubscription = authStore.use.subscription();
  const queryClient = useQueryClient();

  const subscription = Array.isArray(rawSubscription)
    ? (rawSubscription[0] ?? null)
    : rawSubscription;

  const maxAccounts = subscription?.plan?.benefits?.ML_accounts ?? 0;
  const currentAccountsCount = marketplacesAccounts?.length ?? 0;
  const remainingAccounts = Math.max(0, maxAccounts - currentAccountsCount);

  const [selectedMarketplace, setSelectedMarketplace] =
    useState<MarketplaceType | null>(null);
  const [integrationState, setIntegrationState] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [view, setView] = useState<ModalView>("selection");
  const [importAccountId, setImportAccountId] = useState<string | null>(null);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { progress: importProgress } = useImportProgress(
    importAccountId,
    view === "importing"
  );

  const stopPolling = useCallback(() => {
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
  }, []);

  const resetModal = useCallback(() => {
    setSelectedMarketplace(null);
    setIntegrationState(null);
    setIsPolling(false);
    setView("selection");
    setImportAccountId(null);
    stopPolling();
  }, [stopPolling]);

  useEffect(() => {
    resetModal();
  }, [modalOpen, resetModal]);

  const openCenteredWindow = (
    url: string,
    width = 800,
    height = 800
  ): Window | null => {
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    const features = [
      `width=${width}`,
      `height=${height}`,
      `left=${left}`,
      `top=${top}`,
      "toolbar=no",
      "location=no",
      "directories=no",
      "status=no",
      "menubar=no",
      "scrollbars=yes",
      "resizable=yes",
    ].join(",");
    return window.open(url, "_blank", features);
  };

  const checkIntegrationStatus = useCallback(
    async (state: string): Promise<boolean> => {
      try {
        const response =
          await marketplaceService.checkIntegrationStatus(state);
        if (!response.success || !response.data) return false;

        const { status, message, marketplace_shop_id } = response.data;

        if (status === "success") {
          stopPolling();
          queryClient.invalidateQueries({ refetchType: "active" });
          toast.success("Conta conectada! Iniciando importação de dados...");

          if (marketplace_shop_id) {
            setImportAccountId(marketplace_shop_id);
            setView("importing");
          }
          return true;
        }

        if (status === "error") {
          stopPolling();
          toast.error(`Erro na integração: ${message ?? "Tente novamente."}`);
          return true;
        }

        return false;
      } catch {
        stopPolling();
        toast.error("Erro ao verificar status da integração");
        return true;
      }
    },
    [stopPolling, queryClient]
  );

  useEffect(() => {
    if (!isPolling || !integrationState) return;

    if (pollingRef.current) clearInterval(pollingRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    pollingRef.current = setInterval(() => {
      checkIntegrationStatus(integrationState).then((done) => {
        if (done) stopPolling();
      });
    }, POLL_INTERVAL_MS);

    timeoutRef.current = setTimeout(stopPolling, POLL_TIMEOUT_MS);
    return () => stopPolling();
  }, [isPolling, integrationState, checkIntegrationStatus, stopPolling]);

  const handleSubmit = async () => {
    if (!selectedMarketplace) return;

    try {
      const response =
        await marketplaceService.IntegrationData(selectedMarketplace);

      if (!response.success || !response.data?.integration_url) {
        toast.error("Erro ao iniciar integração");
        return;
      }

      const { integration_url, state } = response.data;
      const integrationWindow = openCenteredWindow(integration_url);
      setIntegrationState(state);
      setIsPolling(true);

      const checkClosed = setInterval(() => {
        if (integrationWindow?.closed) {
          clearInterval(checkClosed);
          checkIntegrationStatus(state);
          setIsPolling(false);
        }
      }, WINDOW_CHECK_INTERVAL_MS);
      setTimeout(() => clearInterval(checkClosed), WINDOW_CHECK_MAX_MS);
    } catch {
      toast.error("Erro ao iniciar integração");
    }
  };

  if (view === "importing") {
    return <ImportingView progress={importProgress} />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 flex flex-col gap-6">
      {/* Resumo: lojas conectadas e contas restantes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MainCards className="p-4 border border-beergam-section-border bg-beergam-section-background!">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-beergam-typography-secondary">
                Lojas conectadas
              </p>
              <p className="text-xl md:text-2xl font-bold text-beergam-typography-primary">
                {marketplacesAccounts?.length ?? 0}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-beergam-blue-primary text-beergam-white flex items-center justify-center shrink-0">
              <Svg.globe tailWindClasses="w-6 h-6" />
            </div>
          </div>
        </MainCards>
        <MainCards className="p-4 border border-beergam-section-border bg-beergam-section-background!">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-beergam-typography-secondary">
                Contas restantes
              </p>
              <p className="text-xl md:text-2xl font-bold text-beergam-typography-primary">
                {remainingAccounts}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-beergam-green-primary text-beergam-white flex items-center justify-center shrink-0">
              <Svg.alert tailWindClasses="w-6 h-6" />
            </div>
          </div>
        </MainCards>
      </div>

      {/* Grid de marketplaces disponíveis */}
      <div className="relative">
        <p className="text-sm text-beergam-typography-secondary mb-3">
          Selecione o marketplace que deseja conectar:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {getAvailableMarketplaces().map((marketplace) => (
            <AvailableMarketplaceCard
              key={marketplace.value}
              marketplace={marketplace}
              isSelected={selectedMarketplace === marketplace.value}
              onCardClick={() => setSelectedMarketplace(marketplace.value)}
            />
          ))}
        </div>

        {remainingAccounts <= 0 && (
          <div className="absolute inset-0 bg-beergam-typography-tertiary/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
            <MainCards className="m-4 p-6 md:p-8 max-w-md w-full border border-beergam-section-border bg-beergam-section-background! text-center">
              <div className="w-14 h-14 bg-beergam-red-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Svg.lock_closed
                  width={28}
                  height={28}
                  tailWindClasses="stroke-beergam-red-primary"
                />
              </div>
              <h3 className="text-lg font-bold text-beergam-typography-primary mb-2">
                Limite atingido
              </h3>
              <p className="text-beergam-typography-secondary text-sm mb-5">
                Você atingiu o limite máximo de contas do seu plano. Atualize
                para conectar mais lojas.
              </p>
              <BeergamButton
                title="Ver planos"
                mainColor="beergam-red"
                animationStyle="fade"
                onClick={() => (window.location.href = "/subscription")}
                className="px-5 py-2"
              />
            </MainCards>
          </div>
        )}
      </div>

      {/* Botão conectar */}
      {selectedMarketplace && remainingAccounts > 0 && (
        <div className="flex justify-center">
          <BeergamButton
            title={
              isPolling
                ? "Aguardando integração..."
                : `Conectar ${selectedMarketplace.toUpperCase()}`
            }
            mainColor="beergam-blue-primary"
            animationStyle="slider"
            onClick={handleSubmit}
            disabled={isPolling}
            className="px-6 py-3 rounded-lg font-semibold"
            fetcher={{
              fecthing: isPolling,
              completed: false,
              error: false,
              mutation: {
                reset: () => {},
                isPending: isPolling,
                isSuccess: false,
                isError: false,
              },
            }}
          />
        </div>
      )}

      {/* Status: aguardando autorização */}
      {isPolling && (
        <MainCards className="p-4 md:p-5 border border-beergam-blue-primary/30 bg-beergam-blue-light/50! rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-beergam-blue-primary flex items-center justify-center shrink-0">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-beergam-white border-t-transparent" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-semibold text-beergam-typography-primary mb-1">
                Aguardando autorização
              </h4>
              <p className="text-sm text-beergam-typography-secondary mb-2">
                Conclua a integração na janela que foi aberta. Não feche esta
                página até finalizar.
              </p>
              <div className="flex items-center gap-2 text-xs text-beergam-typography-secondary">
                <span className="w-1.5 h-1.5 bg-beergam-blue-primary rounded-full animate-pulse" />
                Verificando status automaticamente...
              </div>
            </div>
          </div>
        </MainCards>
      )}
    </div>
  );
}

function ImportingView({
  progress,
}: {
  progress: import("~/features/marketplace/typings").ImportProgress | null;
}) {
  if (!progress) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6 flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-beergam-orange-light flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-beergam-orange border-t-transparent" />
        </div>
        <p className="text-sm text-beergam-typography-secondary text-center">
          Conectando ao servidor de importação...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <ImportProgressPanel progress={progress} />

      {progress.status !== "completed" && progress.status !== "error" && (
        <div className="mt-5 p-3 md:p-4 bg-beergam-blue-light/50 border border-beergam-blue-primary/20 rounded-xl">
          <p className="text-xs text-beergam-typography-secondary text-center">
            Você pode fechar este modal — a importação continuará em segundo
            plano. O progresso será exibido no card da sua loja.
          </p>
        </div>
      )}
    </div>
  );
}

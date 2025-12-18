import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router";
import type { ApiResponse } from "~/features/apiClient/typings";
import { marketplaceService } from "~/features/marketplace/service";
import { useAccountPolling } from "~/features/marketplace/hooks/useAccountPolling";
import type { IntegrationData } from "~/features/marketplace/typings";
import {
  type BaseMarketPlace,
  MarketplaceType,
} from "~/features/marketplace/typings";
import authStore from "~/features/store-zustand";
import toast from "~/src/utils/toast";
import ChoosenAccountPage from "./page";

export async function clientAction({ request }: { request: Request }) {
  try {
    const formData = await request.formData();
    const action = formData.get("action") as string;

    if (!action) {
      throw new Error("Ação não especificada");
    }

    let response: ApiResponse<null> | ApiResponse<IntegrationData>;

    if (action === "delete") {
      const marketplaceId = formData.get("marketplaceId") as string;
      const marketplaceType = formData.get("marketplaceType") as string;

      if (!marketplaceId || !marketplaceType) {
        throw new Error("Dados de marketplace inválidos");
      }

      // Recupera o marketplace selecionado do localStorage
      const selectedMarketplace = authStore.getState().marketplace;

      // Verifica se a conta sendo deletada é a mesma que está selecionada
      const isSelectedMarketplace =
        selectedMarketplace?.marketplace_shop_id === marketplaceId;

      const deletePromise = marketplaceService.deleteMarketplaceAccount(
        marketplaceId,
        marketplaceType as MarketplaceType
      );

      toast.promise(deletePromise, {
        loading: "Deletando conta...",
        success: (data) => {
          if (data.success) {
            return data.message;
          } else {
            throw new Error(data.message);
          }
        },
        error: (err) => <p>{err.message || "Erro ao deletar conta"}</p>,
      });

      response = await deletePromise;

      // Se a conta deletada era a selecionada, limpa o localStorage
      if (isSelectedMarketplace && response.success) {
        authStore.setState({ marketplace: null });
        return Response.json({
          ...response,
          shouldCelarStore: true,
        } as ApiResponse<null> & { shouldCelarStore?: boolean });
      }
    } else if (action === "integration") {
      const Marketplace = formData.get("Marketplace") as string;

      if (!Marketplace) {
        throw new Error("Marketplace inválido");
      }

      const integrationPromise = marketplaceService.IntegrationData(
        Marketplace as MarketplaceType
      );

      toast.promise(integrationPromise, {
        loading: "Carregando dados de integração...",
        success: "Dados de integração encontrados",
        error: (err) => (
          <p>{err.message || "Erro ao buscar dados de integração"}</p>
        ),
      });

      response = await integrationPromise;
    } else {
      throw new Error("Ação não reconhecida");
    }

    return response;
  } catch (error) {
    console.error("❌ Erro na action:", error);
    return Response.json({
      success: false,
      message: error instanceof Error ? error.message : "Erro inesperado",
      error_code: 500,
      error_fields: {},
      data: null,
    });
  }
}

export default function ChoosenAccountRoute() {
  const marketplace = authStore.use.marketplace();

  const { data, isLoading, error } = useQuery({
    queryKey: ["marketplacesAccounts"],
    queryFn: () => marketplaceService.getMarketplacesAccounts(),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Força refetch sempre que o componente montar
    staleTime: 0, // Dados sempre considerados obsoletos, forçando refetch
  });

  const accounts: BaseMarketPlace[] = Array.isArray(data?.data)
    ? (data.data as BaseMarketPlace[])
    : [];
  
  useAccountPolling(accounts);

  if (marketplace) {
    return <Navigate to="/interno" replace />;
  }

  if (isLoading) {
    return <ChoosenAccountPage marketplacesAccounts={[]} isLoading={true} />;
  }

  if (error) {
    return <div>Erro ao buscar contas de marketplace</div>;
  }

  if (data?.success) {
    return (
      <ChoosenAccountPage
        marketplacesAccounts={accounts}
      />
    );
  }

  // fallback seguro caso data exista mas não seja success
  return <ChoosenAccountPage marketplacesAccounts={[]} />;
}

import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { marketplaceService } from "~/features/marketplace/service";
import {
  type BaseMarketPlace,
  MarketplaceType,
} from "~/features/marketplace/typings";
import type { ApiResponse } from "~/features/apiClient/typings";
import type { IntegrationData } from "~/features/marketplace/typings";
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

      const deletePromise = marketplaceService.deleteMarketplaceAccount(
        marketplaceId, 
        marketplaceType as MarketplaceType
      );
      
      toast.promise(deletePromise, {
        loading: "Deletando conta...",
        success: "Conta deletada com sucesso",
        error: (err) => <p>{err.message || "Erro ao deletar conta"}</p>,
      });

      response = await deletePromise;

    } else if (action === "integration") {
      const Marketplace = formData.get("Marketplace") as string;
      
      if (!Marketplace) {
        throw new Error("Marketplace inválido");
      }

      const integrationPromise = marketplaceService.IntegrationData(Marketplace as MarketplaceType);
      
      toast.promise(integrationPromise, {
        loading: "Carregando dados de integração...",
        success: "Dados de integração encontrados",
        error: (err) => <p>{err.message || "Erro ao buscar dados de integração"}</p>,
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
  const { data, isLoading, error } = useQuery({
    queryKey: ["marketplacesAccounts"],
    queryFn: () => marketplaceService.getMarketplacesAccounts(),
    retry: false,
    refetchOnWindowFocus: false,
  });
  if (isLoading) {
    return <ChoosenAccountPage marketplacesAccounts={[]} isLoading={true} />;
  }
  if (error) {
    return <div>Erro ao buscar contas de marketplace</div>;
  }
  if (data?.success) {
    return (
      <ChoosenAccountPage
        marketplacesAccounts={data?.data as BaseMarketPlace[]}
      />
    );
  }
}

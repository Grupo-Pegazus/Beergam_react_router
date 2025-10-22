import { useQuery } from "@tanstack/react-query";
// import jsonMock from "~/features/marketplace/mock.json";
import { toast } from "react-hot-toast";
import { marketplaceService } from "~/features/marketplace/service";
import {
  MarketplaceType,
  type BaseMarketPlace,
} from "~/features/marketplace/typings";
import ChoosenAccountPage from "./page";

export async function clientAction({ request }: { request: Request }) {
  console.log("request", request);
  const formData = await request.formData();
  const Marketplace = formData.get("Marketplace") as MarketplaceType;
  const responsePromise = marketplaceService
    .IntegrationData(Marketplace)
    .then((response) => {
      console.log("response", response);
      if (!response.success) {
        // Rejeita a Promise se o login falhar
        const errorObj = new Error(
          response.message || "Erro ao buscar dados de integração"
        );
        Object.assign(errorObj, { ...response });
        throw errorObj;
      }
      return response;
    });

  toast.promise(responsePromise, {
    loading: "Carregando...",
    success: "Dados de integração encontrados",
    error: "Erro ao buscar dados de integração",
  });

  // return Marketplace;
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

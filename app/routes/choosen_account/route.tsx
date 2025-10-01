import { useQuery } from "@tanstack/react-query";
import { marketplaceService } from "~/features/marketplace/service";
import ChoosenAccountPage from "./page";

export default function ChoosenAccountRoute() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["marketplacesAccounts"],
    queryFn: () => marketplaceService.getMarketplacesAccounts(),
    retry: false,
    refetchOnWindowFocus: false,
  });
  useQuery({
    queryKey: ["marketplacesAccounts2"],
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
    return <ChoosenAccountPage marketplacesAccounts={data.data} />;
  }
}

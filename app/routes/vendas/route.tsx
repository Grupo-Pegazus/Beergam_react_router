import { useQuery } from "@tanstack/react-query";
import { vendasService } from "~/features/vendas/service";

export default function VendasRoute() {

    const { data, isLoading, error } = useQuery({
        queryKey: ["vendas"],
        queryFn: () => vendasService.getVendas(),
    });

    if (isLoading) {
        return <h1>Carregando...</h1>;
    }
    if (error) {
        return <h1>Erro ao carregar vendas</h1>;
    }
    if (data === null) {
        return <h1>Nenhuma venda encontrada</h1>;
    }

    return (
        <div>
          <h1>Tela de vendas</h1>
            {console.log(data?.data)}
        </div>
      );
    }
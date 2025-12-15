import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { produtosService } from "./service";
import type {
  ProductsFilters,
  ProductsResponse,
  ProductDetails,
  ProductsMetrics,
  StockTrackingResponse,
  StockTrackingFilters,
  StockMovementApiPayload,
  StockDashboardResponse,
  StockSyncDashboardResponse,
} from "./typings";
import type { ApiResponse } from "../apiClient/typings";
import toast from "~/src/utils/toast";

export function useProducts(filters?: Partial<ProductsFilters>) {
  return useQuery<ApiResponse<ProductsResponse>>({
    queryKey: ["products", filters],
    queryFn: async () => {
      const res = await produtosService.getProducts(filters);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar produtos");
      }
      return res;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnMount: "always",
  });
}

export function useProductDetails(productId: string) {
  return useQuery<ApiResponse<ProductDetails>>({
    queryKey: ["products", "details", productId],
    queryFn: async () => {
      const res = await produtosService.getProductDetails(productId);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar detalhes do produto");
      }
      return res;
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useProductsMetrics() {
  return useQuery<ApiResponse<ProductsMetrics>>({
    queryKey: ["products", "metrics"],
    queryFn: async () => {
      const res = await produtosService.getProductsMetrics();
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar métricas");
      }
      return res;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnMount: "always",
  });
}

export function useChangeProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      status,
    }: {
      productId: string;
      status: "Ativo" | "Inativo";
    }) => {
      const res = await produtosService.changeProductStatus(productId, status);
      if (!res.success) {
        throw new Error(res.message || "Erro ao alterar status do produto");
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Status do produto alterado com sucesso");
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Erro ao alterar status do produto";
      toast.error(message);
    },
  });
}

export function useChangeVariationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      variationId,
      status,
    }: {
      productId: string;
      variationId: string;
      status: "Ativo" | "Inativo";
    }) => {
      const res = await produtosService.changeVariationStatus(productId, variationId, status);
      if (!res.success) {
        throw new Error(res.message || "Erro ao alterar status da variação");
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Status da variação alterado com sucesso");
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Erro ao alterar status da variação";
      toast.error(message);
    },
  });
}

export { useProdutosFilters } from "./hooks/useProdutosFilters";

export function useStockTracking(
  productId: string,
  filters?: Partial<StockTrackingFilters>
) {
  return useQuery<ApiResponse<StockTrackingResponse>>({
    queryKey: ["products", "stock-tracking", productId, filters],
    queryFn: async () => {
      const res = await produtosService.getStockTracking(productId, filters);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar histórico de estoque");
      }
      return res;
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

export function useRecalculateAverageCost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await produtosService.recalculateAverageCost(productId);
      if (!res.success) {
        throw new Error(res.message || "Erro ao recalcular custo médio");
      }
      return res;
    },
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({
        queryKey: ["products", "stock-tracking", productId],
      });
      queryClient.invalidateQueries({
        queryKey: ["products", "details", productId],
      });
      toast.success("Custo médio recalculado com sucesso");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao recalcular custo médio";
      toast.error(message);
    },
  });
}

export function useCreateStockMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StockMovementApiPayload) => {
      const res = await produtosService.createStockMovement(data);
      if (!res.success) {
        throw new Error(res.message || "Erro ao criar movimentação de estoque");
      }
      return res;
    },
    onSuccess: (data) => {
      const productId = data.data?.product_id;
      if (productId) {
        queryClient.invalidateQueries({
          queryKey: ["products", "stock-tracking", productId],
        });
        queryClient.invalidateQueries({
          queryKey: ["products", "details", productId],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      toast.success("Movimentação de estoque criada com sucesso");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao criar movimentação de estoque";
      toast.error(message);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => produtosService.deleteProduct(productId),
    onSuccess: () => {
      // Invalida todas as queries relacionadas a produtos
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-metrics"] });

      queryClient.refetchQueries({ queryKey: ["products"] });
    },
  });
}

export function useStockDashboard(limit: number = 20) {
  return useQuery<ApiResponse<StockDashboardResponse>>({
    queryKey: ["stock-dashboard", limit],
    queryFn: async () => {
      const res = await produtosService.getStockDashboard(limit);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar dashboard de estoque");
      }
      return res;
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

export function useStockSyncDashboard() {
  return useQuery<ApiResponse<StockSyncDashboardResponse>>({
    queryKey: ["stock-sync-dashboard"],
    queryFn: async () => {
      const res = await produtosService.getStockSyncDashboard();
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar dashboard de sincronização");
      }
      return res;
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "~/src/utils/toast";
import type { ApiResponse } from "../apiClient/typings";
import { produtosService } from "./service";
import type {
  ProductDetails,
  ProductsFilters,
  ProductsMetrics,
  ProductsResponse,
  StockDashboardResponse,
  StockMovementApiPayload,
  StockSyncDashboardResponse,
  StockTrackingFilters,
  StockTrackingResponse,
} from "./typings";

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
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao alterar status do produto";
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
      const res = await produtosService.changeVariationStatus(
        productId,
        variationId,
        status
      );
      if (!res.success) {
        throw new Error(res.message || "Erro ao alterar status da variação");
      }
      return res;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      // Invalida também a query de detalhes do produto específico
      queryClient.invalidateQueries({
        queryKey: ["products", "details", variables.productId],
      });
      toast.success("Status da variação alterado com sucesso");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao alterar status da variação";
      toast.error(message);
    },
  });
}

/**
 * Hook global que decide automaticamente qual mutation usar baseado nos parâmetros
 * Se variationId for fornecido, usa useChangeVariationStatus
 * Caso contrário, usa useChangeProductStatus
 */
export function useChangeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      variationId,
      status,
    }: {
      productId: string;
      variationId?: string;
      status: "Ativo" | "Inativo";
    }) => {
      // Se variationId for fornecido, altera status da variação
      if (variationId) {
        const res = await produtosService.changeVariationStatus(
          productId,
          variationId,
          status
        );
        if (!res.success) {
          throw new Error(res.message || "Erro ao alterar status da variação");
        }
        return { ...res, type: "variation" as const };
      }

      // Caso contrário, altera status do produto
      const res = await produtosService.changeProductStatus(productId, status);
      if (!res.success) {
        throw new Error(res.message || "Erro ao alterar status do produto");
      }
      return { ...res, type: "product" as const };
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });

      // Se foi alteração de variação, invalida também a query de detalhes
      if (variables.variationId) {
        queryClient.invalidateQueries({
          queryKey: ["products", "details", variables.productId],
        });
        toast.success("Status da variação alterado com sucesso");
      } else {
        toast.success("Status do produto alterado com sucesso");
      }
    },
    onError: (error: unknown, variables) => {
      const isVariation = !!variables.variationId;
      const message =
        error instanceof Error
          ? error.message
          : isVariation
            ? "Erro ao alterar status da variação"
            : "Erro ao alterar status do produto";
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
        throw new Error(
          res.message || "Erro ao buscar dashboard de sincronização"
        );
      }
      return res;
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

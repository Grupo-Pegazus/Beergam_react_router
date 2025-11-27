import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { produtosService } from "./service";
import type {
  ProductsFilters,
  ProductsResponse,
  ProductDetails,
  ProductsMetrics,
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


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { catalogService } from "./service";
import type {
  CategoriesFilters,
  CategoriesResponse,
  AttributesFilters,
  AttributesResponse,
  CreateCategory,
  UpdateCategory,
  CreateAttribute,
  UpdateAttribute,
} from "./typings";
import type { ApiResponse } from "../apiClient/typings";
import toast from "~/src/utils/toast";

// Hooks para Categorias
export function useCategories(filters?: Partial<CategoriesFilters>) {
  return useQuery<ApiResponse<CategoriesResponse>>({
    queryKey: ["categories", filters],
    queryFn: async () => {
      const res = await catalogService.getCategories(filters);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar categorias");
      }
      return res;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategory) => {
      const res = await catalogService.createCategory(data);
      if (!res.success) {
        throw new Error(res.message || "Erro ao criar categoria");
      }
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(data.message || "Categoria criada com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar categoria");
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: string;
      data: UpdateCategory;
    }) => (async () => {
      const res = await catalogService.updateCategory(categoryId, data);
      if (!res.success) {
        throw new Error(res.message || "Erro ao atualizar categoria");
      }
      return res;
    })(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(data.message || "Categoria atualizada com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar categoria");
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      const res = await catalogService.deleteCategory(categoryId);
      if (!res.success) {
        throw new Error(res.message || "Erro ao remover categoria");
      }
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(data.message || "Categoria removida com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao remover categoria");
    },
  });
}

// Hooks para Atributos
export function useAttributes(filters?: Partial<AttributesFilters>) {
  return useQuery<ApiResponse<AttributesResponse>>({
    queryKey: ["attributes", filters],
    queryFn: async () => {
      const res = await catalogService.getAttributes(filters);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar atributos");
      }
      return res;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useCreateAttribute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAttribute) => {
      const res = await catalogService.createAttribute(data);
      if (!res.success) {
        throw new Error(res.message || "Erro ao criar atributo");
      }
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      toast.success(data.message || "Atributo criado com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar atributo");
    },
  });
}

export function useUpdateAttribute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      attributeId,
      data,
    }: {
      attributeId: string;
      data: UpdateAttribute;
    }) => (async () => {
      const res = await catalogService.updateAttribute(attributeId, data);
      if (!res.success) {
        throw new Error(res.message || "Erro ao atualizar atributo");
      }
      return res;
    })(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      toast.success(data.message || "Atributo atualizado com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar atributo");
    },
  });
}

export function useDeleteAttribute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attributeId: string) => {
      const res = await catalogService.deleteAttribute(attributeId);
      if (!res.success) {
        throw new Error(res.message || "Erro ao remover atributo");
      }
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      toast.success(data.message || "Atributo removido com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao remover atributo");
    },
  });
}


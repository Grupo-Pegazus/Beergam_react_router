import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type {
  CategoriesResponse,
  CategoriesFilters,
  AttributesResponse,
  AttributesFilters,
  Category,
  Attribute,
  CreateCategory,
  UpdateCategory,
  CreateAttribute,
  UpdateAttribute,
} from "./typings";

class CatalogService {
  // Categorias
  async getCategories(
    filters?: Partial<CategoriesFilters>
  ): Promise<ApiResponse<CategoriesResponse>> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const url = `/v1/product-categories${queryString ? `?${queryString}` : ""}`;

    const response = await typedApiClient.get<CategoriesResponse>(url);
    return response as ApiResponse<CategoriesResponse>;
  }

  async createCategory(
    data: CreateCategory
  ): Promise<ApiResponse<Category>> {
    const response = await typedApiClient.post<Category>(
      "/v1/product-categories",
      data
    );
    return response as ApiResponse<Category>;
  }

  async updateCategory(
    categoryId: string,
    data: UpdateCategory
  ): Promise<ApiResponse<Category>> {
    const response = await typedApiClient.put<Category>(
      `/v1/product-categories/${categoryId}`,
      data
    );
    return response as ApiResponse<Category>;
  }

  async deleteCategory(
    categoryId: string
  ): Promise<ApiResponse<{ id: string; message: string }>> {
    const response = await typedApiClient.delete<{ id: string; message: string }>(
      `/v1/product-categories/${categoryId}`
    );
    return response as ApiResponse<{ id: string; message: string }>;
  }

  // Atributos
  async getAttributes(
    filters?: Partial<AttributesFilters>
  ): Promise<ApiResponse<AttributesResponse>> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const url = `/v1/product-attributes${queryString ? `?${queryString}` : ""}`;

    const response = await typedApiClient.get<AttributesResponse>(url);
    return response as ApiResponse<AttributesResponse>;
  }

  async createAttribute(
    data: CreateAttribute
  ): Promise<ApiResponse<Attribute>> {
    const response = await typedApiClient.post<Attribute>(
      "/v1/product-attributes",
      data
    );
    return response as ApiResponse<Attribute>;
  }

  async updateAttribute(
    attributeId: string,
    data: UpdateAttribute
  ): Promise<ApiResponse<Attribute>> {
    const response = await typedApiClient.put<Attribute>(
      `/v1/product-attributes/${attributeId}`,
      data
    );
    return response as ApiResponse<Attribute>;
  }

  async deleteAttribute(
    attributeId: string
  ): Promise<ApiResponse<{ id: string; message: string }>> {
    const response = await typedApiClient.delete<{ id: string; message: string }>(
      `/v1/product-attributes/${attributeId}`
    );
    return response as ApiResponse<{ id: string; message: string }>;
  }
}

export const catalogService = new CatalogService();


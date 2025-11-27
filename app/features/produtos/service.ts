import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type {
  ProductsResponse,
  ProductsFilters,
  ProductDetails,
  ProductsMetrics,
} from "./typings";

class ProdutosService {
  async getProducts(
    filters?: Partial<ProductsFilters>
  ): Promise<ApiResponse<ProductsResponse>> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const url = `/v1/products${queryString ? `?${queryString}` : ""}`;

    const response = await typedApiClient.get<ProductsResponse>(url);
    return response as ApiResponse<ProductsResponse>;
  }

  async getProductDetails(
    productId: string
  ): Promise<ApiResponse<ProductDetails>> {
    const response = await typedApiClient.get<ProductDetails>(
      `/v1/products/${productId}`
    );
    return response as ApiResponse<ProductDetails>;
  }

  async getProductsMetrics(): Promise<ApiResponse<ProductsMetrics>> {
    const response = await typedApiClient.get<ProductsMetrics>(
      "/v1/products/metrics"
    );
    return response as ApiResponse<ProductsMetrics>;
  }

  async changeProductStatus(
    productId: string,
    status: "Ativo" | "Inativo"
  ): Promise<ApiResponse<{ success: boolean; message?: string }>> {
    const response = await typedApiClient.post<{ success: boolean; message?: string }>(
      `/v1/products/${productId}/status/change`,
      { status }
    );
    return response as ApiResponse<{ success: boolean; message?: string }>;
  }

  async changeVariationStatus(
    productId: string,
    variationId: string,
    status: "Ativo" | "Inativo"
  ): Promise<ApiResponse<{ success: boolean; message?: string }>> {
    const response = await typedApiClient.post<{ success: boolean; message?: string }>(
      `/v1/products/${productId}/variations/${variationId}/status/change`,
      { status }
    );
    return response as ApiResponse<{ success: boolean; message?: string }>;
  }
}

export const produtosService = new ProdutosService();


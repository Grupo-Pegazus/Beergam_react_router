import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type {
  ProductsResponse,
  ProductsFilters,
  ProductDetails,
  ProductsMetrics,
  StockTrackingResponse,
  StockTrackingFilters,
  RecalculateAverageCostResponse,
  StockMovementApiPayload,
  StockMovementResponse,
  StockDashboardResponse,
  StockSyncDashboardResponse,
} from "./typings";
import type { CreateProduct } from "./typings/createProduct";

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

  async deleteProduct(productId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await typedApiClient.delete<{ message: string }>(
      `/v1/products/${productId}`
    );
    return response as ApiResponse<{ message: string }>;
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

  async getStockTracking(
    productId: string,
    filters?: Partial<StockTrackingFilters>
  ): Promise<ApiResponse<StockTrackingResponse>> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const url = `/v1/products/${productId}/stock-tracking${queryString ? `?${queryString}` : ""}`;

    const response = await typedApiClient.get<StockTrackingResponse>(url);
    return response as ApiResponse<StockTrackingResponse>;
  }

  async recalculateAverageCost(
    productId: string
  ): Promise<ApiResponse<RecalculateAverageCostResponse>> {
    const response = await typedApiClient.post<RecalculateAverageCostResponse>(
      `/v1/products/${productId}/stock-tracking/recalculate-average-cost`
    );
    return response as ApiResponse<RecalculateAverageCostResponse>;
  }

  async createStockMovement(
    data: StockMovementApiPayload
  ): Promise<ApiResponse<StockMovementResponse>> {
    const response = await typedApiClient.post<StockMovementResponse>(
      `/v1/stock-sync/register-stock-change`,
      data
    );
    return response as ApiResponse<StockMovementResponse>;
  }

  async getStockDashboard(
    limit: number = 20
  ): Promise<ApiResponse<StockDashboardResponse>> {
    const response = await typedApiClient.get<StockDashboardResponse>(
      `/v1/products/stock-dashboard?limit=${limit}`
    );
    return response as ApiResponse<StockDashboardResponse>;
  }

  async getStockSyncDashboard(): Promise<ApiResponse<StockSyncDashboardResponse>> {
    const response = await typedApiClient.get<StockSyncDashboardResponse>(
      `/v1/stock-sync/dashboard`
    );
    return response as ApiResponse<StockSyncDashboardResponse>;
  }

  async createProduct(
    data: CreateProduct
  ): Promise<ApiResponse<{ product_id: string; message: string }>> {
    const response = await typedApiClient.post<{ product_id: string; message: string }>(
      "/v1/products",
      data
    );
    return response as ApiResponse<{ product_id: string; message: string }>;
  }

  async updateProduct(
    productId: string,
    data: CreateProduct
  ): Promise<ApiResponse<{ product_id: string; message: string }>> {
    const response = await typedApiClient.put<{ product_id: string; message: string }>(
      `/v1/products/${productId}`,
      data
    );
    return response as ApiResponse<{ product_id: string; message: string }>;
  }

  async getSpreadsheetTemplate(): Promise<
    ApiResponse<{ file_url: string; filename: string }>
  > {
    const response = await typedApiClient.get<{ file_url: string; filename: string }>(
      "/v1/products/spreadsheet/template"
    );
    return response as ApiResponse<{ file_url: string; filename: string }>;
  }

  async exportSpreadsheet(): Promise<
    ApiResponse<{ file_url: string; filename: string }>
  > {
    const response = await typedApiClient.get<{ file_url: string; filename: string }>(
      "/v1/products/spreadsheet/export"
    );
    return response as ApiResponse<{ file_url: string; filename: string }>;
  }

  async importSpreadsheet(file: File): Promise<
    ApiResponse<{
      created: number;
      updated: number;
      skus: string[];
      created_skus: Array<{ sku: string; available_quantity: number }>;
      errors: Array<{ row: number; sku: string; message: string }>;
    }>
  > {
    const formData = new FormData();
    formData.append("file", file);
    const response = await typedApiClient.axiosInstance.post<
      ApiResponse<{
        created: number;
        updated: number;
        skus: string[];
        created_skus: Array<{ sku: string; available_quantity: number }>;
        errors: Array<{ row: number; sku: string; message: string }>;
      }>
    >("/v1/products/spreadsheet/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async activateStockHandling(
    skus: Array<{ sku: string; available_quantity: number }>
  ): Promise<
    ApiResponse<{
      activated: number;
      skus_not_found: string[];
      errors: Array<{ sku: string; message: string }>;
    }>
  > {
    const response = await typedApiClient.post<
      {
        activated: number;
        skus_not_found: string[];
        errors: Array<{ sku: string; message: string }>;
      }
    >("/v1/products/spreadsheet/activate-stock", { skus });
    return response as ApiResponse<{
      activated: number;
      skus_not_found: string[];
      errors: Array<{ sku: string; message: string }>;
    }>;
  }
}

export const produtosService = new ProdutosService();


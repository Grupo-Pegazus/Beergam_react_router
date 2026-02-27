import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type {
  CalculatorRequest,
  CalculatorResponse,
  ISavedCalculation,
  MeliListingPrice,
  MeliProductResponse,
  SaveCalculationPayload,
} from "./typings";

class CalculatorService {
  async calculateFullListing(
    data: CalculatorRequest
  ): Promise<ApiResponse<CalculatorResponse>> {
    const response = await typedApiClient.post<CalculatorResponse>(
      "/v1/calculator/calculate_full_listing",
      data
    );
    return response as ApiResponse<CalculatorResponse>;
  }

  /**
   * Busca dados do produto do Mercado Livre pelo MLB.
   * 
   * @param mlb - ID do produto (MLB)
   * @returns Dados do produto extraídos
   */
  async getMeliProduct(
    mlb: string
  ): Promise<ApiResponse<MeliProductResponse>> {
    const response = await typedApiClient.get<MeliProductResponse>(
      `/v1/calculator/meli/get_product/${mlb}`
    );
    return response as ApiResponse<MeliProductResponse>;
  }

  /**
   * Busca preços de listagem do Mercado Livre.
   * 
   * @param categoryId - ID da categoria
   * @param price - Preço do produto
   * @param currencyId - ID da moeda (padrão: BRL)
   * @param logisticType - Tipo de logística (padrão: gold_pro)
   * @returns Lista de preços de listagem (gold_pro e gold_special)
   */
  async getMeliListingPrices(
    categoryId: string,
    price: number,
    currencyId: string = "BRL",
    logisticType: string = "gold_pro"
  ): Promise<ApiResponse<MeliListingPrice[]>> {
    const params = new URLSearchParams({
      category_id: categoryId,
      price: price.toString(),
      currency_id: currencyId,
      logistic_type: logisticType,
    });

    const response = await typedApiClient.get<MeliListingPrice[]>(
      `/v1/calculator/meli/listing_prices?${params.toString()}`
    );
    return response as ApiResponse<MeliListingPrice[]>;
  }

  async saveCalculation(
    payload: SaveCalculationPayload
  ): Promise<ApiResponse<ISavedCalculation>> {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("type_calculator", payload.type_calculator);
    formData.append("input_payload", JSON.stringify(payload.input_payload));
    formData.append("output_payload", JSON.stringify(payload.output_payload));
    if (payload.photo) {
      formData.append("photo", payload.photo);
    }

    const response = await typedApiClient.post<ISavedCalculation>(
      "/v1/calculator/saved",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response as ApiResponse<ISavedCalculation>;
  }

  async listSavedCalculations(): Promise<ApiResponse<ISavedCalculation[]>> {
    const response = await typedApiClient.get<ISavedCalculation[]>(
      "/v1/calculator/saved"
    );
    return response as ApiResponse<ISavedCalculation[]>;
  }

  async deleteSavedCalculation(
    calculationId: number
  ): Promise<ApiResponse<null>> {
    const response = await typedApiClient.delete<null>(
      `/v1/calculator/saved/${calculationId}`
    );
    return response as ApiResponse<null>;
  }
}

export const calculatorService = new CalculatorService();


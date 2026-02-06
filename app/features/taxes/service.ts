import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import { MarketplaceType } from "../marketplace/typings";
import {
  type TaxesResponse,
  TaxesResponseSchema,
  type TaxesData,
  UpsertTaxPayloadSchema,
  type UpsertTaxPayload,
  type UpsertTaxResponse,
  UpsertTaxResponseSchema,
  RecalcStatusSchema,
  type RecalcStatusResponse,
  RecalcPeriodPayloadSchema,
  type RecalcPeriodPayload,
} from "./typings";

class TaxesService {
  async getUserTaxes(params: {
    marketplace_shop_id: string | number;
    marketplace_type: MarketplaceType;
    year: number;
  }): Promise<ApiResponse<TaxesData>> {
    try {
      const response = await typedApiClient.get<TaxesResponse>(
        `/v1/user_taxes/get_taxes_by_marketplace?marketplace_shop_id=${params.marketplace_shop_id}&marketplace_type=${params.marketplace_type}&ano=${params.year}`
      );
      const parsed = TaxesResponseSchema.safeParse(response);
      if (!parsed.success) {
        return {
          success: false,
          data: {} as TaxesData,
          message: "Erro ao validar resposta de impostos",
          error_code: 500,
          error_fields: {},
        };
      }
      const base = response as Partial<ApiResponse<unknown>>;
      return {
        success: parsed.data.success,
        message: parsed.data.message,
        data: parsed.data.data,
        error_code: (base.error_code as number) ?? 0,
        error_fields: (base.error_fields as Record<string, string[]>) ?? {},
      } as ApiResponse<TaxesData>;
    } catch {
      return {
        success: false,
        data: {} as TaxesData,
        message: "Erro ao buscar impostos. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }

  async upsertTax(payload: UpsertTaxPayload): Promise<ApiResponse<UpsertTaxResponse["data"]>> {
    try {
      const valid = UpsertTaxPayloadSchema.parse(payload);
      const response = await typedApiClient.post<unknown>(
        "/v1/user_taxes/upsert",
        valid
      );
      const parsed = UpsertTaxResponseSchema.safeParse(response);
      if (!parsed.success) {
        return {
          success: false,
          data: { id: null, tax_rate: 0 },
          message: "Erro ao validar resposta do upsert de imposto",
          error_code: 500,
          error_fields: {},
        };
      }
      const base = response as Partial<ApiResponse<unknown>>;
      return {
        success: parsed.data.success,
        message: parsed.data.message,
        data: parsed.data.data,
        error_code: (base.error_code as number) ?? 0,
        error_fields: (base.error_fields as Record<string, string[]>) ?? {},
      } as ApiResponse<UpsertTaxResponse["data"]>;
    } catch {
      return {
        success: false,
        data: { id: null, tax_rate: 0 },
        message: "Erro ao salvar imposto. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }

  async getRecalcStatus(params: { year: number; month: number }): Promise<ApiResponse<RecalcStatusResponse["data"]>> {
    try {
      const response = await typedApiClient.get<unknown>(
        `/v1/user_taxes/recalculate-status?year=${params.year}&month=${params.month}`
      );
      const parsed = RecalcStatusSchema.safeParse(response);
      if (!parsed.success) {
        return {
          success: false,
          data: {
            can_recalculate: false,
            last_recalculation: null,
            month: params.month,
            monthly_limit: 0,
            recalculation_count: 0,
            remaining_recalculations: 0,
            user_pin: "",
            year: params.year,
          },
          message: "Erro ao validar status de recálculo",
          error_code: 500,
          error_fields: {},
        };
      }
      const base = response as Partial<ApiResponse<unknown>>;
      return {
        success: parsed.data.success,
        message: parsed.data.message,
        data: parsed.data.data,
        error_code: (base.error_code as number) ?? 0,
        error_fields: (base.error_fields as Record<string, string[]>) ?? {},
      } as ApiResponse<RecalcStatusResponse["data"]>;
    } catch {
      return {
        success: false,
        data: {
          can_recalculate: false,
          last_recalculation: null,
          month: params.month,
          monthly_limit: 0,
          recalculation_count: 0,
          remaining_recalculations: 0,
          user_pin: "",
          year: params.year,
        },
        message: "Erro ao buscar status de recálculo",
        error_code: 500,
        error_fields: {},
      };
    }
  }

  async recalculatePeriod(payload: RecalcPeriodPayload): Promise<ApiResponse<unknown>> {
    try {
      const valid = RecalcPeriodPayloadSchema.parse(payload);
      const response = await typedApiClient.post<unknown>(
        "/v1/user_taxes/recalculate-period",
        valid
      );
      return response as ApiResponse<unknown>;
    } catch (error: unknown) {
      const maybe = error as { response?: { data?: { message?: string; error_code?: number } } };
      const message = maybe?.response?.data?.message ?? "Erro ao iniciar recálculo do período";
      return {
        success: false,
        data: null,
        message,
        error_code: maybe?.response?.data?.error_code ?? 500,
        error_fields: {},
      } as ApiResponse<null>;
    }
  }
}

export const taxesService = new TaxesService();



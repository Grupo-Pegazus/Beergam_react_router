import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import { type IncomingsBySkuSchemaType, type InvoicingMetricsSchemaType, type SalesBySkuMonthlyType, type SelfServiceReturnSchemaType } from "./typings";



export type InvoicingMetricsByMonthsSchemaType = { "30": {"net": number, "gross": number}, "60": {"net": number, "gross": number}, "90": {"net": number, "gross": number}, "120": {"net": number, "gross": number} | null | undefined };

class InvoicingService {
    async getInvoicingMetrics(): Promise<ApiResponse<InvoicingMetricsSchemaType>> {
        const response = await typedApiClient.get<InvoicingMetricsSchemaType>(`/v1/invoicing/get_metrics`);
        return response as ApiResponse<InvoicingMetricsSchemaType>;
    }
    async get_metrics_by_months(): Promise<ApiResponse<InvoicingMetricsByMonthsSchemaType>> {
        const response = await typedApiClient.get<InvoicingMetricsByMonthsSchemaType>(`/v1/invoicing/get_metrics_by_month`);
        return response as ApiResponse<InvoicingMetricsByMonthsSchemaType>;
    }
    async get_incomings_by_sku(params?: {
        start_date?: string;
        end_date?: string;
    }): Promise<ApiResponse<IncomingsBySkuSchemaType[]>> {
        const effectiveParams =
            params && (params.start_date || params.end_date)
                ? {
                      ...(params.start_date && { start_date: params.start_date }),
                      ...(params.end_date && { end_date: params.end_date }),
                  }
                : undefined;

        const response = await typedApiClient.get<IncomingsBySkuSchemaType[]>(
            `/v1/invoicing/get_incomings_by_sku`,
            { params: effectiveParams }
        );
        return response as ApiResponse<IncomingsBySkuSchemaType[]>;
    }
    async get_self_service_return(): Promise<ApiResponse<SelfServiceReturnSchemaType>> {
        const response = await typedApiClient.get<SelfServiceReturnSchemaType>(`/v1/invoicing/get_self_services_incomings`);
        return response as ApiResponse<SelfServiceReturnSchemaType>;
    }

    async getSalesBySkuMonthly(params?: {
        months?: number;
        date_from?: string;
        date_to?: string;
    }): Promise<ApiResponse<SalesBySkuMonthlyType>> {
        const queryParams = new URLSearchParams();
        if (params?.date_from) queryParams.append("date_from", params.date_from);
        if (params?.date_to) queryParams.append("date_to", params.date_to);
        const qs = queryParams.toString();
        const url = `/v1/orders/sales-by-sku-monthly${qs ? `?${qs}` : ""}`;
        const response = await typedApiClient.get<SalesBySkuMonthlyType>(url);
        return response as ApiResponse<SalesBySkuMonthlyType>;
    }
}
export const invoicingService = new InvoicingService();
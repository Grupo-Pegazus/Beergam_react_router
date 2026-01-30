import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import { type InvoicingMetricsSchemaType } from "./typings";



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
}
export const invoicingService = new InvoicingService();
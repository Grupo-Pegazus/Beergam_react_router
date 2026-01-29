import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import { type InvoicingMetricsSchemaType } from "./typings";

class InvoicingService {
    async getInvoicingMetrics(): Promise<ApiResponse<InvoicingMetricsSchemaType>> {
        const response = await typedApiClient.get<InvoicingMetricsSchemaType>(`/v1/invoicing/get_metrics`);
        return response as ApiResponse<InvoicingMetricsSchemaType>;
    }
    async get_metrics_by_months(): Promise<ApiResponse<{ "30": number, "60": number, "90": number }>> {
        const response = await typedApiClient.get<{ "30": number, "60": number, "90": number }>(`/v1/invoicing/get_metrics_by_month`);
        return response as ApiResponse<{ "30": number, "60": number, "90": number }>;
    }
}
export const invoicingService = new InvoicingService();
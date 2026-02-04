import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import { type IncomingsBySkuSchemaType, type InvoicingMetricsSchemaType, type SelfServiceReturnSchemaType } from "./typings";



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
    async get_incomings_by_sku(): Promise<ApiResponse<IncomingsBySkuSchemaType[]>> {
        const response = await typedApiClient.get<IncomingsBySkuSchemaType[]>(`/v1/invoicing/get_incomings_by_sku`);
        return response as ApiResponse<IncomingsBySkuSchemaType[]>;
    }
    async get_self_service_return(): Promise<ApiResponse<SelfServiceReturnSchemaType>> {
        const response = await typedApiClient.get<SelfServiceReturnSchemaType>(`/v1/invoicing/get_self_services_incomings`);
        return response as ApiResponse<SelfServiceReturnSchemaType>;
    }
}
export const invoicingService = new InvoicingService();
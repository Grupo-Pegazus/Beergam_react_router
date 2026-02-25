import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "../apiClient/typings";
import type { InvoicingMetricsByMonthsSchemaType } from "./service";
import { invoicingService } from "./service";
import type { IncomingsBySkuSchemaType, InvoicingMetricsSchemaType, SalesBySkuMonthlyType, SelfServiceReturnSchemaType } from "./typings";
export function useInvoicingMetrics() {
    return useQuery<ApiResponse<InvoicingMetricsSchemaType>>({
        queryKey: ["invoicing", "metrics"],
        queryFn: async () => {
            const res = await invoicingService.getInvoicingMetrics();
            if (!res.success) {
                throw new Error(res.message || "Erro ao buscar métricas de faturamento");
            }
            return res;
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
}

export function useInvoicingMetricsByMonths() {
    return useQuery<ApiResponse<InvoicingMetricsByMonthsSchemaType>>({
        queryKey: ["invoicing", "metrics", "by_months"],
        queryFn: async () => {
            const res = await invoicingService.get_metrics_by_months();
            if (!res.success) {
                throw new Error(res.message || "Erro ao buscar métricas de faturamento por meses");
            }
            return res;
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
}

export function useIncomingsBySku(params?: {
    start_date?: string;
    end_date?: string;
}) {
    return useQuery<ApiResponse<IncomingsBySkuSchemaType[]>>({
        queryKey: ["invoicing", "incomings", "by_sku", params?.start_date, params?.end_date],
        queryFn: async () => {
            const res = await invoicingService.get_incomings_by_sku(params);
            if (!res.success) {
                throw new Error(res.message || "Erro ao buscar incomings por SKU");
            }
            return res;
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
}

export function useSalesBySkuMonthly(params?: {
    date_from?: string;
    date_to?: string;
}) {
    return useQuery<ApiResponse<SalesBySkuMonthlyType>>({
        queryKey: ["invoicing", "sales_by_sku_monthly", params?.date_from, params?.date_to],
        queryFn: async () => {
            const res = await invoicingService.getSalesBySkuMonthly(params);
            if (!res.success) {
                throw new Error(res.message || "Erro ao buscar vendas por SKU por mês");
            }
            return res;
        },
        staleTime: 1000 * 60 * 5,
    });
}

export function useSelfServiceReturn() {
    return useQuery<ApiResponse<SelfServiceReturnSchemaType>>({
        queryKey: ["invoicing", "self_service_return"],
        queryFn: async () => {
            const res = await invoicingService.get_self_service_return();
            if (!res.success) {
                throw new Error(res.message || "Erro ao buscar retorno do flex");
            }
            return res;
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
}
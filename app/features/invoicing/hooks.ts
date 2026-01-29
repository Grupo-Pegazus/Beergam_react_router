import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "../apiClient/typings";
import { invoicingService } from "./service";
import type { InvoicingMetricsSchemaType } from "./typings";
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
    return useQuery<ApiResponse<{ "30": number, "60": number, "90": number }>>({
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
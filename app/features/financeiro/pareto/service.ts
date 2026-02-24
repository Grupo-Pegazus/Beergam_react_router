import { typedApiClient } from "~/features/apiClient/client";
import type { ApiResponse } from "~/features/apiClient/typings";
import type { ParetoChartFilters, ParetoChartResponse, ParetoTableFilters, ParetoTableResponse } from "./typings";

class ParetoService {
    async getChartData(filters?: ParetoChartFilters): Promise<ApiResponse<ParetoChartResponse>> {
        const params = new URLSearchParams();

        if (filters) {
            const { metric, period_alias, date_from, date_to, top_n } = filters;

            if (metric) params.set("metric", metric);
            if (period_alias) params.set("period_alias", period_alias);
            if (date_from) params.set("date_from", date_from);
            if (date_to) params.set("date_to", date_to);
            if (top_n !== undefined) params.set("top_n", String(top_n));
        }

        const query = params.toString();
        const url = `/v1/pareto/chart${query ? `?${query}` : ""}`;
        return await typedApiClient.get<ParetoChartResponse>(url);
    }

    async getTableData(filters?: ParetoTableFilters): Promise<ApiResponse<ParetoTableResponse>> {
        const params = new URLSearchParams();

        if (filters) {
            const { metric, period_alias, date_from, date_to, page, per_page, sort_by, sort_order } = filters;

            if (metric) params.set("metric", metric);
            if (period_alias) params.set("period_alias", period_alias);
            if (date_from) params.set("date_from", date_from);
            if (date_to) params.set("date_to", date_to);
            if (page !== undefined) params.set("page", String(page));
            if (per_page !== undefined) params.set("per_page", String(per_page));
            if (sort_by) params.set("sort_by", sort_by);
            if (sort_order) params.set("sort_order", sort_order);
        }

        const query = params.toString();
        const url = `/v1/pareto/table${query ? `?${query}` : ""}`;
        return await typedApiClient.get<ParetoTableResponse>(url);
    }
}

export const paretoService = new ParetoService();

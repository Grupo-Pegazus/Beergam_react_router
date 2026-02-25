import { typedApiClient } from "~/features/apiClient/client";
import type { ApiResponse } from "~/features/apiClient/typings";
import type { FullSuggestionFilters, FullSuggestionResponse } from "./typings";

class FullSuggestionService {
    async getSuggestions(filters?: FullSuggestionFilters): Promise<ApiResponse<FullSuggestionResponse>> {
        const params = new URLSearchParams();

        if (filters) {
            const { coverage_days, period_alias, date_from, date_to, page, per_page, sort_by, sort_order } = filters;

            if (coverage_days !== undefined) params.set("coverage_days", String(coverage_days));
            if (period_alias) params.set("period_alias", period_alias);
            if (date_from) params.set("date_from", date_from);
            if (date_to) params.set("date_to", date_to);
            if (page !== undefined) params.set("page", String(page));
            if (per_page !== undefined) params.set("per_page", String(per_page));
            if (sort_by) params.set("sort_by", sort_by);
            if (sort_order) params.set("sort_order", sort_order);
        }

        const query = params.toString();
        const url = `/v1/full-suggestion/summary${query ? `?${query}` : ""}`;
        const response = await typedApiClient.get<FullSuggestionResponse>(url);
        return response as ApiResponse<FullSuggestionResponse>;
    }
}

export const fullSuggestionService = new FullSuggestionService();

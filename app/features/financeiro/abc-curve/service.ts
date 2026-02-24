import { typedApiClient } from "~/features/apiClient/client";
import type { ApiResponse } from "~/features/apiClient/typings";
import type { ABCCurveFilters, ABCCurveResponse } from "./typings";

class ABCCurveService {
    async getCurveBySku(filters?: ABCCurveFilters): Promise<ApiResponse<ABCCurveResponse>> {
        const params = new URLSearchParams();

        if (filters) {
            const {
                period_alias,
                date_from,
                date_to,
                page,
                per_page,
                sort_by,
                sort_order,
                class_in,
                has_product,
            } = filters;

            if (period_alias) params.set("period_alias", period_alias);
            if (date_from) params.set("date_from", date_from);
            if (date_to) params.set("date_to", date_to);
            if (page !== undefined) params.set("page", String(page));
            if (per_page !== undefined) params.set("per_page", String(per_page));
            if (sort_by) params.set("sort_by", sort_by);
            if (sort_order) params.set("sort_order", sort_order);
            if (Array.isArray(class_in) && class_in.length > 0) {
                params.set("class_in", class_in.join(","));
            }
            if (has_product !== undefined) {
                params.set("has_product", String(has_product));
            }
        }

        const query = params.toString();
        const url = `/v1/abc-curve/by-sku${query ? `?${query}` : ""}`;
        const response = await typedApiClient.get<ABCCurveResponse>(url);
        return response as ApiResponse<ABCCurveResponse>;
    }
}

export const abcCurveService = new ABCCurveService();


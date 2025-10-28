import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type { Plan } from "../user/typings/BaseUser";

class PlansService {
    async getPlans(): Promise<ApiResponse<Plan[]>> {
        try {
            const response = await typedApiClient.get<Plan[]>("/v1/payments/plans");
            return response;
        } catch (error) {
            console.error("error do getPlans", error);
            return {
                success: false,
                data: [] as Plan[],
                message: "Erro ao buscar planos. Tente novamente em alguns instantes.",
                error_code: 500,
                error_fields: {},
            };
        }
    }
}

export const plansService = new PlansService();
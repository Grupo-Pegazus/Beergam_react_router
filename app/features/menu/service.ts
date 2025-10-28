import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";

class MenuService {
    async logout(): Promise<ApiResponse<null>> {
        try {
            const response = await typedApiClient.post<null>("/v1/auth/logout");
            return response;
        } catch (error) {
            console.error("error do logout", error);
            return {
                success: false,
                data: null,
                message: "Erro ao fazer logout. Tente novamente em alguns instantes.",
                error_code: 500,
                error_fields: {},
            };
        }
    }
}

export const menuService = new MenuService();
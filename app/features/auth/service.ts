import { typedApiClient } from "../apiClient/typedClient";
import type { ApiResponse } from "../apiClient/typings";

// Tipagem para os dados de usuário retornados pelo login
interface UserData {
  id: string;
  email: string;
  name: string;
}

class AuthService {
  async login(email: string, password: string): Promise<ApiResponse<UserData>> {
    try {
      const response = await typedApiClient.post<UserData>("/v1/auth/login", {
        email,
        password,
      });
      return response;
    } catch (error) {
      return {
        success: false,
        data: {} as UserData,
        message: "Erro",
        error_code: 500,
        error_fields: {},
      };
    }
  }

  async logout(): Promise<ApiResponse<null>> {
    return await typedApiClient.post<null>("/v1/auth/logout");
  }
}

export const authService = new AuthService();

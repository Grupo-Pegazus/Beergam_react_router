import type { AxiosInstance } from "axios";
import { apiClient } from "../apiClient/client";
class AuthService {
  private readonly apiClient: AxiosInstance;
  constructor(apiClient: AxiosInstance) {
    this.apiClient = apiClient;
  }
  async login(email: string, password: string) {
    try {
      const response = await this.apiClient.post("/v1/auth/login", {
        email,
        password,
      });
      if (response.status === 200) {
        return { success: true, data: response.data.data.user_data };
      }
      return { success: false, error: response.data.message };
    } catch (err: any) {
      const status = err?.response?.status ?? 500;
      const message = err?.response?.data?.message ?? "Falha de autenticação";
      return { success: false, error: message, status };
    }
  }
  async logout() {}
}
export const authService = new AuthService(apiClient);

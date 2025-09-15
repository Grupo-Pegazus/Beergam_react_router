import type { AxiosInstance } from "axios";
import { apiClient } from "../apiClient/client";
class AuthService {
  private readonly apiClient: AxiosInstance;
  constructor(apiClient: AxiosInstance) {
    this.apiClient = apiClient;
  }
  async login(email: string, password: string) {
    const response = await this.apiClient.post("/v1/auth/login", {
      email: email,
      password: password,
    });
    if (response.status === 200) {
      console.log("response.data.user_data", response.data.data.user_data);
      return { success: true, data: response.data.data.user_data };
    }
    return { success: false, data: {} };
  }
  async logout() {}
}

export const authService = new AuthService(apiClient);

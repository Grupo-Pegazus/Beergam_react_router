import type { AxiosInstance } from "axios";
import { apiClient } from "~/features/apiClient/client";

class MLService {
  private readonly apiClient: AxiosInstance;
  constructor(apiClient: AxiosInstance) {
    this.apiClient = apiClient;
  }
  async getIntegrationData() {
    const response = await this.apiClient.get("/v1/auth/meli/integration_data");
    console.log("response da api: ", response.data);
  }
}

export const mlService = new MLService(apiClient);

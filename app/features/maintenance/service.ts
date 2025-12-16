import type { TMaintenanceStatus, TScreenId } from "./typings";

import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";

class MaintenanceService {
  async fetchMaintenanceStatus(
    screenId: TScreenId
  ): Promise<ApiResponse<TMaintenanceStatus>> {
    const url = `/v1/maintenance/status?screen_id=${screenId}`;
    const response = await typedApiClient.get<TMaintenanceStatus>(url);
    return response as ApiResponse<TMaintenanceStatus>;
  }
}

export const maintenanceService = new MaintenanceService();
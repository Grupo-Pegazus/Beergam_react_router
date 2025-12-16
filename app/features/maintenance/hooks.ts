import { useQuery } from "@tanstack/react-query";
import { maintenanceService } from "./service";
import type { TScreenId } from "./typings";
import type { ApiResponse } from "../apiClient/typings";
import type { TMaintenanceStatus } from "./typings";

export function useMaintenanceCheck(screenId: TScreenId | null) {
  return useQuery<ApiResponse<TMaintenanceStatus>>({
    queryKey: ["maintenance", screenId],
    queryFn: async () => {
      if (!screenId) {
        // Se não tem screenId, retorna que não está em manutenção
        return {
          success: true,
          data: {
            screen_id: "" as TScreenId,
            is_maintenance: false,
            message: "",
          },
          message: "",
        };
      }
      const res = await maintenanceService.fetchMaintenanceStatus(screenId);
      if (!res.success) {
        throw new Error(res.message || "Erro ao verificar status de manutenção");
      }
      return res;
    },
    enabled: !!screenId, // Só executa se tiver screenId
    staleTime: 1000 * 60, // 1 minuto
    retry: false,
  });
}

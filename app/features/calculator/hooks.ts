import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "../apiClient/typings";
import { calculatorService } from "./service";
import type { ISavedCalculation, SaveCalculationPayload } from "./typings";
import toast from "~/src/utils/toast";

const SAVED_CALCULATIONS_KEY = ["calculator", "saved_calculations"] as const;

export function useSavedCalculations() {
  return useQuery<ApiResponse<ISavedCalculation[]>>({
    queryKey: SAVED_CALCULATIONS_KEY,
    queryFn: async () => {
      const res = await calculatorService.listSavedCalculations();
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar cálculos salvos");
      }
      return res;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useSaveCalculation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SaveCalculationPayload) => {
      const res = await calculatorService.saveCalculation(payload);
      if (!res.success) {
        throw new Error(res.message || "Erro ao salvar cálculo");
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAVED_CALCULATIONS_KEY });
      toast.success("Cálculo salvo com sucesso!");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Erro ao salvar cálculo";
      toast.error(message);
    },
  });
}

export function useDeleteSavedCalculation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (calculationId: number) => {
      const res = await calculatorService.deleteSavedCalculation(calculationId);
      if (!res.success) {
        throw new Error(res.message || "Erro ao remover cálculo");
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAVED_CALCULATIONS_KEY });
      toast.success("Cálculo removido com sucesso!");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Erro ao remover cálculo";
      toast.error(message);
    },
  });
}

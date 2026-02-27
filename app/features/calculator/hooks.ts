import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "../apiClient/typings";
import { calculatorService } from "./service";
import type { ISavedCalculation, SaveCalculationPayload } from "./typings";
import toast from "~/src/utils/toast";

export const savedCalculationDetailKey = (id: number) =>
  ["calculator", "saved_calculations", id] as const;

const SAVED_CALCULATIONS_KEY = ["calculator", "saved_calculations"] as const;

export function useSavedCalculations(typeCalculator?: "meli" | "shopee" | "importacao") {
  return useQuery<ApiResponse<ISavedCalculation[]>>({
    queryKey: [...SAVED_CALCULATIONS_KEY, typeCalculator ?? "all"],
    queryFn: async () => {
      const res = await calculatorService.listSavedCalculations(typeCalculator);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar cálculos salvos");
      }
      return res;
    },
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

export function useGetSavedCalculation(calculationId: number) {
  return useQuery<ApiResponse<ISavedCalculation>>({
    queryKey: savedCalculationDetailKey(calculationId),
    queryFn: async () => {
      const res = await calculatorService.getSavedCalculation(calculationId);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar cálculo");
      }
      return res;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateSavedCalculation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      calculationId,
      payload,
    }: {
      calculationId: number;
      payload: Partial<SaveCalculationPayload>;
    }) => {
      const res = await calculatorService.updateSavedCalculation(calculationId, payload);
      if (!res.success) {
        throw new Error(res.message || "Erro ao atualizar cálculo");
      }
      return res;
    },
    onSuccess: (_, { calculationId }) => {
      queryClient.invalidateQueries({ queryKey: SAVED_CALCULATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: savedCalculationDetailKey(calculationId) });
      toast.success("Cálculo atualizado com sucesso!");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Erro ao atualizar cálculo";
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

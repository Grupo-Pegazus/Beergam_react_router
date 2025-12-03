import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { agendamentosService } from "./service";
import type {
  SchedulingFilters,
  SchedulingsResponse,
  SchedulingResponse,
  CreateScheduling,
  UpdateScheduling,
  CancelScheduling,
  ReceiveScheduling,
  SchedulingLogsResponse,
} from "./typings";
import type { ApiResponse } from "../apiClient/typings";
import toast from "~/src/utils/toast";

// Query para listar agendamentos
export function useSchedulings(filters?: Partial<SchedulingFilters>) {
  return useQuery<ApiResponse<SchedulingsResponse>>({
    queryKey: ["schedulings", filters],
    queryFn: async () => {
      const res = await agendamentosService.getSchedulings(filters);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar agendamentos");
      }
      return res;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// Query para buscar agendamento por ID
export function useScheduling(id: string | null) {
  return useQuery<ApiResponse<SchedulingResponse>>({
    queryKey: ["scheduling", id],
    queryFn: async () => {
      if (!id) throw new Error("ID do agendamento é obrigatório");
      const res = await agendamentosService.getScheduling(id);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar agendamento");
      }
      return res;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// Mutation para criar agendamento
export function useCreateScheduling() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateScheduling) => {
      const res = await agendamentosService.createScheduling(data);
      if (!res.success) {
        throw new Error(res.message || "Erro ao criar agendamento");
      }
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["schedulings"] });
      toast.success(data.message || "Agendamento criado com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar agendamento");
    },
  });
}

// Mutation para atualizar agendamento
export function useUpdateScheduling() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateScheduling;
    }) => {
      return (async () => {
        const res = await agendamentosService.updateScheduling(id, data);
        if (!res.success) {
          throw new Error(res.message || "Erro ao atualizar agendamento");
        }
        return res;
      })();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["schedulings"] });
      queryClient.invalidateQueries({ queryKey: ["scheduling"] });
      toast.success(data.message || "Agendamento atualizado com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar agendamento");
    },
  });
}

// Mutation para deletar agendamento
export function useDeleteScheduling() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await agendamentosService.deleteScheduling(id);
      if (!res.success) {
        throw new Error(res.message || "Erro ao deletar agendamento");
      }
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["schedulings"] });
      toast.success(data.message || "Agendamento deletado com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao deletar agendamento");
    },
  });
}

// Mutation para cancelar agendamento
export function useCancelScheduling() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: CancelScheduling;
    }) => {
      return (async () => {
        const res = await agendamentosService.cancelScheduling(id, data);
        if (!res.success) {
          throw new Error(res.message || "Erro ao cancelar agendamento");
        }
        return res;
      })();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["schedulings"] });
      queryClient.invalidateQueries({ queryKey: ["scheduling"] });
      toast.success(data.message || "Agendamento cancelado com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao cancelar agendamento");
    },
  });
}

// Mutation para dar baixa/recebimento
export function useReceiveScheduling() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ReceiveScheduling;
    }) => {
      return (async () => {
        const res = await agendamentosService.receiveScheduling(id, data);
        if (!res.success) {
          throw new Error(res.message || "Erro ao processar baixa");
        }
        return res;
      })();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["schedulings"] });
      queryClient.invalidateQueries({ queryKey: ["scheduling"] });
      toast.success(data.message || "Baixa processada com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao processar baixa");
    },
  });
}

// Query para buscar logs de um agendamento
export function useSchedulingLogs(id: string | null) {
  return useQuery<ApiResponse<SchedulingLogsResponse>>({
    queryKey: ["scheduling-logs", id],
    queryFn: async () => {
      if (!id) throw new Error("ID do agendamento é obrigatório");
      const res = await agendamentosService.getSchedulingLogs(id);
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar logs");
      }
      return res;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}


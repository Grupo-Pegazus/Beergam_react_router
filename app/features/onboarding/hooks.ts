import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authStore from "../store-zustand";
import { isMaster } from "../user/utils";
import type { IUser } from "../user/typings/User";
import { onboardingService } from "./service";
import { OnboardingQuestionsResponseSchema } from "./typings";
import type { IOnboardingSubmitPayload } from "./typings";
import toast from "~/src/utils/toast";

export function useOnboardingQuestions() {
  return useQuery({
    queryKey: ["onboarding", "questions"],
    queryFn: () => onboardingService.getQuestions(),
    select: (res) => {
      if (!res.success || !res.data) return null;
      return OnboardingQuestionsResponseSchema.parse(res.data);
    },
    staleTime: Infinity,
    retry: false,
  });
}

export function useSubmitOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IOnboardingSubmitPayload) =>
      onboardingService.submitAnswers(payload),
    onSuccess: (res) => {
      if (!res.success && !res.data?.onboarding_completed) {
        toast.error(res.message || "Erro ao salvar respostas. Tente novamente.");
        return;
      }

      const currentUser = authStore.getState().user;
      if (currentUser && isMaster(currentUser)) {
        authStore.setState({
          user: {
            ...currentUser,
            onboarding_free_plan_completed: true,
          } as IUser,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["onboarding"] });
    },
    onError: () => {
      toast.error("Erro ao salvar respostas. Tente novamente.");
    },
  });
}

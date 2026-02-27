import type { ApiResponse } from "../apiClient/typings";
import { typedApiClient } from "../apiClient/client";
import type {
  IOnboardingQuestionsResponse,
  IOnboardingSubmitPayload,
  IOnboardingSubmitResponse,
} from "./typings";

class OnboardingService {
  async getQuestions(): Promise<ApiResponse<IOnboardingQuestionsResponse>> {
    return typedApiClient.get<IOnboardingQuestionsResponse>(
      "/v1/onboarding/questions"
    );
  }

  async submitAnswers(
    payload: IOnboardingSubmitPayload
  ): Promise<ApiResponse<IOnboardingSubmitResponse>> {
    return typedApiClient.post<IOnboardingSubmitResponse>(
      "/v1/onboarding/submit",
      payload
    );
  }
}

export const onboardingService = new OnboardingService();

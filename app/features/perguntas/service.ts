import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type {
  Question,
  QuestionsFilters,
  QuestionsListApiResponse,
  QuestionsListResponse,
  QuestionsMetricsApiResponse,
  QuestionsMetricsResponse,
} from "./typings";

class PerguntasService {
  private buildQuery(filters?: Partial<QuestionsFilters>): string {
    if (!filters) return "";

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      params.append(key, String(value));
    });

    return params.toString();
  }

  async list(filters?: Partial<QuestionsFilters>): Promise<QuestionsListApiResponse> {
    const queryString = this.buildQuery(filters);
    const url = `/v1/questions${queryString ? `?${queryString}` : ""}`;
    const response = await typedApiClient.get<QuestionsListResponse>(url);
    return response as QuestionsListApiResponse;
  }

  async get(questionId: string): Promise<ApiResponse<Question>> {
    const response = await typedApiClient.get<Question>(`/v1/questions/${questionId}`);
    return response as ApiResponse<Question>;
  }

  async getMetrics(): Promise<QuestionsMetricsApiResponse> {
    const response = await typedApiClient.get<QuestionsMetricsResponse>("/v1/questions/response_time");
    return response as QuestionsMetricsApiResponse;
  }

  async answer(questionId: string, answer: string): Promise<ApiResponse<unknown>> {
    const response = await typedApiClient.post<unknown>("/v1/questions/answer", {
      question_id: questionId,
      answer,
    });
    return response as ApiResponse<unknown>;
  }
}

export const perguntasService = new PerguntasService();


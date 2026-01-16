import type { ApiResponse } from "../apiClient/typings";

interface From {
  id: string;
  answered_questions: number;
}

interface Answer {
  date_created: string;
  status: string;
  text: string;
}

export enum QuestionStatus {
  ANSWERED = "Respondida",
  UNANSWERED = "Sem resposta",
  BANNED = "Bloqueada",
}

export interface Question {
  id: string;
  text: string;
  answer?: Answer | null;
  status?: QuestionStatus;
  item_id?: string;
  item_title?: string;
  seller_id?: string;
  date_created?: string;
  answer_date?: string | null;
  from?: From;
  [key: string]: unknown;
}

export function getQuestionStatus(status?: string): QuestionStatus {
  return (
    QuestionStatus[status as keyof typeof QuestionStatus] ??
    QuestionStatus.unanswered
  );
}

export interface QuestionsFilters {
  status?: string | null;
  item_id?: string | null;
  seller_id?: string | null;
  text?: string | null;
  date_from?: string | null;
  date_to?: string | null;
  answered?: boolean | null;
  answer_date_from?: string | null;
  answer_date_to?: string | null;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface QuestionsInsights {
  total: number;
  answered: number;
  pending: number;
  avg_response_minutes: number | null;
  sla_within_1h_percent: number | null;
  status_counts: Record<string, number>;
  response_time_buckets: Record<string, number>;
  daily_trend: { date: string; total: number; answered: number }[];
}

export interface QuestionsPagination {
  page: number;
  per_page: number;
  total_count: number;
  total_pages?: number;
}

export interface QuestionsListResponse {
  questions: Question[];
  pagination: QuestionsPagination;
  filters_applied: Partial<QuestionsFilters>;
  insights?: QuestionsInsights;
}

export interface QuestionsMetricsResponse {
  metrics: Record<string, unknown>;
  needs_refresh: boolean;
  scheduled_refresh: boolean;
  insights?: QuestionsInsights;
}

export type QuestionsListApiResponse = ApiResponse<QuestionsListResponse>;
export type QuestionsMetricsApiResponse = ApiResponse<QuestionsMetricsResponse>;

export type AnsweredFilter = "all" | "answered" | "unanswered";

export interface QuestionsFiltersState {
  status: string;
  item_id: string;
  text: string;
  answered: AnsweredFilter;
  date_from?: string;
  date_to?: string;
  page: number;
  per_page: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

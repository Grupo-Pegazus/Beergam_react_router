export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
  error_code?: number;
  error_fields?: Record<string, string[] | undefined> | undefined;
}

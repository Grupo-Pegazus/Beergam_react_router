interface IErrorField<T = unknown> {
  error: "string";
  key: "string";
  value: T;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
  error_code?: number;
  error_fields?: IErrorField[] | undefined;
}
export interface Pagination {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}
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

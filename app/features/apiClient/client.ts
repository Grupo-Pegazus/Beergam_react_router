import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { enforceUsageLimit } from "~/features/auth/utils/accessWindow";
import authStore from "../store-zustand";
import { type ApiResponse } from "./typings";

// Wrapper tipado que garante que todas as respostas sigam o padrão ApiResponse
export class TypedApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string, config?: AxiosRequestConfig) {
    this.client = axios.create({
      baseURL,
      ...config,
    });
  }

  // Método GET tipado
  async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.get(
        url,
        config
      );
      return response.data;
    } catch (error: unknown) {
      return this.handleError(error as AxiosError<ApiResponse<T>>);
    }
  }

  // Método POST tipado
  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.post(
        url,
        data,
        config
      );
      return response.data;
    } catch (error: unknown) {
      return this.handleError(error as AxiosError<ApiResponse<T>>);
    }
  }

  // Método PUT tipado
  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.put(
        url,
        data,
        config
      );
      return response.data;
    } catch (error: unknown) {
      return this.handleError(error as AxiosError<ApiResponse<T>>);
    }
  }

  // Método DELETE tipado
  async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(
        url,
        config
      );
      return response.data;
    } catch (error: unknown) {
      return this.handleError(error as AxiosError<ApiResponse<T>>);
    }
  }

  // Método PATCH tipado
  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.patch(
        url,
        data,
        config
      );
      return response.data;
    } catch (error: unknown) {
      return this.handleError(error as AxiosError<ApiResponse<T>>);
    }
  }

  // Tratamento de erro padronizado
  private handleError<T>(
    error: AxiosError<ApiResponse<unknown>>
  ): ApiResponse<T> {
    console.error("Detalhes do erro:", {
      message: error.message,
      status: error?.response?.status,
      data: error?.response?.data,
      config: error?.config,
    });
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message;
      const errorCode = error.response.data?.error_code ?? status;
      const errorFields = error.response.data?.error_fields ?? {};

      return {
        success: false,
        data: {} as T,
        message,
        error_code: errorCode,
        error_fields: errorFields,
      };
    }
    if (error.request) {
      return {
        success: false,
        data: {} as T,
        message: "Servidor não respondeu. Tente novamente em alguns instantes.",
        error_code: 503,
        error_fields: {},
      };
    }
    return {
      success: false,
      data: {} as T,
      message: "Erro inesperado. Tente novamente em alguns instantes.",
      error_code: 500,
      error_fields: {},
    };
  }

  // Método para adicionar interceptors (mantém compatibilidade)
  get interceptors() {
    return this.client.interceptors;
  }

  // Método para acessar o cliente axios original se necessário
  get axiosInstance(): AxiosInstance {
    return this.client;
  }
}

// Instância tipada do cliente

const API_URL = import.meta.env.VITE_API_URL;

const typedApiClient = new TypedApiClient(API_URL, {
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
let refreshPromise: Promise<ApiResponse<unknown>> | null = null;
typedApiClient.axiosInstance.interceptors.response.use(
  async (response) => {
    console.log("response do interceptor", response);
    return response;
  },
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401) {
      if (
        error.response?.data?.error_code === 1002 &&
        !original._retry &&
        typeof window !== "undefined"
      ) {
        //Verifica se o erro é de access_token expirado e se não foi feito um refresh ainda
        original._retry = true;
        if (!refreshPromise) {
          refreshPromise = typedApiClient
            .post("/v1/auth/refresh")
            .finally(() => {
              refreshPromise = null;
            });
        }
        await refreshPromise;
        return typedApiClient.axiosInstance(original);
      }
      if (error.response?.data?.error_code === 1002) {
        //Deu erro no refresh token
        if (typeof window !== "undefined") {
          authStore.getState().setAuthError("REFRESH_TOKEN_EXPIRED");
        }
      }
    }
    if (error.response?.data?.error_code === 1005) {
      if (typeof window !== "undefined") {
        authStore.getState().setAuthError("REFRESH_TOKEN_REVOKED");
      }
    }
    if (error.response?.status === 403) {
      const body = error.response.data;
      const violationCode = body?.error_code;
      if (violationCode === "INSUFFICIENT_PERMISSIONS") {
        enforceUsageLimit({
          source: "http",
          event_type: "usage_time_limit",
          message: body?.message,
          next_allowed_at: body?.data?.next_allowed_at,
          weekday: body?.data?.weekday,
          reason: body?.data?.reason,
        });
      }
    }

    // console.log("erro do interceptor", error);

    // if (!error.response.data) {
    //   return Promise.reject(error);
    // }
    // if (error.response.data.error_code === 1002) {
    //   console.error("Erro de access_token expirado");
    //   const response = await typedApiClient.post("/v1/auth/refresh");
    //   if (response.success) {
    //     console.log("access_token atualizado");
    //     window.location.reload();
    //     return response;
    //   } else {
    //     console.error("Erro ao atualizar access_token");
    //   }
    // }
    if (error.response?.data?.error_code === 6104) {
      if (typeof window !== "undefined") {
        authStore.getState().setAuthError("SUBSCRIPTION_NOT_FOUND");
      }
    }
    if (error.response?.data?.error_code === 6100) {
      if (typeof window !== "undefined") {
        authStore.getState().setAuthError("SUBSCRIPTION_CANCELLED");
      }
    }

    return Promise.reject(error);
  }
);
typedApiClient.axiosInstance.interceptors.request.use(async (config) => {
  console.log("request do interceptor", config);
  return config;
});
export { typedApiClient };

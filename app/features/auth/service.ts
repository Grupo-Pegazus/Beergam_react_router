import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import { UserRoles, type Subscription } from "../user/typings/BaseUser";
import type { IColab } from "../user/typings/Colab";
import { type IUser } from "../user/typings/User";
import { cryptoAuth } from "./utils";

interface RegisterUser extends IUser {
  password: string;
}

interface LoginResponse {
  user: IUser | IColab;
  subscription: Subscription | null;
}

class AuthService {
  async login(
    formInfo:
      | { email: string; password: string }
      | { pin: string; password: string },
    type: UserRoles
  ): Promise<ApiResponse<LoginResponse>> {
    const role = type === UserRoles.MASTER ? UserRoles.MASTER : UserRoles.COLAB;
    try {
      const loginResponse = await typedApiClient.post<IUser | IColab>(
        `/v1/auth/${role.toLowerCase()}/login`,
        {
          ...formInfo,
        }
      );
      if (loginResponse.success) {
        const subscriptionResponse = await this.getSubscription();
        if (subscriptionResponse.success) {
          cryptoAuth.encriptarDados(subscriptionResponse.data);
          return {
            success: true,
            data: {
              user: loginResponse.data,
              subscription: subscriptionResponse.data,
            },
            message: "Login realizado com sucesso",
          };
        } else {
          return {
            success: false,
            data: {} as LoginResponse,
            message: subscriptionResponse.message,
            error_code: subscriptionResponse.error_code,
            error_fields: subscriptionResponse.error_fields,
          };
        }
      } else {
        return {
          success: false,
          data: {} as LoginResponse,
          message: loginResponse.message,
          error_code: loginResponse.error_code,
          error_fields: loginResponse.error_fields,
        };
      }
    } catch (error) {
      console.error("error do login", error);
      return {
        success: false,
        data: {} as LoginResponse,
        message:
          error instanceof Error
            ? error.message
            : "Erro ao fazer login. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }
  async register(user: RegisterUser): Promise<ApiResponse<IUser>> {
    try {
      const response = await typedApiClient.post<IUser>(
        "/v1/auth/master/register",
        user
      );
      return response;
    } catch (error) {
      console.error("error do register", error);
      return {
        success: false,
        data: {} as IUser,
        message:
          "Erro ao registrar usuário. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }
  async logout(): Promise<ApiResponse<null>> {
    return await typedApiClient.post<null>("/v1/auth/logout");
  }
  async getSubscription(): Promise<ApiResponse<Subscription>> {
    try {
      const response = await typedApiClient.get<Subscription>(
        "/v1/stripe/payments/subscription"
      );
      return response;
    } catch (error) {
      console.error("error do getSubscription", error);
      return {
        success: false,
        data: {} as Subscription,
        message:
          "Erro ao buscar assinatura. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }
  async createColab(
    colab: IColab,
    password: string
  ): Promise<ApiResponse<IColab>> {
    try {
      const body = {
        ...colab,
        password: password.length > 0 ? password : undefined,
      };
      const response = await typedApiClient.post<IColab>(
        "/v1/auth/colab/register",
        body
      );
      return response;
    } catch (error) {
      console.error("error do createColab", error);
      return {
        success: false,
        data: {} as IColab,
        message:
          "Erro ao criar colaborador. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }
}

export const authService = new AuthService();

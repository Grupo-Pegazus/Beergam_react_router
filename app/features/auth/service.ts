import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import { UserRoles, type Subscription } from "../user/typings/BaseUser";
import type { IColab } from "../user/typings/Colab";
import { type IUser } from "../user/typings/User";

interface RegisterUser extends IUser {
  password: string;
}

interface LoginResponse {
  user: IUser | IColab;
  subscription: Subscription | null;
}
interface VerifyTimeColabResponse {
  allowed: boolean;
}
class AuthService {
  async login(
    formInfo:
      | { email: string; password: string }
      | { pin: string; password: string },
    turnstileToken: string,
    type: UserRoles
  ): Promise<ApiResponse<LoginResponse>> {
    const role = type === UserRoles.MASTER ? UserRoles.MASTER : UserRoles.COLAB;
    try {
      const loginResponse = await typedApiClient.post<IUser | IColab>(
        `/v1/auth/${role.toLowerCase()}/login`,
        {
          ...formInfo,
          turnstile_token: turnstileToken,
        }
      );
      if (loginResponse.success) {
        const subscriptionResponse = await this.getSubscription();
        if (subscriptionResponse.success) {
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
  async register(user: RegisterUser, turnstileToken: string): Promise<ApiResponse<IUser>> {
    try {
      const response = await typedApiClient.post<IUser>(
        "/v1/auth/master/register",
        {
          ...user,
          turnstile_token: turnstileToken,
        }
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
        "/v1/payments/subscription"
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
  async verifyTimeColab(
    pin: string,
    master_pin: string,
    role: UserRoles
  ): Promise<ApiResponse<VerifyTimeColabResponse>> {
    try {
      const response = await typedApiClient.get<VerifyTimeColabResponse>(
        `/v1/auth/verify_time_colab?pin=${pin}&master_pin=${master_pin}&role=${role}`
      );
      return response;
    } catch (error) {
      console.error("error do verifyTimeColab", error);
      return {
        success: false,
        data: {} as VerifyTimeColabResponse,
        message:
          "Erro ao verificar tempo de colaborador. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }
}

export const authService = new AuthService();

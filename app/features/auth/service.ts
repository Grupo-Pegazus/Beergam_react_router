import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import { UsuarioRoles, type IUsuario } from "../user/typings";

// Tipagem para os dados de usuário retornados pelo login
interface UserData {
  id: string;
  email: string;
  name: string;
}

interface RegisterUser extends IUsuario {
  password: string;
}

class AuthService {
  async login(
    email: string,
    password: string,
    type: UsuarioRoles
  ): Promise<ApiResponse<UserData>> {
    const role = type === UsuarioRoles.MASTER ? "master" : "colab";
    try {
      const response = await typedApiClient.post<UserData>(
        `/v1/auth/${role}/login`,
        {
          email,
          password,
        }
      );
      return response;
    } catch (error) {
      console.error("error do login", error);
      return {
        success: false,
        data: {} as UserData,
        message: "Erro ao fazer login. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }
  async register(user: RegisterUser): Promise<ApiResponse<IUsuario>> {
    try {
      const response = await typedApiClient.post<IUsuario>(
        "/v1/auth/register",
        user
      );
      return response;
    } catch (error) {
      console.error("error do register", error);
      return {
        success: false,
        data: {} as IUsuario,
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
}

export const authService = new AuthService();

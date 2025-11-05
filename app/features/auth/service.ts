import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import { UserRoles, type IBaseUser } from "../user/typings/BaseUser";
import { type IUser } from "../user/typings/User";

// Tipagem para os dados de usuário retornados pelo login
// interface UserData {
//   id: string;
//   email: string;
//   name: string;
// }

interface RegisterUser extends IUser {
  password: string;
}

class AuthService {
  async login(
    formInfo:
      | { email: string; password: string }
      | { pin: string; password: string },
    type: UserRoles
  ): Promise<ApiResponse<IUser | IBaseUser>> {
    const role = type === UserRoles.MASTER ? UserRoles.MASTER : UserRoles.COLAB;
    try {
      const response = await typedApiClient.post<IUser | IBaseUser>(
        `/v1/auth/${role.toLowerCase()}/login`,
        {
          ...formInfo,
        }
      );
      return response;
    } catch (error) {
      console.error("error do login", error);
      return {
        success: false,
        data: {} as IUser | IBaseUser,
        message: "Erro ao fazer login. Tente novamente em alguns instantes.",
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
}

export const authService = new AuthService();

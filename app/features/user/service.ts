import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type { IUser } from "./typings/User";

class UserService {
  async editUserInformation(editUser: IUser): Promise<ApiResponse<IUser>> {
    try {
      const response = await typedApiClient.patch<IUser>(
        "/v1/users/me/profile",
        editUser
      );
      return response;
    } catch (error) {
      console.error("error do editUserInformation", error);
      return {
        success: false,
        data: {} as IUser,
        message:
          "Erro ao editar informações do usuário. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }
}

export const userService = new UserService();

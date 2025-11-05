import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type { IColab } from "./typings/Colab";
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
  async updateColab(editColab: IColab): Promise<ApiResponse<IColab>> {
    const colabPin = editColab.pin;
    if (!colabPin) {
      return {
        success: false,
        data: {} as IColab,
        message: "Pin do colaborador não encontrado.",
        error_code: 400,
        error_fields: {},
      };
    }
    try {
      const response = await typedApiClient.patch<IColab>(
        `/v1/users/me/colabs/${colabPin}`,
        editColab
      );
      return response;
    } catch (error) {
      console.error("error do editColab", error);
      return {
        success: false,
        data: {} as IColab,
        message:
          "Erro ao editar informações do colaborador. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }
  async getColabs(): Promise<ApiResponse<IColab[]>> {
    try {
      const response = await typedApiClient.get<IColab[]>(
        "/v1/users/me/colabs"
      );
      return response;
    } catch (error) {
      console.error("error do getColabs", error);
      return {
        success: false,
        data: [],
        message:
          "Erro ao buscar colaboradores. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }
}

export const userService = new UserService();

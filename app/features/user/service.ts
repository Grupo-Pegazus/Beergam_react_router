import type {
  InternalUploadResponse,
  InternalUploadService,
} from "~/src/components/utils/upload/types";
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
  async updateColab(
    editColab: IColab,
    password: string
  ): Promise<ApiResponse<IColab>> {
    const colabPin = editColab.pin;
    const body = {
      ...editColab,
      password: password.length > 0 ? password : undefined,
    };
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
        body
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
  async getColabs(): Promise<ApiResponse<Record<string, IColab>>> {
    try {
      const response = await typedApiClient.get<Record<string, IColab>>(
        "/v1/users/me/colabs"
      );
      return response;
    } catch (error) {
      console.error("error do getColabs", error);
      return {
        success: false,
        data: {},
        message:
          "Erro ao buscar colaboradores. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }

  private buildPhotoFormData(file: File): FormData {
    const formData = new FormData();
    formData.append("file", file);
    return formData;
  }

  async uploadColabPhoto(
    colabPin: string,
    file: File
  ): Promise<ApiResponse<InternalUploadResponse>> {
    try {
      const formData = this.buildPhotoFormData(file);
      const response = await typedApiClient.post<InternalUploadResponse>(
        `/v1/users/me/colabs/${colabPin}/photo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("error do uploadColabPhoto", error);
      return {
        success: false,
        data: {} as InternalUploadResponse,
        message:
          "Erro ao enviar foto do colaborador. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }
  async deleteColab(colabPin: string): Promise<ApiResponse<void>> {
    try {
      const response = await typedApiClient.delete<void>(
        `/v1/users/me/colabs/${colabPin}`
      );
      return response;
    } catch (error) {
      console.error("error do deleteColab", error);
      return {
        success: false,
        data: undefined,
        message:
          "Erro ao excluir colaborador. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }
}

export const userService = new UserService();

function assertSuccessfulColabPhotoResponse(
  response: ApiResponse<InternalUploadResponse>
): InternalUploadResponse {
  if (!response.success || !response.data) {
    throw new Error(response.message ?? "Falha ao enviar foto do colaborador.");
  }
  return response.data;
}

export function createColabPhotoUploadService(
  colabPin: string
): InternalUploadService {
  return {
    async upload(files: File[]): Promise<InternalUploadResponse[]> {
      const uploads = await Promise.all(
        files.map((file) => userService.uploadColabPhoto(colabPin, file))
      );

      return uploads.map(assertSuccessfulColabPhotoResponse);
    },
  };
}

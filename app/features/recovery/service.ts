import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";

interface SendRecoveryCodeRequest {
  email: string;
  turnstile_token: string;
}

interface VerifyCodeRequest {
  email: string;
  code: string;
}

interface ResetPasswordRequest {
  email: string;
  code: string;
  new_password: string;
}

class RecoveryService {
  async sendRecoveryCode(
    email: string,
    turnstileToken: string
  ): Promise<ApiResponse<null>> {
    try {
      const payload: SendRecoveryCodeRequest = {
        email,
        turnstile_token: turnstileToken,
      };
      const response = await typedApiClient.post<null>(
        "/v1/recovery/send_code",
        payload
      );
      return response;
    } catch (error) {
      console.error("Erro ao enviar código de recuperação:", error);
      return {
        success: false,
        data: null,
        message:
          "Erro ao enviar código de recuperação. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: undefined,
      };
    }
  }

  async verifyCode(
    email: string,
    code: string
  ): Promise<ApiResponse<null>> {
    try {
      const payload: VerifyCodeRequest = {
        email,
        code,
      };
      const response = await typedApiClient.post<null>(
        "/v1/recovery/verify_code",
        payload
      );
      return response;
    } catch (error) {
      console.error("Erro ao verificar código:", error);
      return {
        success: false,
        data: null,
        message:
          "Erro ao verificar código. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: undefined,
      };
    }
  }

  async resetPassword(
    email: string,
    code: string,
    newPassword: string
  ): Promise<ApiResponse<null>> {
    try {
      const payload: ResetPasswordRequest = {
        email,
        code,
        new_password: newPassword,
      };
      const response = await typedApiClient.post<null>(
        "/v1/recovery/reset_password",
        payload
      );
      return response;
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      return {
        success: false,
        data: null,
        message:
          "Erro ao redefinir senha. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: undefined,
      };
    }
  }
}

export const recoveryService = new RecoveryService();


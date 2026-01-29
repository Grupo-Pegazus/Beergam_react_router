import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type {
  ExternalUploadService,
  ExternalUploadContext,
} from "~/src/components/utils/upload/types";
import type {
  ClientsApiResponse,
  ClientsFilters,
  ClientsResponse,
  ChatMessagesResponse,
  ChatMessagesApiResponse,
} from "./typings";

/**
 * Resposta do backend para upload de anexo de reclamação
 */
interface ClaimAttachmentUploadResponse {
  filename: string;
  user_id: string;
}

class ChatService {
  private buildQuery(filters?: Partial<ClientsFilters>): string {
    if (!filters) return "";

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      params.append(key, String(value));
    });

    return params.toString();
  }

  async getClients(filters?: Partial<ClientsFilters>): Promise<ClientsApiResponse> {
    const queryString = this.buildQuery(filters);
    const url = `/v1/clients${queryString ? `?${queryString}` : ""}`;
    // O backend retorna diretamente um array, então tipamos como Client[]
    const response = await typedApiClient.get<ClientsResponse>(url);
    return response as ClientsApiResponse;
  }

  /**
   * Busca mensagens pós-compra de um pedido específico.
   * Aceita order_id ou pack_id como identificador.
   * 
   * @param orderId - order_id ou pack_id do pedido
   * @returns Resposta com mensagens de chat pós-compra
   */
  async getPosPurchaseMessages(orderId: string): Promise<ChatMessagesApiResponse> {
    // Remove caracteres não numéricos (mesmo padrão do backend)
    const cleanOrderId = orderId.replace(/\D/g, "");
    const url = `/v1/chat/pos-purchase/${cleanOrderId}`;
    const response = await typedApiClient.get<ChatMessagesResponse>(url);
    return response as ChatMessagesApiResponse;
  }

  /**
   * Busca mensagens de uma reclamação específica.
   * 
   * @param claimId - ID da reclamação
   * @returns Resposta com mensagens de chat da reclamação
   */
  async getClaimMessages(claimId: string): Promise<ChatMessagesApiResponse> {
    const url = `/v1/chat/claim/${claimId}`;
    const response = await typedApiClient.get<ChatMessagesResponse>(url);
    return response as ChatMessagesApiResponse;
  }

  /**
   * Busca mensagens de mediação de uma reclamação específica.
   * 
   * @param claimId - ID da reclamação
   * @returns Resposta com mensagens de mediação
   */
  async getMediationMessages(claimId: string): Promise<ChatMessagesApiResponse> {
    const url = `/v1/chat/mediation/${claimId}`;
    const response = await typedApiClient.get<ChatMessagesResponse>(url);
    return response as ChatMessagesApiResponse;
  }

  /**
   * Envia mensagem pós-compra para um pedido.
   * 
   * @param orderId - order_id ou pack_id do pedido
   * @param message - Texto da mensagem
   * @param attachments - Lista opcional de IDs de attachments
   * @returns Resposta com mensagem enviada
   */
  async sendPosPurchaseMessage(
    orderId: string,
    message: string,
    attachments?: string[]
  ): Promise<ChatMessagesApiResponse> {
    const cleanOrderId = orderId.replace(/\D/g, "");
    const url = `/v1/chat/pos-purchase/${cleanOrderId}`;
    const response = await typedApiClient.post<ChatMessagesResponse>(url, {
      message,
      attachments,
    });
    return response as ChatMessagesApiResponse;
  }

  /**
   * Envia mensagem em uma reclamação.
   * 
   * @param claimId - ID da reclamação
   * @param message - Texto da mensagem
   * @param attachments - Lista opcional de filenames de attachments
   * @returns Resposta com mensagem enviada
   */
  async sendClaimMessage(
    claimId: string,
    message: string,
    attachments?: string[]
  ): Promise<ChatMessagesApiResponse> {
    const url = `/v1/chat/claim/${claimId}`;
    const response = await typedApiClient.post<ChatMessagesResponse>(url, {
      message,
      attachments,
    });
    return response as ChatMessagesApiResponse;
  }

  /**
   * Envia mensagem de mediação em uma reclamação.
   * 
   * @param claimId - ID da reclamação
   * @param message - Texto da mensagem
   * @param attachments - Lista opcional de filenames de attachments
   * @returns Resposta com mensagem enviada
   */
  async sendMediationMessage(
    claimId: string,
    message: string,
    attachments?: string[]
  ): Promise<ChatMessagesApiResponse> {
    const url = `/v1/chat/mediation/${claimId}`;
    const response = await typedApiClient.post<ChatMessagesResponse>(url, {
      message,
      attachments,
    });
    return response as ChatMessagesApiResponse;
  }

  private buildAttachmentFormData(file: File): FormData {
    const formData = new FormData();
    formData.append("file", file);
    return formData;
  }

  /**
   * Faz upload de um anexo para uma reclamação.
   * 
   * @param claimId - ID da reclamação
   * @param file - Arquivo para upload
   * @returns Resposta com filename e user_id gerados pelo MELI
   */
  async uploadClaimAttachment(
    claimId: string,
    file: File
  ): Promise<ApiResponse<ClaimAttachmentUploadResponse>> {
    // Valida tipo de arquivo (JPG, PNG ou PDF)
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        data: {} as ClaimAttachmentUploadResponse,
        message: "Tipo de arquivo não permitido. Use JPG, PNG ou PDF",
        error_code: 400,
        error_fields: [],
      };
    }

    // Valida tamanho (máximo 5 MB)
    const maxSize = 5 * 1024 * 1024; // 5 MB em bytes
    if (file.size > maxSize) {
      return {
        success: false,
        data: {} as ClaimAttachmentUploadResponse,
        message: "Arquivo muito grande. Tamanho máximo: 5 MB",
        error_code: 400,
        error_fields: [],
      };
    }

    // Valida nome do arquivo (máximo 125 caracteres, apenas letras, números, pontos, hífens e sublinhados)
    const filename = file.name;
    if (filename.length > 125) {
      return {
        success: false,
        data: {} as ClaimAttachmentUploadResponse,
        message: "Nome do arquivo deve ter no máximo 125 caracteres",
        error_code: 400,
        error_fields: [],
      };
    }

    if (!/^[a-zA-Z0-9_\-.]+$/.test(filename)) {
      return {
        success: false,
        data: {} as ClaimAttachmentUploadResponse,
        message:
          "Nome do arquivo contém caracteres inválidos. Use apenas letras, números, pontos, hífens e sublinhados",
        error_code: 400,
        error_fields: [],
      };
    }

    try {
      const formData = this.buildAttachmentFormData(file);
      const response = await typedApiClient.post<ClaimAttachmentUploadResponse>(
        `/v1/chat/claim/${claimId}/attachments`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("error do uploadClaimAttachment", error);
      return {
        success: false,
        data: {} as ClaimAttachmentUploadResponse,
        message: "Erro ao fazer upload do anexo. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: [],
      };
    }
  }
}

export const chatService = new ChatService();

function assertSuccessfulClaimAttachmentResponse(
  response: ApiResponse<ClaimAttachmentUploadResponse>
): ClaimAttachmentUploadResponse {
  if (!response.success || !response.data) {
    throw new Error(response.message ?? "Falha ao fazer upload do anexo.");
  }
  return response.data;
}

/**
 * Factory function para criar uma instância do serviço de upload de anexos.
 * 
 * @param claimId - ID da reclamação
 * @returns Instância do serviço de upload
 */
export function createClaimAttachmentUploadService(
  claimId: string
): ExternalUploadService<ClaimAttachmentUploadResponse> {
  return {
    async upload(
      files: File[],
      // Parâmetro necessário para a interface ExternalUploadService, mas não utilizado neste serviço
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      context: ExternalUploadContext
    ): Promise<ClaimAttachmentUploadResponse> {
      if (files.length === 0) {
        throw new Error("Nenhum arquivo fornecido para upload");
      }

      // O backend aceita apenas um arquivo por vez
      const file = files[0];
      const response = await chatService.uploadClaimAttachment(claimId, file);
      return assertSuccessfulClaimAttachmentResponse(response);
    },
    extractIds(response: ClaimAttachmentUploadResponse): string[] {
      return [response.filename];
    },
  };
}

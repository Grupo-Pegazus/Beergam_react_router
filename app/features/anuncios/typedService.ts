import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import type { AnuncioBase } from "./typings";

class AnuncioService {
  // Buscar um anúncio específico
  async getAnuncio(anuncioId: string): Promise<ApiResponse<AnuncioBase>> {
    return await typedApiClient.get<AnuncioBase>(`/v1/anuncios/${anuncioId}`);
  }

  // Listar todos os anúncios
  async listAnuncios(): Promise<ApiResponse<AnuncioBase[]>> {
    return await typedApiClient.get<AnuncioBase[]>("/v1/anuncios");
  }

  // Criar um novo anúncio
  async createAnuncio(
    anuncioData: Omit<AnuncioBase, "id">
  ): Promise<ApiResponse<AnuncioBase>> {
    return await typedApiClient.post<AnuncioBase>("/v1/anuncios", anuncioData);
  }

  // Atualizar um anúncio existente
  async updateAnuncio(
    anuncioId: string,
    anuncioData: Partial<AnuncioBase>
  ): Promise<ApiResponse<AnuncioBase>> {
    return await typedApiClient.put<AnuncioBase>(
      `/v1/anuncios/${anuncioId}`,
      anuncioData
    );
  }

  // Deletar um anúncio
  async deleteAnuncio(anuncioId: string): Promise<ApiResponse<null>> {
    return await typedApiClient.delete<null>(`/v1/anuncios/${anuncioId}`);
  }
}

export const anuncioService = new AnuncioService();

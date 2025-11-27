import type { StateStorage } from "zustand/middleware";
import { Crypto } from "../auth/utils";

/**
 * Cria um storage criptografado para Zustand usando a classe Crypto
 * @param storageName Nome único do storage (será usado como chave no localStorage)
 * @returns Objeto StateStorage compatível com Zustand persist middleware
 */
export function createEncryptedStorage(storageName: string): StateStorage {
  // Cria uma instância de Crypto com nomes únicos baseados no storageName
  const crypto = new Crypto<Record<string, unknown>>(
    `${storageName}_encryptionKey`,
    `${storageName}_data`
  );

  return {
    getItem: async (): Promise<string | null> => {
      try {
        // O Zustand passa o mesmo nome, mas usamos nossa instância Crypto
        // que já tem os nomes configurados internamente
        const dados = await crypto.recuperarDados<Record<string, unknown>>();

        if (!dados) {
          return null;
        }

        // Retorna como string JSON para o Zustand
        return JSON.stringify(dados);
      } catch (error) {
        console.error("Erro ao recuperar dados criptografados:", error);
        return null;
      }
    },

    setItem: async (_name: string, value: string): Promise<void> => {
      try {
        // Parseia a string JSON do Zustand
        const dados = JSON.parse(value) as Record<string, unknown>;

        // Criptografa e salva usando a classe Crypto
        await crypto.encriptarDados(dados);
      } catch (error) {
        console.error("Erro ao salvar dados criptografados:", error);
        throw error;
      }
    },

    removeItem: async (): Promise<void> => {
      try {
        // Limpa os dados usando a classe Crypto
        await crypto.limparDados();
      } catch (error) {
        console.error("Erro ao remover dados criptografados:", error);
        throw error;
      }
    },
  };
}

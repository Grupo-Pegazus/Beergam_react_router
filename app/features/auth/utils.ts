import type { IUsuario } from "../user/typings";

class UserCrypto {
  // Função para encriptografar dados do usuário
  async encriptarDadosUsuario(dados: IUsuario): Promise<void> {
    // Gerar uma chave para criptografia
    const chave = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true, // chave exportável
      ["encrypt", "decrypt"]
    );

    // Gerar um vetor de inicialização (IV) - deve ser único para cada operação
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Converter os dados para formato binário
    const encoder = new TextEncoder();
    const dadosBinarios = encoder.encode(JSON.stringify(dados));

    // Criptografar os dados
    const dadosCriptografados = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      chave,
      dadosBinarios
    );

    // Exportar a chave para armazenamento
    const chaveExportada = await window.crypto.subtle.exportKey("raw", chave);

    // Armazenar a chave em um local seguro (ex: sessionStorage)
    sessionStorage.setItem(
      "userEncryptionKey",
      this.arrayBufferToBase64(chaveExportada)
    );

    localStorage.setItem(
      "userInfo",
      this.arrayBufferToBase64(dadosCriptografados)
    );
    localStorage.setItem("userInfoIV", this.arrayBufferToBase64(iv.buffer));
  }

  // Função para descriptografar dados do usuário
  private async descriptografarDadosUsuario(
    dadosCriptografados: ArrayBuffer,
    iv: Uint8Array
  ): Promise<IUsuario> {
    // Recuperar a chave armazenada
    const chaveBase64 = sessionStorage.getItem("userEncryptionKey");
    if (!chaveBase64) {
      throw new Error("Chave de criptografia não encontrada");
    }

    // Importar a chave
    const chaveImportada = await window.crypto.subtle.importKey(
      "raw",
      this.base64ToArrayBuffer(chaveBase64),
      {
        name: "AES-GCM",
        length: 256,
      },
      false,
      ["decrypt"]
    );

    // Descriptografar os dados
    const dadosDecriptados = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv as BufferSource,
      },
      chaveImportada,
      dadosCriptografados
    );

    // Converter os dados binários de volta para texto
    const decoder = new TextDecoder();
    const dadosTexto = decoder.decode(dadosDecriptados);

    return JSON.parse(dadosTexto);
  }

  // Funções auxiliares para converter entre ArrayBuffer e Base64
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  async recuperarDadosUsuario(): Promise<IUsuario | null> {
    try {
      const dadosCriptografadosBase64 = localStorage.getItem("userInfo");
      const ivBase64 = localStorage.getItem("userInfoIV");

      if (!dadosCriptografadosBase64 || !ivBase64) {
        return null;
      }

      const dadosCriptografados = this.base64ToArrayBuffer(
        dadosCriptografadosBase64
      );
      const iv = new Uint8Array(this.base64ToArrayBuffer(ivBase64));

      return await this.descriptografarDadosUsuario(dadosCriptografados, iv);
    } catch (error) {
      console.error("Erro ao recuperar dados do usuário:", error);
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userInfoIV");
      return null;
    }
  }
}

export const userCrypto = new UserCrypto();

// import type { BaseMarketPlace } from "../marketplace/typings";
import type { BaseMarketPlace } from "../marketplace/typings";
import type { IColab } from "../user/typings/Colab";
import type { IUser } from "../user/typings/User";
import type { IAuthState, TAuthError } from "./redux";

// type AvailableData = IUser | BaseMarketPlace; //Tipos de dados que podem ser criptografados

export class Crypto<T> {
  private sessionName: string;
  private localStorageName: string;
  private PLAIN_PREFIX = "PLAINTEXT:";
  constructor(sessionName: string, localStorageName: string) {
    this.sessionName = sessionName;
    this.localStorageName = localStorageName;
  }
  protected arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  protected base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  async encriptarDados(dados: T): Promise<void> {
    // Verificar se estamos no ambiente do cliente
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return;
    }

    // Fallback: sem window/crypto.subtle salva em texto simples
    if (!window.crypto || !window.crypto.subtle) {
      localStorage.setItem(
        this.localStorageName,
        this.PLAIN_PREFIX + JSON.stringify(dados)
      );
      // localStorage.removeItem(this.localStorageName + "IV");
      // if (typeof sessionStorage !== "undefined") {
      //   sessionStorage.removeItem(this.sessionName);
      // }
      return;
    }

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
    localStorage.setItem(
      this.sessionName,
      this.arrayBufferToBase64(chaveExportada)
    );

    localStorage.setItem(
      this.localStorageName,
      this.arrayBufferToBase64(dadosCriptografados)
    );
    localStorage.setItem(
      this.localStorageName + "IV",
      this.arrayBufferToBase64(iv.buffer)
    );
  }
  protected async descriptografarDados(
    dadosCriptografados: ArrayBuffer,
    iv: Uint8Array
  ): Promise<T> {
    if (
      typeof window === "undefined" ||
      typeof localStorage === "undefined" ||
      !window.crypto ||
      !window.crypto.subtle
    ) {
      throw new Error("WebCrypto indisponível");
    }
    // Recuperar a chave armazenada
    const chaveBase64 = localStorage.getItem(this.sessionName);
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
  async recuperarDados<T>(): Promise<T | null> {
    try {
      // Verificar se estamos no ambiente do cliente
      if (
        typeof window === "undefined" ||
        typeof localStorage === "undefined"
      ) {
        return null;
      }

      const armazenado = localStorage.getItem(this.localStorageName);
      if (!armazenado) {
        return null;
      }

      // Fallback: valor salvo em texto simples
      if (armazenado.startsWith(this.PLAIN_PREFIX)) {
        const json = armazenado.slice(this.PLAIN_PREFIX.length);
        return JSON.parse(json) as T;
      }

      const ivBase64 = localStorage.getItem(this.localStorageName + "IV");
      if (!ivBase64) {
        return null;
      }

      if (
        typeof window === "undefined" ||
        !window.crypto ||
        !window.crypto.subtle
      ) {
        // localStorage.removeItem(this.localStorageName);
        // localStorage.removeItem(this.localStorageName + "IV");
        return null;
      }

      const dadosCriptografados = this.base64ToArrayBuffer(armazenado);
      const iv = new Uint8Array(this.base64ToArrayBuffer(ivBase64));
      return (await this.descriptografarDados(dadosCriptografados, iv)) as T;
    } catch (error) {
      console.error("Erro ao recuperar dados:", error);
      this.limparDados();
      return null;
    }
  }
  async limparDados(): Promise<void> {
    // Verificar se estamos no ambiente do cliente
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return;
    }

    localStorage.removeItem(this.localStorageName);
    localStorage.removeItem(this.localStorageName + "IV");
    localStorage.removeItem(this.sessionName);
  }
}

class CryptoAuth extends Crypto<IAuthState> {
  constructor() {
    super("authEncryptionKey", "authInfo");
  }
  async encriptarDados(dados: IAuthState): Promise<void> {
    console.log("encriptando dados do auth", dados);
    await super.encriptarDados(dados);
  }
}

export const cryptoAuth = new CryptoAuth();

class CryptoUser extends Crypto<IUser | IColab> {
  constructor() {
    super("userEncryptionKey", "userInfo");
  }
  async encriptarDados(dados: IUser | IColab): Promise<void> {
    console.log("encriptando dados do user", dados);
    await super.encriptarDados(dados);
  }
}

class CryptoMarketplace extends Crypto<BaseMarketPlace> {
  constructor() {
    super("marketplaceEncryptionKey", "marketplaceInfo");
  }
}

export const cryptoUser = new CryptoUser();

export const cryptoMarketplace = new CryptoMarketplace();

export function isSubscriptionError(error: TAuthError): boolean {
  return (
    error === "SUBSCRIPTION_NOT_FOUND" ||
    error === "SUBSCRIPTION_CANCELLED" ||
    error === "SUBSCRIPTION_NOT_ACTIVE"
  );
}

class CryptoZustand extends Crypto<Record<string, unknown>> {
  constructor() {
    super("zustandEncryptionKey", "zustandInfo");
  }
}

export const cryptoZustand = new CryptoZustand();

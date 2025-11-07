export type InternalUploadResponse = {
  image_id: string;
  image_url: string;
  filename: string;
};

export interface InternalUploadService {
  upload(files: File[]): Promise<InternalUploadResponse[]>;
}

export type ExternalMarketplace = "meli" | "shopee" | (string & {});

export interface ExternalUploadContext {
  marketplace: ExternalMarketplace;
}

export interface ExternalUploadService<ResponseSchema> {
  upload(
    files: File[],
    context: ExternalUploadContext
  ): Promise<ResponseSchema>;
  extractIds(response: ResponseSchema): string[];
}

export interface UploadErrorContext {
  origin: "internal" | "external";
  message: string;
  cause?: unknown;
}


import { typedApiClient } from "~/features/apiClient/client";
import type { InternalUploadResponse, InternalUploadService } from "~/src/components/utils/upload/types";

interface UploadImageResponse {
  count: number;
  uploads: InternalUploadResponse[];
}

interface UploadImageApiResponse {
  data: UploadImageResponse;
  message: string;
  success: boolean;
}

class ProductUploadService implements InternalUploadService {
  async upload(files: File[]): Promise<InternalUploadResponse[]> {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append("file", file);
    });

    const response = await typedApiClient.axiosInstance.post<UploadImageApiResponse>(
      "/v1/products/upload-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const responseData = response.data;

    if (!responseData.success || !responseData.data) {
      throw new Error(responseData.message || "Erro ao fazer upload das imagens");
    }

    return responseData.data.uploads.map((upload) => ({
      image_id: upload.image_id,
      image_url: upload.image_url,
      filename: upload.filename,
    }));
  }
}

export const productUploadService = new ProductUploadService();


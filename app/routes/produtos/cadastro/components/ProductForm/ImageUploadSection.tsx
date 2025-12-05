import { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import Upload from "~/src/components/utils/upload";
import { productUploadService } from "~/features/produtos/services/uploadService";
import { Fields } from "~/src/components/utils/_fields";
import type {
  CreateSimplifiedProduct,
  CreateCompleteProduct,
} from "~/features/produtos/typings/createProduct";

type ImageType = "product" | "marketplace" | "shipping";

export default function ImageUploadSection() {
  const { setValue, watch } = useFormContext<CreateSimplifiedProduct | CreateCompleteProduct>();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<ImageType>("product");
  const previousUploadTypeRef = useRef<ImageType>("product");
  // Usa um objeto para manter uma key única por tipo
  const uploadKeysRef = useRef<Record<ImageType, number>>({
    product: 0,
    marketplace: 0,
    shipping: 0,
  });

  const productImages = watch("product.images.product") || [];
  const marketplaceImages = watch("product.images.marketplace") || [];
  const shippingImages = watch("product.images.shipping") || [];

  const getInitialFilesForUpload = () => {
    switch (uploadType) {
      case "product":
        return productImages;
      case "marketplace":
        return marketplaceImages;
      case "shipping":
        return shippingImages;
      default:
        return [];
    }
  };

  const handleUploadClick = (type: ImageType) => {
    // Se mudou o tipo, incrementa a key para forçar reset do componente Upload
    if (previousUploadTypeRef.current !== type) {
      uploadKeysRef.current[type] = (uploadKeysRef.current[type] || 0) + 1;
      previousUploadTypeRef.current = type;
    }
    setUploadType(type);
    setUploadModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setUploadModalOpen(false);
    // Não incrementa a key aqui para manter o estado quando voltar para o mesmo tipo
  };

  const handleUploadSuccess = () => {
  };

  const handleInternalUpload = (responses: Array<{ image_id: string; image_url: string; filename: string }>) => {
    const currentImages = watch(`product.images.${uploadType}`) || [];
    // Salva as URLs completas das imagens
    const newImageUrls = responses.map((response) => response.image_url);
    const newImages = [...currentImages, ...newImageUrls];
    setValue(`product.images.${uploadType}`, newImages);
    setUploadModalOpen(false);
    // NÃO incrementa a key aqui - queremos preservar o estado para mostrar as fotos já enviadas
  };

  const handleRemoveImage = (type: ImageType, index: number) => {
    const currentImages = watch(`product.images.${type}`) || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    setValue(`product.images.${type}`, newImages);
  };

  const renderImageGrid = (images: string[], type: ImageType, label: string) => {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Fields.label text={label} />
          <button
            type="button"
            onClick={() => handleUploadClick(type)}
            className="px-4 py-2 bg-beergam-blue-primary text-white rounded-lg text-sm font-medium hover:bg-beergam-blue transition-colors"
          >
            Adicionar Imagens
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`${label} ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-beergam-gray-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/150?text=Imagem+${index + 1}`;
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(type, index)}
                className="absolute top-2 right-2 bg-beergam-red text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
          {images.length === 0 && (
            <div className="col-span-4 text-center py-8 text-beergam-gray border border-dashed border-beergam-gray-200 rounded-lg">
              Nenhuma imagem adicionada
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 border-t pt-4">
      <h2 className="text-xl font-semibold text-beergam-blue-primary">
        Imagens do Produto
      </h2>

      {renderImageGrid(productImages, "product", "IMAGENS DO PRODUTO")}
      {renderImageGrid(marketplaceImages, "marketplace", "IMAGENS PARA MARKETPLACE")}
      {renderImageGrid(shippingImages, "shipping", "IMAGENS PARA ENVIO")}

      <Upload
        key={`upload-${uploadType}-${uploadKeysRef.current[uploadType] || 0}`}
        title={`Upload de Imagens - ${uploadType === "product" ? "Produto" : uploadType === "marketplace" ? "Marketplace" : "Envio"}`}
        isOpen={uploadModalOpen}
        onClose={handleCloseModal}
        typeImport="internal"
        service={productUploadService}
        maxFiles={8}
        accept="image/*"
        emptyStateLabel="Arraste e solte ou clique para selecionar imagens"
        draggingLabel="Solte para iniciar o upload"
        onChange={handleUploadSuccess}
        onUploadSuccess={handleUploadSuccess}
        onInternalUpload={handleInternalUpload}
        initialFiles={getInitialFilesForUpload()}
      />
    </div>
  );
}


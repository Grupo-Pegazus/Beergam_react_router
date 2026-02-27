import { useRef, useState } from "react";
import Svg from "~/src/assets/svgs/_index";
import { useSaveCalculation } from "~/features/calculator/hooks";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { Modal } from "~/src/components/utils/Modal";
import { Fields } from "~/src/components/utils/_fields";
import type {
  ImportacaoSimplificadaFormData,
  ImportacaoSimplificadaResult,
} from "../../typings";

interface SaveImportacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputPayload: ImportacaoSimplificadaFormData;
  outputPayload: ImportacaoSimplificadaResult;
}

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp";
const MAX_SIZE_MB = 5;

export default function SaveImportacaoModal({
  isOpen,
  onClose,
  inputPayload,
  outputPayload,
}: SaveImportacaoModalProps) {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const saveCalculation = useSaveCalculation();

  const handleClose = () => {
    setName("");
    setPhoto(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    saveCalculation.reset();
    onClose();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      e.target.value = "";
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPhoto(file);
    setPreviewUrl(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    saveCalculation.mutate(
      {
        name: name.trim(),
        type_calculator: "importacao",
        input_payload: inputPayload as Record<string, unknown>,
        output_payload: outputPayload as Record<string, unknown>,
        photo: photo ?? undefined,
      },
      { onSuccess: handleClose }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Salvar cálculo"
      icon="calculator_solid"
      disableClickAway={saveCalculation.isPending}
    >
      <div className="space-y-4">
        <p className="text-sm text-beergam-typography-secondary">
          Dê um nome para identificar este cálculo nos seus salvos.
        </p>

        <Fields.wrapper>
          <Fields.label text="Nome do cálculo" />
          <Fields.input
            name="calculation-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Ex: "Tênis Nike - Importação"'
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
          />
        </Fields.wrapper>

        <Fields.wrapper>
          <Fields.label text="Foto do produto" hint="Opcional · JPG, PNG ou WebP · máx. 5 MB" />

          {previewUrl ? (
            <div className="relative w-full h-36 rounded-lg overflow-hidden border border-beergam-input-border">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Remover foto"
              >
                <Svg.x width={14} height={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-lg border-2 border-dashed border-beergam-input-border hover:border-beergam-primary bg-beergam-input-background transition-colors cursor-pointer"
            >
              <Svg.camera width={28} height={28} tailWindClasses="text-beergam-typography-tertiary" />
              <span className="text-sm text-beergam-typography-tertiary">
                Clique para selecionar uma imagem
              </span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            className="hidden"
            onChange={handlePhotoChange}
          />
        </Fields.wrapper>

        <div className="flex justify-end gap-2 pt-2">
          <BeergamButton
            title="Cancelar"
            animationStyle="fade"
            mainColor="beergam-gray"
            onClick={handleClose}
            disabled={saveCalculation.isPending}
          />
          <BeergamButton
            title="Salvar"
            animationStyle="slider"
            onClick={handleSave}
            disabled={!name.trim() || saveCalculation.isPending}
            fetcher={{
              fecthing: saveCalculation.isPending,
              completed: saveCalculation.isSuccess,
              error: saveCalculation.isError,
              mutation: saveCalculation,
            }}
          />
        </div>
      </div>
    </Modal>
  );
}

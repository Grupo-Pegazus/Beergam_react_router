import { useRef, useState } from "react";
import Svg from "~/src/assets/svgs/_index";
import { useUpdateSavedCalculation } from "~/features/calculator/hooks";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { Modal } from "~/src/components/utils/Modal";
import { Fields } from "~/src/components/utils/_fields";
import type { ISavedCalculation, SaveCalculationPayload } from "../../typings";

interface UpdateCalculationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updated: ISavedCalculation) => void;
  savedCalculation: ISavedCalculation;
  updatedPayload: Pick<SaveCalculationPayload, "input_payload" | "output_payload">;
}

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp";
const MAX_SIZE_MB = 5;

export default function UpdateCalculationModal({
  isOpen,
  onClose,
  onUpdated,
  savedCalculation,
  updatedPayload,
}: UpdateCalculationModalProps) {
  const [name, setName] = useState(savedCalculation.name);
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(savedCalculation.photo_url);
  const [isExistingPhoto, setIsExistingPhoto] = useState(!!savedCalculation.photo_url);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateCalculation = useUpdateSavedCalculation();

  const handleClose = () => {
    setName(savedCalculation.name);
    setPhoto(null);
    if (!isExistingPhoto && previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(savedCalculation.photo_url);
    setIsExistingPhoto(!!savedCalculation.photo_url);
    updateCalculation.reset();
    onClose();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      e.target.value = "";
      return;
    }

    if (!isExistingPhoto && previewUrl) URL.revokeObjectURL(previewUrl);
    setPhoto(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsExistingPhoto(false);
    e.target.value = "";
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    if (!isExistingPhoto && previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setIsExistingPhoto(false);
  };

  const handleUpdate = () => {
    if (!name.trim()) return;

    updateCalculation.mutate(
      {
        calculationId: savedCalculation.id,
        payload: {
          name: name.trim(),
          ...updatedPayload,
          photo: photo ?? undefined,
        },
      },
      {
        onSuccess: (res) => {
          if (res.data) onUpdated(res.data);
          handleClose();
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Atualizar cálculo"
      icon="calculator_solid"
      disableClickAway={updateCalculation.isPending}
    >
      <div className="space-y-4">
        <p className="text-sm text-beergam-typography-secondary">
          Confirme as alterações antes de salvar.
        </p>

        <Fields.wrapper>
          <Fields.label text="Nome do cálculo" />
          <Fields.input
            name="calculation-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Ex: "Produto X - Shopee"'
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUpdate();
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
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Trocar foto"
              >
                <Svg.camera width={14} height={14} />
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
            disabled={updateCalculation.isPending}
          />
          <BeergamButton
            title="Atualizar"
            animationStyle="slider"
            onClick={handleUpdate}
            disabled={!name.trim() || updateCalculation.isPending}
            fetcher={{
              fecthing: updateCalculation.isPending,
              completed: updateCalculation.isSuccess,
              error: updateCalculation.isError,
              mutation: updateCalculation,
            }}
          />
        </div>
      </div>
    </Modal>
  );
}

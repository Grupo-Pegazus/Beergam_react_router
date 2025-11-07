import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, KeyboardEvent } from "react";
import Svg from "~/src/assets/svgs/_index";
import toast from "react-hot-toast";

import type {
  ExternalMarketplace,
  ExternalUploadService,
  InternalUploadResponse,
  InternalUploadService,
  UploadErrorContext,
} from "./types";

type BaseUploadProps = {
  accept?: string;
    maxFiles?: number;
  onChange?: (ids: string[]) => void;
  onError?: (error: UploadErrorContext) => void;
  onUploadSuccess?: (ids: string[]) => void;
  emptyStateLabel?: string;
  draggingLabel?: string;
};

type InternalUploadProps = BaseUploadProps & {
  typeImport: "internal";
  service: InternalUploadService;
  onInternalUpload?: (files: InternalUploadResponse[]) => void;
};

type ExternalUploadProps<ResponseSchema> = BaseUploadProps & {
  typeImport: "external";
  service: ExternalUploadService<ResponseSchema>;
  marketplace: ExternalMarketplace;
  onExternalUpload?: (payload: ResponseSchema) => void;
};

export type UploadProps<ResponseSchema = unknown> =
  | InternalUploadProps
  | ExternalUploadProps<ResponseSchema>;

type UploadItemStatus = "pending" | "uploading" | "uploaded" | "error";

type UploadItemOrigin = "internal" | "external";

type UploadItem = {
  key: string;
  filename: string;
  previewUrl?: string;
  remoteId?: string;
  status: UploadItemStatus;
  origin: UploadItemOrigin;
  isImage: boolean;
  errorMessage?: string;
  generatedPreview?: boolean;
  file?: File;
};

const DEFAULT_MAX_FILES = 8;
const IMAGE_MIME_PREFIX = "image/";
const FILENAME_TRUNCATE_THRESHOLD = 22;

const KNOWN_IMAGE_EXTENSIONS = new Set([
  "png",
  "jpg",
  "jpeg",
  "webp",
  "gif",
  "bmp",
  "svg",
  "avif",
]);

const STATUS: Record<UploadItemStatus, UploadItemStatus> = {
  pending: "pending",
  uploading: "uploading",
  uploaded: "uploaded",
  error: "error",
};

function truncateFilename(filename: string): string {
  if (filename.length <= FILENAME_TRUNCATE_THRESHOLD) {
    return filename;
  }
  const extensionIndex = filename.lastIndexOf(".");
  if (extensionIndex <= 0) {
    return `${filename.slice(0, FILENAME_TRUNCATE_THRESHOLD - 3)}...`;
  }
  const extension = filename.slice(extensionIndex);
  const base = filename.slice(0, FILENAME_TRUNCATE_THRESHOLD - extension.length - 3);
  return `${base}...${extension}`;
}

function isImageFilename(filename: string): boolean {
  const extensionIndex = filename.lastIndexOf(".");
  if (extensionIndex <= 0) {
    return false;
  }
  const extension = filename.slice(extensionIndex + 1).toLowerCase();
  return KNOWN_IMAGE_EXTENSIONS.has(extension);
}

function buildErrorContext(origin: UploadItemOrigin, cause: unknown): UploadErrorContext {
  const message = cause instanceof Error ? cause.message : "Falha no upload";
  return { origin, message, cause };
}

export default function Upload<ResponseSchema = unknown>(
  props: UploadProps<ResponseSchema>
) {
  const {
    accept,
    maxFiles = DEFAULT_MAX_FILES,
    onChange,
    onError,
    onUploadSuccess,
    emptyStateLabel = "Arraste e solte ou clique para selecionar arquivos",
    draggingLabel = "Solte para iniciar o upload",
  } = props;

  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generatedUrlsRef = useRef(new Set<string>());

  const availableSlots = useMemo(() => {
    if (typeof maxFiles !== "number") {
      return Infinity;
    }
    return Math.max(maxFiles - items.length, 0);
  }, [items.length, maxFiles]);

  useEffect(() => {
    return () => {
      generatedUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      generatedUrlsRef.current.clear();
    };
  }, []);

  const notifyIds = useCallback(
    (nextItems: UploadItem[]) => {
      if (!onChange) {
        return;
      }
      const ids = nextItems
        .filter((item) => item.status === "uploaded" && item.remoteId)
        .map((item) => item.remoteId!)
        .filter(Boolean);
      onChange(ids);
    },
    [onChange]
  );

  const releasePreviewUrl = useCallback((url?: string, generated?: boolean) => {
    if (url && generated && generatedUrlsRef.current.has(url)) {
      URL.revokeObjectURL(url);
      generatedUrlsRef.current.delete(url);
    }
  }, []);

  const appendFiles = useCallback(
    (files: File[], origin: UploadItemOrigin) => {
      if (!files.length) {
        return [] as UploadItem[];
      }

      const nextItems = files.map((file, index) => {
        const key = `${file.name}-${Date.now()}-${index}`;
        const isImage = file.type.startsWith(IMAGE_MIME_PREFIX) || isImageFilename(file.name);
        let previewUrl: string | undefined;
        if (isImage) {
          previewUrl = URL.createObjectURL(file);
          generatedUrlsRef.current.add(previewUrl);
        }
        const item: UploadItem = {
          key,
          filename: file.name,
          previewUrl,
          status: STATUS.pending,
          origin,
          isImage,
          generatedPreview: Boolean(previewUrl),
          file,
        };
        return item;
      });

      setItems((current) => [...current, ...nextItems]);
      return nextItems;
    },
    []
  );

  const awaitingUploadCount = useMemo(
    () =>
      items.reduce((count, item) => {
        if (item.status === "pending" || item.status === "error") {
          return count + 1;
        }
        return count;
      }, 0),
    [items]
  );

  const hasAwaitingUploads = awaitingUploadCount > 0;

  const handleError = useCallback(
    (origin: UploadItemOrigin, cause: unknown, affectedKeys: string[]) => {
      const context = buildErrorContext(origin, cause);
      toast.error(context.message);
      onError?.(context);
      setItems((current) => {
        const next = current.map((item) => {
          if (!affectedKeys.includes(item.key)) {
            return item;
          }
          return {
            ...item,
            status: STATUS.error,
            errorMessage: context.message,
          };
        });
        notifyIds(next);
        return next;
      });
    },
    [notifyIds, onError]
  );

  const uploadInternal = useCallback(
    async (itemsToUpload: UploadItem[]): Promise<string[]> => {
      const keys = itemsToUpload.map((item) => item.key);
      try {
        if (props.typeImport !== "internal") {
          return [];
        }
        if (!itemsToUpload.every((item) => item.file)) {
          throw new Error("Arquivo não encontrado para upload interno.");
        }

        const files = itemsToUpload.map((item) => item.file!);
        const responses = await props.service.upload(files);
        const uploadedIds = responses
          .filter((response) => response && response.image_id)
          .map((response) => response.image_id);
        
        setItems((current) => {
          const next = current.map((item) => {
            const index = keys.indexOf(item.key);
            if (index === -1) {
              return item;
            }
            const response = responses[index];
            if (!response) {
              releasePreviewUrl(item.previewUrl, item.generatedPreview);
              const errorItem: UploadItem = {
                ...item,
              status: STATUS.error,
                errorMessage: "Resposta inválida do serviço",
              };
              return errorItem;
            }
            if (item.generatedPreview) {
              releasePreviewUrl(item.previewUrl, true);
            }
            const nextItem: UploadItem = {
              ...item,
              status: STATUS.uploaded,
              remoteId: response.image_id,
              filename: response.filename,
              previewUrl: response.image_url,
              generatedPreview: false,
              errorMessage: undefined,
              file: undefined,
            };
            return nextItem;
          });
          notifyIds(next);
          return next;
        });
        props.onInternalUpload?.(responses);
        return uploadedIds;
      } catch (cause) {
        handleError("internal", cause, keys);
        throw cause;
      }
    },
    [handleError, notifyIds, props, releasePreviewUrl]
  );

  const uploadExternal = useCallback(
    async (itemsToUpload: UploadItem[]): Promise<string[]> => {
      const keys = itemsToUpload.map((item) => item.key);
      try {
        if (props.typeImport !== "external") {
          return [];
        }
        if (!itemsToUpload.every((item) => item.file)) {
          throw new Error("Arquivo não encontrado para upload externo.");
        }
        const files = itemsToUpload.map((item) => item.file!);
        const response = await props.service.upload(files, {
          marketplace: props.marketplace,
        });
        const ids = props.service.extractIds(response);
        const uploadedIds = ids.filter((id) => Boolean(id));
        
        setItems((current) => {
          const next = current.map((item) => {
            const index = keys.indexOf(item.key);
            if (index === -1) {
              return item;
            }
            const remoteId = ids[index];
            if (!remoteId) {
              const errorItem: UploadItem = {
                ...item,
              status: STATUS.error,
                errorMessage: "ID não retornado pelo serviço",
              };
              return errorItem;
            }
            const nextItem: UploadItem = {
              ...item,
            status: STATUS.uploaded,
              remoteId,
              errorMessage: undefined,
              file: undefined,
            };
            return nextItem;
          });
          notifyIds(next);
          return next;
        });
        props.onExternalUpload?.(response);
        return uploadedIds;
      } catch (cause) {
        handleError("external", cause, keys);
        throw cause;
      }
    },
    [handleError, notifyIds, props]
  );

  const uploadPending = useCallback(async () => {
    const itemsToUpload = items.filter(
      (item) => item.status === "pending" || item.status === "error"
    );
    if (!itemsToUpload.length) {
      toast.error("Nenhum arquivo pendente para upload.");
      return;
    }
    const keys = itemsToUpload.map((item) => item.key);
    setItems((current) =>
      current.map((item) => {
        if (!keys.includes(item.key)) {
          return item;
        }
        return {
          ...item,
          status: STATUS.uploading,
          errorMessage: undefined,
        };
      })
    );
    setIsProcessing(true);
    const loadingToast = toast.loading("Enviando arquivos...");
    try {
      let uploadedIds: string[] = [];
      
      if (props.typeImport === "internal") {
        uploadedIds = await uploadInternal(itemsToUpload);
      } else {
        uploadedIds = await uploadExternal(itemsToUpload);
      }
      
      toast.success("Arquivos enviados com sucesso!", { id: loadingToast });
      onUploadSuccess?.(uploadedIds);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao enviar arquivos.";
      toast.error(message, { id: loadingToast });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [items, props.typeImport, uploadExternal, uploadInternal, onUploadSuccess]);

  const handleFilesSelection = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) {
        return;
      }
      if (availableSlots === 0) {
        toast.error("Limite máximo de arquivos atingido.");
        return;
      }
      const files = Array.from(fileList);
      const allowedFiles = files.slice(0, availableSlots === Infinity ? files.length : availableSlots);
      appendFiles(allowedFiles, props.typeImport);
      toast.success(
        `${allowedFiles.length} arquivo(s) adicionado(s). Clique em "Enviar arquivos" para concluir.`,
        { duration: 3000 }
      );
    },
    [appendFiles, availableSlots, props.typeImport]
  );

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleFilesSelection(event.target.files);
      event.target.value = "";
    },
    [handleFilesSelection]
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      if (!event.dataTransfer.files?.length) {
        return;
      }
      handleFilesSelection(event.dataTransfer.files);
    },
    [handleFilesSelection]
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.currentTarget.contains(event.relatedTarget as Node)) {
      return;
    }
    setIsDragging(false);
  }, []);

  const handleRemove = useCallback(
    (itemKey: string) => {
      setItems((current) => {
        const itemToRemove = current.find((item) => item.key === itemKey);
        if (!itemToRemove) {
          return current;
        }
        const canRemove =
          maxFiles === undefined ||
          maxFiles > 1 ||
          itemToRemove.status === "error" ||
          itemToRemove.status === "pending";
        if (!canRemove && itemToRemove.status === "uploaded") {
          return current;
        }
        const next = current.filter((item) => {
          if (item.key !== itemKey) {
            return true;
          }
          releasePreviewUrl(item.previewUrl, item.generatedPreview);
          return false;
        });
        notifyIds(next);
        return next;
      });
    },
    [maxFiles, notifyIds, releasePreviewUrl]
  );

  const handleRetry = useCallback(
    (itemKey: string) => {
      setItems((current) => {
        return current.map((item) => {
          if (item.key !== itemKey || item.status !== "error") {
            return item;
          }
          return {
            ...item,
            status: STATUS.pending,
            errorMessage: undefined,
          };
        });
      });
    },
    []
  );

  const renderPreviewContent = useCallback(
    (item: UploadItem) => {
      if (item.isImage && item.previewUrl) {
        return (
          <img
            src={item.previewUrl}
            alt={item.filename}
            className="w-full h-full object-cover rounded-lg"
          />
        );
      }
      return (
        <div className="flex h-full w-full items-center justify-center bg-beergam-gray-100 rounded-lg">
          <Svg.document width={40} height={40} tailWindClasses="text-beergam-gray" />
        </div>
      );
    },
    []
  );

  const dropzoneLabel = isDragging ? draggingLabel : emptyStateLabel;

  return (
    <section className="flex w-full flex-col gap-4">
      <div
        className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          isDragging
            ? "border-beergam-blue-primary bg-beergam-blue-primary/5"
            : "border-beergam-gray-200 hover:border-beergam-blue-primary"
        } ${availableSlots === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
        onClick={openFileDialog}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openFileDialog();
          }
        }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-beergam-blue-primary/10 text-beergam-blue-primary">
          <Svg.in_box_stack />
        </div>
        <p className="font-medium text-beergam-blue-primary">{dropzoneLabel}</p>
        <p className="text-sm text-beergam-gray-400">
          {availableSlots !== Infinity && ` Resta${availableSlots > 1 ? "m" : ` `} ${availableSlots} arquivo${availableSlots === 1 ? "" : "s"}`}
        </p>
        <button
          type="button"
          className="mt-2 rounded-lg bg-beergam-blue-primary px-4 py-2 text-sm font-semibold text-white"
          onClick={(event) => {
            event.stopPropagation();
            openFileDialog();
          }}
        >
          Selecionar arquivos
        </button>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          multiple
          accept={accept}
          onChange={handleInputChange}
        />
      </div>

      {items.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <article
                key={item.key}
                className="group relative flex flex-col gap-2 rounded-xl border border-beergam-gray-200 p-3 overflow-hidden"
              >
                <div className="relative h-36 w-full overflow-hidden rounded-lg bg-beergam-gray-50 shrink-0">
                  {renderPreviewContent(item)}
                  {item.status === "uploading" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                      <span className="text-sm">Enviando...</span>
                    </div>
                  )}
                </div>
                <div className="flex items-start justify-between gap-2 min-w-0 shrink-0">
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <span
                      className="text-sm font-medium text-beergam-blue-primary truncate"
                      title={item.filename}
                    >
                      {truncateFilename(item.filename)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {item.status === "error" && (
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-beergam-blue-primary transition-colors hover:bg-beergam-blue-primary/10 hover:text-beergam-blue shrink-0"
                        onClick={() => handleRetry(item.key)}
                        aria-label={`Reenviar ${item.filename}`}
                        title="Reenviar arquivo"
                      >
                        <Svg.arrow_path width={18} height={18} />
                      </button>
                    )}
                    {((maxFiles === undefined || maxFiles > 1) ||
                      item.status === "error" ||
                      item.status === "pending") &&
                      item.status !== "uploaded" && (
                        <button
                          type="button"
                          className="rounded-md p-1.5 text-beergam-gray-400 transition-colors hover:bg-beergam-red/10 hover:text-beergam-red shrink-0"
                          onClick={() => handleRemove(item.key)}
                          aria-label={`Remover ${item.filename}`}
                          title="Remover arquivo"
                        >
                          <Svg.trash width={18} height={18} />
                        </button>
                      )}
                  </div>
                </div>
                {item.errorMessage && (
                    <span
                    className="text-xs text-beergam-red"
                    title={item.errorMessage}
                    >
                        {item.errorMessage}
                    </span>
                )}
              </article>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              {isProcessing && (
                <span className="text-sm text-beergam-gray-500">Processando uploads...</span>
              )}
              <button
                type="button"
                onClick={uploadPending}
                disabled={!hasAwaitingUploads || isProcessing}
                className="rounded-lg bg-beergam-blue-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:bg-beergam-blue disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isProcessing ? "Enviando..." : "Enviar arquivos"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
    );
}
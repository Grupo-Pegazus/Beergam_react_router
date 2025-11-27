import toastLib, {
  type Renderable,
  type Toast,
  type ToastOptions,
  type ValueFunction,
  type ValueOrFunction,
} from "react-hot-toast";
import { formatIsoDateInText } from "./formatters/formatIsoDate";

type ToastContent = Renderable | undefined;

type ToastError = Error | { message?: string } | string;

/**
 * Extrai a mensagem de erro de forma segura de um ToastError
 */
export const getErrorMessage = (err: ToastError): string => {
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === "string") {
    return err;
  }
  return err?.message || "Erro desconhecido";
};

const normalizeRenderable = (value: ToastContent): Renderable | undefined => {
  if (typeof value === "string") {
    return formatIsoDateInText(value);
  }
  return value;
};

const normalizeValueOrFunction = (
  value: ValueOrFunction<Renderable, Toast>
): ValueOrFunction<Renderable, Toast> => {
  if (typeof value === "function") {
    const fn: ValueFunction<Renderable, Toast> = (toast) => {
      const result = value(toast);
      return normalizeRenderable(result) ?? "";
    };
    return fn;
  }
  return normalizeRenderable(value) as Renderable;
};

const normalizeToRenderable = (
  value: ValueOrFunction<Renderable, Toast>
): Renderable => {
  if (typeof value === "function") {
    return value({} as Toast) as Renderable;
  }
  return normalizeRenderable(value) as Renderable;
};

const normalizePromiseSuccess = <T>(
  value: ValueOrFunction<Renderable, T>
): ValueOrFunction<Renderable, unknown> => {
  if (typeof value === "function") {
    return ((data: unknown) => {
      const result = value(data as T);
      const normalized = normalizeRenderable(result);
      return normalized ?? "";
    }) as ValueFunction<Renderable, unknown>;
  }
  return normalizeToRenderable(value);
};

const patchedToast = (
  message: Renderable | undefined,
  options?: ToastOptions
): string => {
  return toastLib(normalizeRenderable(message) ?? "", options);
};

patchedToast.success = (
  message: ValueOrFunction<Renderable, Toast>,
  options?: ToastOptions
) => toastLib.success(normalizeValueOrFunction(message), options);

patchedToast.error = (
  message: ValueOrFunction<Renderable, Toast>,
  options?: ToastOptions
) => toastLib.error(normalizeValueOrFunction(message), options);

patchedToast.loading = (
  message: ValueOrFunction<Renderable, Toast>,
  options?: ToastOptions
) => toastLib.loading(normalizeValueOrFunction(message), options);

patchedToast.custom = (
  renderer: ValueOrFunction<Renderable, Toast>,
  options?: ToastOptions
) => toastLib.custom(normalizeValueOrFunction(renderer), options);

// Função auxiliar que preserva o tipo ToastError no callback
function createErrorHandler(
  errorHandler: ValueOrFunction<Renderable, ToastError>
): ValueOrFunction<Renderable, unknown> {
  if (typeof errorHandler === "function") {
    return ((err: unknown) => {
      // O tipo ToastError é preservado aqui através do cast
      const errorData = err as ToastError;
      const result = errorHandler(errorData);
      return normalizeRenderable(result) ?? "";
    }) as ValueFunction<Renderable, unknown>;
  }
  return normalizeToRenderable(errorHandler);
}

patchedToast.promise = <T>(
  promise: Promise<T>,
  messages: {
    loading: ValueOrFunction<Renderable, Toast>;
    success: ValueOrFunction<Renderable, T>;
    error: ValueOrFunction<Renderable, ToastError>;
  },
  options?: ToastOptions
) => {
  return toastLib.promise(
    promise as unknown as Promise<Toast>,
    {
      loading: normalizeToRenderable(messages.loading),
      success: normalizePromiseSuccess(messages.success) as ValueOrFunction<
        Renderable,
        Toast
      >,
      error: createErrorHandler(messages.error) as ValueOrFunction<
        Renderable,
        Toast
      >,
    },
    options
  );
};

patchedToast.dismiss = toastLib.dismiss;
patchedToast.remove = toastLib.remove;
(
  patchedToast as typeof patchedToast & {
    isActive?: (toastId?: string) => boolean;
  }
).isActive = (
  toastLib as typeof toastLib & { isActive?: (toastId?: string) => boolean }
).isActive;

export default patchedToast;

import toastLib, {
  type Renderable,
  type Toast,
  type ToastOptions,
  type ValueFunction,
  type ValueOrFunction,
} from "react-hot-toast";
import { formatIsoDateInText } from "./formatters/formatIsoDate";

type ToastContent = Renderable | undefined;

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
      return normalizeRenderable(result);
    };
    return fn;
  }
  return normalizeRenderable(value) as Renderable;
};

const patchedToast = (
  message?: Renderable,
  options?: ToastOptions
): string => {
  return toastLib(normalizeRenderable(message), options);
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

patchedToast.promise = <T>(
  promise: Promise<T>,
  messages: {
    loading: ValueOrFunction<Renderable, Toast>;
    success: ValueOrFunction<Renderable, Toast>;
    error: ValueOrFunction<Renderable, Toast>;
  },
  options?: ToastOptions
) =>
  toastLib.promise(
    promise,
    {
      loading: normalizeValueOrFunction(messages.loading),
      success: normalizeValueOrFunction(messages.success),
      error: normalizeValueOrFunction(messages.error),
    },
    options
  );

patchedToast.dismiss = toastLib.dismiss;
patchedToast.remove = toastLib.remove;
patchedToast.isActive = toastLib.isActive;

export default patchedToast;


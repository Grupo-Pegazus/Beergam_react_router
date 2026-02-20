import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { useThemeContext } from "../ThemeProvider/ThemeProvider";

export interface BeergamTurnstileRef {
  getToken: () => string;
  reset: () => void;
}

interface BeergamTurnstileProps {
  onTokenChange?: (token: string) => void;
  onError?: () => void;
  resetTrigger?: number | string;
}

function resolveSiteKey(): string {
  const isProd = import.meta.env.PROD;
  const envVar = isProd
    ? "VITE_TURNSTILE_SITE_KEY_PROD"
    : "VITE_TURNSTILE_SITE_KEY_DEV";
  const key = isProd
    ? import.meta.env.VITE_TURNSTILE_SITE_KEY_PROD
    : import.meta.env.VITE_TURNSTILE_SITE_KEY_DEV;

  if (typeof key !== "string" || key.trim() === "") {
    console.error(
      `[Turnstile] siteKey inválido (tipo: ${typeof key}). Verifique: ${envVar}`
    );
    return "";
  }

  return key.trim();
}

function BeergamTurnstileComponent(
  { onTokenChange, onError, resetTrigger }: BeergamTurnstileProps,
  ref: React.Ref<BeergamTurnstileRef>
) {
  const { theme } = useThemeContext();
  const turnstileRef = useRef<TurnstileInstance>(null);
  const tokenRef = useRef<string>("");

  const siteKey = useMemo(() => resolveSiteKey(), []);

  // Captura o tema no momento da montagem para que mudanças posteriores
  // não destruam e recriem o widget (a lib faz remove+render quando options.theme muda)
  const mountThemeRef = useRef<"dark" | "light">(
    theme === "dark" ? "dark" : "light"
  );

  const turnstileOptions = useMemo(
    () => ({
      theme: mountThemeRef.current,
      size: "flexible" as const,
      language: "pt-br" as const,
    }),
    []
  );

  const handleSuccess = useCallback(
    (token: string) => {
      tokenRef.current = token;
      onTokenChange?.(token);
    },
    [onTokenChange]
  );

  const handleError = useCallback(() => {
    tokenRef.current = "";
    turnstileRef.current?.reset();
    onError?.();
  }, [onError]);

  const handleExpire = useCallback(() => {
    tokenRef.current = "";
    turnstileRef.current?.reset();
  }, []);

  const reset = useCallback(() => {
    tokenRef.current = "";
    turnstileRef.current?.reset();
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      getToken: () => tokenRef.current,
      reset,
    }),
    [reset]
  );

  useEffect(() => {
    if (resetTrigger !== undefined) {
      reset();
    }
  }, [resetTrigger, reset]);

  if (!siteKey) {
    return (
      <div
        style={{
          minHeight: "65px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
          padding: "10px",
        }}
      >
        <div
          style={{ color: "#d32f2f", fontSize: "14px", textAlign: "center" }}
        >
          Erro de configuração: Turnstile siteKey não encontrado.
        </div>
      </div>
    );
  }

  return (
    <Turnstile
      ref={turnstileRef}
      siteKey={siteKey}
      scriptOptions={{
        appendTo: "head",
      }}
      options={turnstileOptions}
      onSuccess={handleSuccess}
      onError={handleError}
      onExpire={handleExpire}
    />
  );
}

export const BeergamTurnstile = forwardRef<
  BeergamTurnstileRef,
  BeergamTurnstileProps
>(BeergamTurnstileComponent);

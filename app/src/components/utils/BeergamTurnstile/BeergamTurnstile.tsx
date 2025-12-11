import { useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from "react";
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

export interface BeergamTurnstileRef {
  getToken: () => string;
  reset: () => void;
}

interface BeergamTurnstileProps {
  onTokenChange?: (token: string) => void;
  onError?: () => void;
  resetTrigger?: number | string;
}

function BeergamTurnstileComponent(
  { onTokenChange, onError, resetTrigger }: BeergamTurnstileProps,
  ref: React.Ref<BeergamTurnstileRef>
) {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const tokenRef = useRef<string>("");

  const siteKey = import.meta.env.PROD 
    ? import.meta.env.VITE_TURNSTILE_SITE_KEY_PROD! 
    : import.meta.env.VITE_TURNSTILE_SITE_KEY_DEV!;

  const handleSuccess = (token: string) => {
    tokenRef.current = token;
    onTokenChange?.(token);
  };

  const handleError = () => {
    tokenRef.current = "";
    turnstileRef.current?.reset();
    onError?.();
  };

  const reset = useCallback(() => {
    tokenRef.current = "";
    turnstileRef.current?.reset();
  }, []);

  useImperativeHandle(ref, () => ({
    getToken: () => tokenRef.current,
    reset,
  }), [reset]);

  useEffect(() => {
    if (resetTrigger !== undefined) {
      reset();
    }
  }, [resetTrigger]);

  return (
    <Turnstile
      ref={turnstileRef}
      siteKey={siteKey}
      options={{
        theme: "light",
        size: "flexible",
        language: "pt-br",
      }}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}

export const BeergamTurnstile = forwardRef<BeergamTurnstileRef, BeergamTurnstileProps>(
  BeergamTurnstileComponent
);

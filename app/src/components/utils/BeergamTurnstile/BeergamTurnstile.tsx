import { useRef, useEffect, useImperativeHandle, forwardRef, useCallback, useState } from "react";
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

function isTurnstileLoaded(): boolean {
  if (typeof window === 'undefined') return false;
  const windowWithTurnstile = window as Window & { turnstile?: unknown };
  return typeof windowWithTurnstile.turnstile !== 'undefined';
}

function waitForTurnstile(maxAttempts = 50, interval = 100): Promise<boolean> {
  return new Promise((resolve) => {
    if (isTurnstileLoaded()) {
      resolve(true);
      return;
    }

    let attempts = 0;
    const checkInterval = setInterval(() => {
      attempts++;
      if (isTurnstileLoaded()) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        resolve(false);
      }
    }, interval);
  });
}

function BeergamTurnstileComponent(
  { onTokenChange, onError, resetTrigger }: BeergamTurnstileProps,
  ref: React.Ref<BeergamTurnstileRef>
) {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const tokenRef = useRef<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const siteKey = import.meta.env.PROD 
    ? import.meta.env.VITE_TURNSTILE_SITE_KEY_PROD! 
    : import.meta.env.VITE_TURNSTILE_SITE_KEY_DEV!;

  // Aguardar o carregamento do Turnstile
  useEffect(() => {
    waitForTurnstile(50, 100).then((loaded) => {
      if (loaded) {
        setIsLoaded(true);
        setLoadError(false);
      } else {
        setLoadError(true);
        console.error('Turnstile não foi carregado após múltiplas tentativas');
        onError?.();
      }
    });
  }, [onError]);

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
    if (resetTrigger !== undefined && isLoaded) {
      reset();
    }
  }, [resetTrigger, isLoaded, reset]);

  // Mostrar espaço reservado enquanto carrega
  if (!isLoaded && !loadError) {
    return (
      <div 
        className="cf-turnstile" 
        style={{ 
          minHeight: '65px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '100%'
        }}
        aria-label="Carregando verificação de segurança"
      >
        <div style={{ color: '#666', fontSize: '14px' }}>Carregando verificação...</div>
      </div>
    );
  }

  // Mostrar erro se não carregar
  if (loadError) {
    return (
      <div 
        className="cf-turnstile-error" 
        style={{ 
          minHeight: '65px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '100%',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          padding: '10px'
        }}
      >
        <div style={{ color: '#d32f2f', fontSize: '14px', textAlign: 'center' }}>
          Erro ao carregar verificação de segurança. Por favor, recarregue a página.
        </div>
      </div>
    );
  }

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

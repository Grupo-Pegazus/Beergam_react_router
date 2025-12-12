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

// Função para carregar o script do Turnstile manualmente se necessário
function loadTurnstileScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Verificar se já está carregado
    if (typeof window !== 'undefined') {
      const windowWithTurnstile = window as Window & { turnstile?: unknown };
      if (typeof windowWithTurnstile.turnstile !== 'undefined') {
        resolve();
        return;
      }
    }

    // Verificar se o script já existe no DOM
    const existingScript = document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]');
    if (existingScript) {
      // Aguardar o script carregar
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Erro ao carregar script do Turnstile')));
      return;
    }

    // Carregar o script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Erro ao carregar script do Turnstile'));
    document.head.appendChild(script);
  });
}

function isTurnstileLoaded(): boolean {
  if (typeof window === 'undefined') return false;
  const windowWithTurnstile = window as Window & { turnstile?: unknown };
  return typeof windowWithTurnstile.turnstile !== 'undefined';
}

function waitForTurnstile(maxAttempts = 100, interval = 100): Promise<boolean> {
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


  const getSiteKey = (): string => {
    const prodKey = import.meta.env.VITE_TURNSTILE_SITE_KEY_PROD;
    const devKey = import.meta.env.VITE_TURNSTILE_SITE_KEY_DEV;
    
    const isProd = import.meta.env.PROD;
    const key = isProd ? prodKey : devKey;
    
    // Debug: log das variáveis de ambiente
    if (import.meta.env.DEV) {
      console.log('[Turnstile Debug]', {
        isProd,
        prodKey: prodKey ? `${prodKey.substring(0, 10)}...` : 'undefined',
        devKey: devKey ? `${devKey.substring(0, 10)}...` : 'undefined',
        selectedKey: key ? `${key.substring(0, 10)}...` : 'undefined',
        keyType: typeof key,
      });
    }
    
    if (typeof key !== 'string' || key.trim() === '') {
      console.error(
        `[Turnstile] siteKey inválido. Verifique a variável de ambiente: ${
          isProd 
            ? 'VITE_TURNSTILE_SITE_KEY_PROD' 
            : 'VITE_TURNSTILE_SITE_KEY_DEV'
        }`
      );
      return '';
    }
    
    return key;
  };

  const siteKey = getSiteKey();

  // Carregar o script e aguardar o Turnstile estar disponível
  useEffect(() => {
    let isMounted = true;
    
    if (import.meta.env.DEV) {
      console.log('[Turnstile] Iniciando carregamento...');
    }
    
    // Primeiro, tentar carregar o script manualmente
    loadTurnstileScript()
      .then(() => {
        if (import.meta.env.DEV) {
          console.log('[Turnstile] Script carregado, aguardando API...');
        }
        // Depois, aguardar o Turnstile estar disponível
        return waitForTurnstile(100, 100);
      })
      .then((loaded) => {
        if (!isMounted) return;
        
        if (import.meta.env.DEV) {
          console.log('[Turnstile] Status:', loaded ? 'Carregado com sucesso' : 'Falhou ao carregar');
        }
        
        if (loaded) {
          setIsLoaded(true);
          setLoadError(false);
        } else {
          setLoadError(true);
          console.error('[Turnstile] Não foi carregado após múltiplas tentativas');
          onError?.();
        }
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error('[Turnstile] Erro ao carregar:', error);
        setLoadError(true);
        onError?.();
      });
    
    return () => {
      isMounted = false;
    };
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

  if (loadError || !siteKey) {
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
          {!siteKey 
            ? 'Erro de configuração: Turnstile siteKey não encontrado.'
            : 'Erro ao carregar verificação de segurança. Por favor, recarregue a página.'}
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

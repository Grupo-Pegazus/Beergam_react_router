import type { ComponentType, PropsWithChildren, ReactNode } from "react";

interface AsyncBoundaryProps extends PropsWithChildren {
  isLoading?: boolean;
  error?: unknown;
  Skeleton?: ComponentType | null;
  ErrorFallback?:
    | ComponentType<{ error?: unknown }>
    | ((props: { error: unknown }) => ReactNode)
    | null;
}

export default function AsyncBoundary({
  isLoading,
  error,
  Skeleton,
  ErrorFallback,
  children,
}: AsyncBoundaryProps) {
  if (isLoading && Skeleton) {
    return <Skeleton />;
  }
  if (error && ErrorFallback) {
    // ErrorFallback pode ser um componente React ou uma função render
    // Ambos podem ser renderizados como componente passando props
    const ErrorComponent = ErrorFallback as ComponentType<{ error?: unknown }>;

    // Tenta renderizar como componente primeiro (funciona para ambos os casos)
    try {
      return <ErrorComponent error={error} />;
    } catch {
      // Se falhar, tenta chamar como função render
      const ErrorFunction = ErrorFallback as (props: {
        error: unknown;
      }) => ReactNode;
      return <>{ErrorFunction({ error })}</>;
    }
  }
  return <>{children}</>;
}

import type { PropsWithChildren, ReactNode } from "react";

interface AsyncBoundaryProps extends PropsWithChildren {
  isLoading?: boolean;
  error?: unknown;
  Skeleton?: React.ComponentType | null;
  ErrorFallback?: ((props: { error: unknown }) => ReactNode) | null;
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
    return <>{ErrorFallback({ error })}</>;
  }
  return <>{children}</>;
}



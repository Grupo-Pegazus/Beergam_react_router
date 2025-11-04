import { useCallback, useEffect, useState } from "react";

export function useOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const open = useCallback(() => {
    setShouldRender(true);
    setTimeout(() => {
      setIsOpen(true);
    }, 10);
  }, []);

  const requestClose = useCallback((onAfter?: () => void) => {
    setIsOpen(false);
    // tempo deve casar com duration das transições
    const t = setTimeout(() => {
      setShouldRender(false);
      onAfter?.();
    }, 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    return () => setShouldRender(false);
  }, []);

  return { isOpen, shouldRender, open, requestClose } as const;
}



import { useCallback, useEffect, useRef, useState } from "react";

export function useOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const open = useCallback(() => {
    setShouldRender(true);
    setTimeout(() => {
      setIsOpen(true);
    }, 10);
  }, []);

  const requestClose = useCallback((onAfter?: () => void) => {
    setIsOpen(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setShouldRender(false);
      if (typeof onAfter === "function") {
        onAfter();
      }
      timeoutRef.current = null;
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setShouldRender(false);
    };
  }, []);

  return { isOpen, shouldRender, open, requestClose } as const;
}



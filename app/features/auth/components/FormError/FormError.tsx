import { useLayoutEffect, useRef, useState } from "react";
import Svg from "~/src/assets/svgs";

export default function FormError({
  error,
  error_code,
  trigger,
}: {
  error: string;
  error_code: number;
  trigger?: number;
}) {
  const [opacity, setOpacity] = useState<string>("opacity-0");
  const timeoutRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    // Limpa o timeout anterior se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (error.length > 0) {
      setOpacity("opacity-100");
      timeoutRef.current = window.setTimeout(() => {
        setOpacity("opacity-0");
        timeoutRef.current = null;
      }, 2000);
    }

    // Cleanup function para limpar o timeout quando o componente for desmontado
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [error, trigger]);

  return (
    <div
      className={`text-beergam-white flex flex-col gap-2 bg-beergam-red-primary p-2 rounded-[5px] transition-opacity duration-300 ${opacity} fixed top-2 right-2 ${opacity}`}
    >
      <div className="flex gap-2 items-center">
        <Svg.alert />
        <p>{error}</p>
      </div>
      <p className="text-[10px]">
        <u>Error code: {error_code}</u>
      </p>
    </div>
  );
}

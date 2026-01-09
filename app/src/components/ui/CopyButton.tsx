import { useEffect, useRef, useState } from "react";
import Svg from "~/src/assets/svgs/_index";
import toast from "~/src/utils/toast";

interface CopyButtonProps {
  textToCopy: string;
  successMessage?: string;
  className?: string;
  iconSize?: string;
  ariaLabel?: string;
  solid?: boolean;
}

export default function CopyButton({
  textToCopy,
  successMessage = "Copiado para a área de transferência",
  className = "flex items-center gap-1 text-beergam-typography-primary hover:text-beergam-typography-primary/60",
  iconSize = "h-3.5 w-3.5 md:h-4 md:w-4",
  ariaLabel = "Copiar",
  solid = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const copyIconIdRef = useRef(
    `copy-icon-${Math.random().toString(36).substr(2, 9)}`
  );
  const checkIconIdRef = useRef(
    `check-icon-${Math.random().toString(36).substr(2, 9)}`
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (copied) setCopied(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    toast.success(successMessage);
    setCopied(true);
  };

  return (
    <>
      <style>
        {`
          #${copyIconIdRef.current} path {
            stroke-dasharray: 50;
            stroke-dashoffset: ${copied ? -50 : 0};
            transition: all 300ms ease-in-out;
          }
          #${checkIconIdRef.current} path {
            stroke-dasharray: 50;
            stroke-dashoffset: ${copied ? 0 : -50};
            transition: all 300ms ease-in-out;
          }
        `}
      </style>
      <button
        className={className}
        onClick={handleCopy}
        aria-label={ariaLabel}
        type="button"
      >
        <div className="relative" style={{ width: "1em", height: "1em" }}>
          {solid ? (
            <div
              className="absolute top-0 left-0"
              style={{
                opacity: copied ? 0 : 1,
                transform: copied ? "scale(0.8)" : "scale(1)",
                transition: "all 300ms ease-in-out",
              }}
            >
              <Svg.copy_solid tailWindClasses={iconSize} />
            </div>
          ) : (
            <div className="absolute top-0 left-0" id={copyIconIdRef.current}>
              <Svg.copy tailWindClasses={iconSize} />
            </div>
          )}
          <div
            className="absolute top-0 left-0"
            id={checkIconIdRef.current}
            style={{
              opacity: copied ? 1 : 0,
              transition: "opacity 300ms ease-in-out",
            }}
          >
            <Svg.check_solid
              tailWindClasses={iconSize}
              className={copied ? "text-green-500" : "text-slate-500"}
            />
          </div>
        </div>
      </button>
    </>
  );
}

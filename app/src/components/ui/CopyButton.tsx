import Svg from "~/src/assets/svgs/_index";
import toast from "~/src/utils/toast";

interface CopyButtonProps {
  textToCopy: string;
  successMessage?: string;
  className?: string;
  iconSize?: string;
  ariaLabel?: string;
}

export default function CopyButton({
  textToCopy,
  successMessage = "Copiado para a área de transferência",
  className = "flex items-center gap-1 text-slate-500 hover:text-slate-700",
  iconSize = "h-3.5 w-3.5 md:h-4 md:w-4",
  ariaLabel = "Copiar",
}: CopyButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    toast.success(successMessage);
  };

  return (
    <button
      className={className}
      onClick={handleCopy}
      aria-label={ariaLabel}
      type="button"
    >
      <Svg.copy tailWindClasses={iconSize} />
    </button>
  );
}


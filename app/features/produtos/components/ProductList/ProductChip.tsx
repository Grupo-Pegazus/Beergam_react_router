interface ProductChipProps {
  label: string;
  onClick?: (() => void) | null;
  className?: string;
  variant?: "rounded" | "circle";
}

export default function ProductChip({
  label,
  onClick,
  className,
  variant = "circle",
}: ProductChipProps) {
  return (
    <button
      onClick={onClick ?? undefined}
      className={`${
        onClick ? "cursor-pointer hover:opacity-75" : "cursor-default!"
      } ${
        variant === "circle"
          ? "rounded-full size-8 aspect-square"
          : "rounded-md p-1 px-2 font-medium"
      } bg-beergam-primary inline-flex border border-transparent text-beergam-white items-center justify-center ${className}`}
    >
      {label}
    </button>
  );
}

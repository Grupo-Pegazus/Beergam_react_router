interface SecondaryButtonProps {
  children: React.ReactNode;
  onSelect: () => void;
  isSelected: boolean;
  selectColor?: string | null;
}

export default function SecondaryButton({
  children,
  onSelect,
  isSelected,
  selectColor,
}: SecondaryButtonProps) {
  const color = selectColor || "beergam-primary";
  return (
    <button
      className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 min-h-[36px] touch-manipulation ${`hover:${color}/95`} ${isSelected ? `bg-${color} text-white shadow-md` : "bg-beergam-button-background-primary text-beergam-typography-secondary hover:text-beergam-white"}`}
      onClick={onSelect}
    >
      {children}
    </button>
  );
}

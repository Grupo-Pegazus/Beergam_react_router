export default function ColabItem({
  children,
  active,
  onClick,
  canInteract = false,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick?: () => void;
  canInteract?: boolean;
}) {
  return (
    <button
      onClick={canInteract ? onClick : undefined}
      type="button"
      className={`border ${canInteract ? "cursor-pointer!" : "cursor-default! pointer-events-none"} w-full rounded-md px-3 py-2 text-sm flex items-center justify-between relative ${
        active
          ? "border-beergam-primary text-beergam-primary"
          : "border-beergam-typography-secondary text-beergam-typography-secondary"
      }`}
    >
      {children}
    </button>
  );
}

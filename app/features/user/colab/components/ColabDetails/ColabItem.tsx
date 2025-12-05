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
          ? "border-beergam-blue-primary text-beergam-blue-primary"
          : "border-beergam-gray-light text-beergam-gray"
      }`}
    >
      {children}
    </button>
  );
}

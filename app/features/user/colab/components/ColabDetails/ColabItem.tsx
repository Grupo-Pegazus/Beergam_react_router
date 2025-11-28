export default function ColabItem({
  children,
  active,
}: {
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <div
      className={`border rounded-md px-3 py-2 text-sm flex items-center justify-between ${
        active
          ? "border-beergam-blue-primary text-beergam-blue-primary"
          : "border-beergam-gray-light opacity-70"
      }`}
    >
      {children}
    </div>
  );
}

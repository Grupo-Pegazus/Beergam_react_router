function generateUserInitials(name: string): string {
  if (!name) return "";
  const names = name.trim().split(/\s+/);
  if (names.length > 1) {
    // Nome composto: pega primeira letra do primeiro (maiúscula) e do segundo (minúscula)
    const first = names[0][0]?.toUpperCase() ?? "";
    const second = names[1][0]?.toLowerCase() ?? "";
    return `${first}${second}`;
  } else {
    // Nome simples: pega primeira letra (maiúscula) e última (minúscula)
    const onlyName = names[0];
    const first = onlyName[0]?.toUpperCase() ?? "";
    const last = onlyName[onlyName.length - 1]?.toLowerCase() ?? "";
    return `${first}${last}`;
  }
}

export default function UserPhoto({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  const initials = name ? generateUserInitials(name) : "";

  return (
    <div
      className={`size-20 rounded-full bg-beergam-primary border border-beergam-white text-beergam-white flex items-center justify-center ${className ?? ""}`}
    >
      <h4 className="text-xl font-semibold">{initials}</h4>
    </div>
  );
}

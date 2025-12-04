export default function ConfigSectionComponent({
  children,
  menuOpen,
}: {
  children: React.ReactNode;
  menuOpen: boolean;
}) {
  return (
    <div
      className={`${menuOpen ? "translate-y-[400px]" : "translate-y-0"} md:translate-y-0! flex flex-col w-full gap-4 items-center max-h-[calc(100vh-70px)] overflow-scroll`}
    >
      <div className="grid gap-4 md:w-[90%] w-full">{children}</div>
    </div>
  );
}

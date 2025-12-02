export default function ConfigSectionComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full gap-4 items-center max-h-[calc(100vh-70px)] overflow-scroll">
      <div className="grid gap-4 md:w-[90%] w-full">{children}</div>
    </div>
  );
}

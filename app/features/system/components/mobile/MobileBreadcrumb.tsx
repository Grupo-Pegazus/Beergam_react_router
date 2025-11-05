import SystemBreadcrumb from "~/features/system/components/Breadcrumb";

export default function MobileBreadcrumb() {
  return (
    <div className="md:hidden fixed top-0 inset-x-0 z-1000 bg-white/95 backdrop-blur border-b border-black/10">
      <div className="h-12 flex items-center px-3">
        <div className="truncate text-[20px] leading-6">
          <SystemBreadcrumb />
        </div>
      </div>
    </div>
  );
}
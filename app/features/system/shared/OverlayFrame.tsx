import Svg from "~/src/assets/svgs";
import MobilePortal from "../components/mobile/Portal";

export default function OverlayFrame({
  title,
  isOpen,
  shouldRender,
  onRequestClose,
  children,
}: {
  title: string;
  isOpen: boolean;
  shouldRender: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
}) {
  if (!shouldRender) return null;
  
  return (
    <MobilePortal>
      <div className="fixed inset-0 z-1100 md:hidden">
        <div
          className={[
            "absolute inset-0 bg-black/40 transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
          onClick={onRequestClose}
        />
        <section
          className={[
            "absolute inset-x-0 bottom-0 top-0 bg-white flex flex-col transition-transform duration-300 ease-out will-change-transform",
            isOpen ? "translate-y-0" : "translate-y-full",
          ].join(" ")}
        >
          <header className="p-4 border-b border-black/10 flex items-center justify-between bg-beergam-blue-primary text-white">
            <h2 className="text-base font-semibold">{title}</h2>
            <button
              type="button"
              aria-label="Fechar"
              onClick={onRequestClose}
            >
              <Svg.x width={24} height={24} tailWindClasses="text-white" />
            </button>
          </header>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </section>
      </div>
    </MobilePortal>
  );
}



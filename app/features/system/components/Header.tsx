import beergam_flower_logo from "~/src/img/beergam_flower_logo.webp";
import AccountView from "~/features/menu/components/Menu/AccountView";

export default function SystemHeader() {
    return (
      <header
        className="fixed top-0 left-0 right-0 h-14 z-1001 text-white border-b border-black/15 shadow-layout-primary bg-beergam-blue-primary"
      >
        <div className="mx-auto px-4 py-[10px] flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div
              aria-label="Beergam"
              className="flex items-center gap-2"
            >
              <div className="flex items-end">
                <img src={beergam_flower_logo} alt="Beergam" className="w-[28px] h-[28px] object-contain" />
                <span className="text-[18px] font-bold text-beergam-white">eergam</span>
              </div>
            </div> 
          </div>
          <div className="flex items-center gap-3">
            <AccountView expanded={true} />
          </div>
        </div>
      </header>
    );
}
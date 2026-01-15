// import { Tooltip } from "react-tooltip";
// import Svg from "~/src/assets/svgs/_index";
import AccountView from "./AccountView";
export default function HeaderDesktop() {
  return (
    <header className="hidden md:block fixed top-0 md:relative left-0 right-0 h-14 z-1001 text-white bg-beergam-menu-background">
      <div className="mx-auto px-4 py-[10px] flex items-center gap-3 justify-end">
        <div className="flex items-center justify-center gap-5">
          {/* <button
            type="button"
            aria-label="Notificações"
            data-tooltip-id="header-notifications-tooltip"
            data-tooltip-content="Notificações"
            className="grid place-items-center"
          >
            <Svg.bell tailWindClasses="size-4.5" />
          </button>
          <Tooltip id="header-notifications-tooltip" place="bottom" />

          <button
            type="button"
            aria-label="Novidades"
            data-tooltip-id="header-news-tooltip"
            data-tooltip-content="Novidades do sistema"
            className="grid place-items-center"
          >
            <Svg.megaphone tailWindClasses="size-4.5" />
          </button>
          <Tooltip id="header-news-tooltip" place="bottom" />

          <button
            type="button"
            aria-label="Ajuda"
            data-tooltip-id="header-help-tooltip"
            data-tooltip-content="Ajuda e documentação"
            className="grid place-items-center"
          >
            <Svg.question tailWindClasses="size-4.5" />
          </button>
          <Tooltip id="header-help-tooltip" place="bottom" /> */}

          <AccountView expanded={true} />
        </div>
      </div>
    </header>
  );
}

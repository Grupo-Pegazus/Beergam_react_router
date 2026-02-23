import React, { useEffect, useState } from "react";
import Svg from "~/src/assets/svgs/_index";
import { getIcon } from "~/features/menu/utils";

const WHATSAPP_COMMUNITY_LINK =
  "https://chat.whatsapp.com/FkRg6rgM047C1zdTnekvSF";

interface ConteudoMenuItemProps {
  isMenuExpanded?: boolean;
}

export default function ConteudoMenuItem({
  isMenuExpanded = true,
}: ConteudoMenuItemProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isMenuExpanded) {
      setOpen(false);
    }
  }, [isMenuExpanded]);

  const icon = getIcon("megaphone");

  return (
    <li className="relative w-full">
      <button
        type="button"
        className={[
          "w-full text-left bg-transparent relative flex items-center rounded-[5px]",
          "text-white/50 border border-transparent hover:text-white hover:border-white/70",
          "h-11 w-[30px] group-hover:w-full justify-center group-hover:justify-start pl-0 group-hover:pl-2 pr-0 group-hover:pr-8",
          "transition-[width,padding,color,border-color] duration-200",
          open ? "border-white text-beergam-orange! bg-beergam-orange/10!" : "",
        ].join(" ")}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="w-[26px] h-[26px] shrink-0 flex-none">
          {icon ? React.createElement(icon, {}) : null}
        </div>
        <div className="w-[10px] h-[10px] rounded-full absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-beergam-green!" />
        <span className="inline-block ml-0 group-hover:ml-3 text-[18px] w-0 opacity-0 overflow-hidden whitespace-nowrap transition-[margin,width,opacity] duration-200 group-hover:w-auto group-hover:opacity-100">
          Conteúdo
        </span>
        <div
          onClick={(e) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
          className="ml-auto mr-1 hidden group-hover:flex items-center cursor-pointer text-white/80"
          aria-label={open ? "Recolher" : "Expandir"}
          title={open ? "Recolher" : "Expandir"}
        >
          <Svg.chevron
            tailWindClasses={[
              "size-4 transition-transform duration-200",
              open ? "rotate-90" : "rotate-0",
            ].join(" ")}
          />
        </div>
      </button>
      <div
        className={[
          "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
          open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <ul className="ml-4 flex flex-col gap-2 mt-2 pl-2 border-l border-white/70">
          <li>
            <a
              href={WHATSAPP_COMMUNITY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                "w-full text-left bg-transparent relative flex items-center rounded-[5px]",
                "text-white/50 border border-transparent hover:text-white hover:border-white/70",
                "h-11 w-[30px] group-hover:w-full justify-center group-hover:justify-start pl-0 group-hover:pl-2 pr-0 group-hover:pr-8",
                "transition-[width,padding,color,border-color] duration-200",
                "after:content-[''] after:absolute after:left-[-10px] after:top-[50%] after:translate-y-[-50%] after:w-[10px] after:h-px after:bg-beergam-white",
              ].join(" ")}
            >
              <div className="w-[10px] h-[10px] rounded-full absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-beergam-green!" />
              <span className="inline-block ml-0 group-hover:ml-3 text-[18px] w-0 opacity-0 overflow-hidden whitespace-nowrap transition-[margin,width,opacity] duration-200 group-hover:w-auto group-hover:opacity-100">
                Networking WhatsApp
              </span>
            </a>
          </li>
        </ul>
      </div>
    </li>
  );
}

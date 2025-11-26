import React, { useState } from "react";
import { Link, PrefetchPageLinks } from "react-router";
import Svg from "~/src/assets/svgs/_index";
import { useMenuActions } from "../../hooks/useMenuActions";
import { useMenuState } from "../../hooks/useMenuState";
import { type IMenuItem } from "../../typings";
import { DEFAULT_INTERNAL_PATH, getIcon, getRelativePath } from "../../utils";
import { checkItemAccess } from "../../utils/checkItemAccess";

interface IMenuItemProps {
  item: IMenuItem;
  itemKey: string; // ex: "atendimento"
  parentKey: string; // ex: "atendimento.mercado_livre"
}

interface IMenuItemWrapperProps {
  isDropDown: boolean;
  setOpen?: () => void;
  children: React.ReactNode;
  path?: string;
  isSelected?: boolean;
  target?: string | null;
  open?: boolean;
}

function MenuItemWrapper({
  isDropDown,
  setOpen,
  children,
  path,
  isSelected,
  target,
  open,
}: IMenuItemWrapperProps) {
  const [prefetchActive, setPrefetchActive] = useState(false);
  if (isDropDown) {
    return (
      <button
        className={[
          "w-full text-left bg-transparent relative flex items-center rounded-[5px]",
          "text-white/50 border border-transparent hover:text-white hover:border-white/70",
          "h-11 w-[30px] group-hover:w-full justify-center group-hover:justify-start pl-0 group-hover:pl-2 pr-0 group-hover:pr-8",
          "transition-[width,padding,color,border-color] duration-200",
          isSelected || open
            ? "border-white text-beergam-orange! bg-beergam-orange/10!"
            : "",
        ].join(" ")}
        onClick={setOpen}
      >
        {children}
      </button>
    );
  }
  return (
    <>
      <Link
        className={[
          "w-full text-left bg-transparent relative flex items-center rounded-[5px]",
          "text-white/50 border border-transparent hover:text-white hover:border-white/70",
          "h-11 w-[30px] group-hover:w-full justify-center group-hover:justify-start pl-0 group-hover:pl-2 pr-0 group-hover:pr-8",
          "transition-[width,padding,color,border-color] duration-200",
          isSelected || open
            ? "border-white text-beergam-orange! bg-beergam-orange/10!"
            : "",
        ].join(" ")}
        to={path || ""}
        target={target ? target : undefined}
        onMouseEnter={() => setPrefetchActive(true)}
        onMouseLeave={() => setPrefetchActive(false)}
        onFocus={() => setPrefetchActive(true)}
        onBlur={() => setPrefetchActive(false)}
      >
        {children}
      </Link>
      {prefetchActive && path ? <PrefetchPageLinks page={path} /> : null}
    </>
  );
}

export default function MenuItem({ item, itemKey, parentKey }: IMenuItemProps) {
  const currentKey = parentKey ? `${parentKey}.${itemKey}` : itemKey;
  const { toggleOpen } = useMenuActions();
  const { views, open: openMap, currentSelected } = useMenuState();

  // Verifica acesso: se tem parentKey, verifica o acesso do pai
  // Se não tem parentKey, verifica o acesso direto
  const isVisible = checkItemAccess(itemKey, parentKey, views);
  const open = openMap[currentKey] ?? false;
  const isSelected = currentSelected[currentKey] ?? false;
  const icon = item.icon
    ? open || isSelected
      ? getIcon((item.icon + "_solid") as keyof typeof Svg)
      : getIcon(item.icon)
    : undefined;
  if (!isVisible) return null;

  return (
    <li
      className={[
        item.dropdown ? "relative" : "",
        open ? "" : "",
        "w-full",
      ].join(" ")}
    >
      <MenuItemWrapper
        isDropDown={!!item.dropdown}
        setOpen={() => toggleOpen(currentKey)}
        path={
          getRelativePath(itemKey) ?? DEFAULT_INTERNAL_PATH + (item.path || "")
        }
        isSelected={isSelected}
        target={item.target}
        open={open}
      >
        {item.icon && (
          <>
            <div className="w-[26px] h-[26px] shrink-0 flex-none">
              {icon ? React.createElement(icon, {}) : null}
            </div>
          </>
        )}
        <div
          className={[
            "w-[10px] h-[10px] rounded-full absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity",
            item.status === "green"
              ? "bg-beergam-green!"
              : item.status === "yellow"
                ? "bg-beergam-yellow!"
                : item.status === "red"
                  ? "bg-beergam-red!"
                  : "bg-white/80",
          ].join(" ")}
        />
        <span className="inline-block ml-0 group-hover:ml-3 text-[18px] w-0 opacity-0 overflow-hidden whitespace-nowrap transition-[margin,width,opacity] duration-200 group-hover:w-auto group-hover:opacity-100">
          {item.label}
        </span>
        {item.dropdown && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleOpen(currentKey);
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
        )}
      </MenuItemWrapper>
      {item.dropdown && (
        <div
          className={[
            "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
            open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0",
          ].join(" ")}
        >
          <ul className="ml-4 mt-2 pl-2 border-l border-white/70">
            {Object.entries(item.dropdown).map(([key, dropdownItem]) => (
              <MenuItem
                key={key}
                item={dropdownItem}
                itemKey={key}
                parentKey={currentKey}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

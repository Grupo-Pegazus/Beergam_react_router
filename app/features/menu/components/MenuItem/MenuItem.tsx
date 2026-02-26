import React, { useState } from "react";
import { Link, PrefetchPageLinks } from "react-router";
import { Tooltip } from "react-tooltip";
import { isFree } from "~/features/plans/planUtils";
import authStore from "~/features/store-zustand";
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
  className?: string;
}

interface IMenuItemWrapperProps {
  isDropDown: boolean;
  setOpen?: () => void;
  children: React.ReactNode;
  path?: string;
  isSelected?: boolean;
  target?: string | null;
  open?: boolean;
  className?: string;
}

function MenuItemWrapper({
  isDropDown,
  setOpen,
  children,
  path,
  isSelected,
  target,
  open,
  className = "",
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
          className,
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
          className,
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

export default function MenuItem({ item, itemKey, parentKey, className = "" }: IMenuItemProps) {
  const currentKey = parentKey ? `${parentKey}.${itemKey}` : itemKey;
  const { toggleOpen } = useMenuActions();
  const { views, open: openMap, currentSelected } = useMenuState();
  const subscription = authStore.use.subscription();
  const isFreePlan = isFree(subscription);
  const isLockedForFree = isFreePlan && item.freePlanLocked === true;

  // Verifica acesso: se tem parentKey, verifica o acesso do pai
  // Se não tem parentKey, verifica o acesso direto
  const isVisible = checkItemAccess(itemKey, parentKey, views);
  // Verifica se o item deve aparecer no menu
  const showMenu = item.showMenu !== false; // Por padrão é true
  const open = openMap[currentKey] ?? false;
  const isSelected = currentSelected[currentKey] ?? false;
  const icon = item.icon
    ? open || isSelected
      ? getIcon((item.icon + "_solid") as keyof typeof Svg)
      : getIcon(item.icon)
    : undefined;
  
  // Não renderiza se não tiver acesso ou se showMenu for false
  if (!isVisible || !showMenu) return null;

  if (isLockedForFree) {
    const tooltipId = `free-locked-${item.label.replace(/\s+/g, "-").toLowerCase()}`;
    return (
      <li className="w-full">
        <div
          className={[
            "w-full text-left bg-transparent relative flex items-center rounded-[5px] cursor-not-allowed",
            "text-white/30 border border-transparent",
            "h-11 w-[30px] group-hover:w-full justify-center group-hover:justify-start pl-0 group-hover:pl-2 pr-0 group-hover:pr-2",
            "transition-[width,padding] duration-200",
            className,
          ].join(" ")}
        >
          {item.icon && (
            <div className="w-[26px] h-[26px] shrink-0 flex-none relative">
              {icon ? React.createElement(icon, {}) : null}
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-beergam-orange rounded-full flex items-center justify-center">
                <Svg.lock_closed
                  tailWindClasses="text-white"
                  width="8px"
                  height="8px"
                />
              </div>
            </div>
          )}
          <span
            data-tooltip-id={tooltipId}
            data-tooltip-content="Disponível nos planos pagos"
            data-tooltip-place="right"
            className="inline-block ml-0 group-hover:ml-3 text-[18px] w-0 opacity-0 overflow-hidden whitespace-nowrap transition-[margin,width,opacity] duration-200 group-hover:w-auto group-hover:opacity-100"
          >
            {item.label}
          </span>
        </div>
        <Tooltip id={tooltipId} positionStrategy="fixed" />
      </li>
    );
  }

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
        className={className}
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
          <ul className="ml-4 flex flex-col gap-2 mt-2 pl-2 border-l border-white/70">
            {Object.entries(item.dropdown)
              .filter(([, dropdownItem]) => {
                // Filtra por launched e showMenu
                const isLaunched = dropdownItem.launched !== false;
                const shouldShowMenu = dropdownItem.showMenu !== false; // Por padrão é true
                return isLaunched && shouldShowMenu;
              })
              .map(([key, dropdownItem]) => (
                <MenuItem
                  key={key}
                  item={dropdownItem}
                  itemKey={key}
                  parentKey={currentKey}
                  className={"after:content-[''] after:absolute after:left-[-10px] after:top-[50%] after:translate-y-[-50%] after:w-[10px] after:h-px after:bg-beergam-white"}
                />
              ))}
          </ul>
        </div>
      )}
    </li>
  );
}

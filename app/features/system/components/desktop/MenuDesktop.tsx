import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "~/store";
import { MenuProvider } from "../../../menu/context/MenuContext";
import { useActiveMenu } from "../../../menu/hooks";
import { useMenuActions } from "../../../menu/hooks/useMenuActions";
import { useMenuState } from "../../../menu/hooks/useMenuState";
import { MenuHandler, type MenuState } from "../../../menu/typings";
import MenuItem from "../../../menu/components/MenuItem/MenuItem";

function MenuDesktopContent() {
  useActiveMenu(MenuHandler.getMenu());
  const user = useSelector((state: RootState) => state.user);
  const { closeMany } = useMenuActions();
  const { openKeys } = useMenuState();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMouseLeave = useCallback(() => {
    if (openKeys.length > 0) {
      closeMany(openKeys);
    }
  }, [openKeys, closeMany]);

  const menu = useMemo(() => {
    return MenuHandler.setMenu(
      user?.user?.details.allowed_views ?? (MenuHandler.getMenu() as unknown as MenuState)
    );
  }, [user?.user?.details.allowed_views]);

  return (
    <>
      <div
        className={[
          "fixed top-0 left-0 right-0 bottom-0 z-1000 opacity-0 pointer-events-none transition-opacity duration-300 ease-out bg-black/40 group-hover:opacity-100",
          isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />
      <div
        onMouseLeave={() => {
          handleMouseLeave();
          setIsExpanded(false);
        }}
        onMouseEnter={() => {
          setIsExpanded(true);
        }}
        className="group fixed top-14 z-1001 h-[calc(100vh-56px)] w-[100px] hover:w-[267px] transition-all duration-200 text-white bg-beergam-blue-primary border-r border-black/15 shadow-layout-primary flex flex-col gap-5 py-2"
      >
        <div className="px-[18px]"></div>
        <ul className="flex flex-col gap-2 list-none max-h-[90%] overflow-y-auto overflow-x-hidden px-[18px] [scrollbar-gutter:stable_both-edges] [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-[#b8c0c2] [&::-webkit-scrollbar-thumb]:rounded-[10px]">
          {Object.entries(menu).map(([key, item]) => (
            <MenuItem key={key} item={item} itemKey={key} parentKey="" />
          ))}
        </ul>
        <div className="mt-auto px-3"></div>
      </div>
    </>
  );
}

export default function MenuDesktop() {
  return (
    <MenuProvider>
      <MenuDesktopContent />
    </MenuProvider>
  );
}



import { useCallback, useMemo , useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "~/features/auth/redux";
import { type RootState } from "~/store";
import { useActiveMenu } from "../../hooks";
import { closeMany } from "../../redux";
import { MenuHandler, type MenuState } from "../../typings";
import MenuItem from "../MenuItem/MenuItem";
import { menuService } from "../../service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
// import { useQueryClient } from "@tanstack/react-query";

export default function Menu() {
  // const queryClient = useQueryClient();
  const navigate = useNavigate();
  useActiveMenu(MenuHandler.getMenu()); //Gerencia o estado do Menu baseado na rota
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const openMap = useSelector((s: RootState) => s.menu.open);
  const [isExpanded, setIsExpanded] = useState(false);
  // calcula apenas as chaves abertas
  const openKeys = useMemo(
    () =>
      Object.entries(openMap)
        .filter(([, v]) => v)
        .map(([k]) => k),
    [openMap]
  );

  const handleMouseLeave = useCallback(() => {
    if (openKeys.length) dispatch(closeMany(openKeys));
  }, [dispatch, openKeys]);
  const handleChangeView = async () => {
    const res = await menuService.logout();
    if (res.success) {
      dispatch(logout());
      // TODO: Verificar problema de limpar cache do react query
      // queryClient.clear()
      navigate("/login");
    } else {
      toast.error(res.message);
    }
  };
  const menu = useMemo(() => {
    return MenuHandler.setMenu(
      user?.allowed_views ?? (MenuHandler.getMenu() as unknown as MenuState)
    );
  }, [user?.allowed_views]);

  return (
    <>
      <div className={["fixed top-0 left-0 right-0 bottom-0 z-1000 opacity-0 pointer-events-none transition-opacity duration-300 ease-out bg-black/40 group-hover:opacity-100", isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"].join(" ")} />
      <div
        onMouseLeave={() => {
          handleMouseLeave();
          setIsExpanded(false);
        }}
        onMouseEnter={() => {
          setIsExpanded(true);
        }}
        className="group fixed top-14 z-1001 h-[calc(100vh-56px)] w-[100px] hover:w-[267px] transition-all duration-200 text-white bg-beergam-blue-primary border-r border-black/15 shadow-layout-primary   flex flex-col gap-5 py-2"
      >
        <div className="px-[18px]">
        </div>
        <ul className="flex flex-col gap-2 list-none max-h-[90%] overflow-y-auto overflow-x-hidden px-[18px] [scrollbar-gutter:stable_both-edges] [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-[#b8c0c2] [&::-webkit-scrollbar-thumb]:rounded-[10px]">
          {Object.entries(menu).map(([key, item]) => (
            <MenuItem key={key} item={item} itemKey={key} parentKey="" />
          ))}
        </ul>
        <div className="mt-auto px-3">
          <button
            onClick={handleChangeView}
            className="relative w-full flex items-center justify-center p-2 rounded-[10px] bg-beergam-orange! cursor-pointer border border-transparent transition-all duration-200 hover:border-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-[30px] h-[30px] transition-transform duration-200 group-hover:-translate-x-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
              />
            </svg>
            <span className="absolute right-[33%] text-white font-normal text-[18px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Sair
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

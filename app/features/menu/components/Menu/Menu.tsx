import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "~/features/auth/redux";
import { type RootState } from "~/store";
import { useActiveMenu } from "../../hooks";
import { closeMany } from "../../redux";
import { MenuHandler, type MenuState } from "../../typings";
import styles from "../index.module.css";
import MenuItem from "../MenuItem/MenuItem";
import { menuService } from "../../service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import AccountView from "./AccountView";
export default function Menu() {
  const navigate = useNavigate();
  useActiveMenu(MenuHandler.getMenu()); //Gerencia o estado do Menu baseado na rota
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const openMap = useSelector((s: RootState) => s.menu.open);
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
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false);
        handleMouseLeave();
      }}
      className={styles.hierarchyMenu}
    >
      <div className={styles.menuHeader + " " + styles.menuPadding}>
        <AccountView expanded={isExpanded} />
        <div className={styles.arrow}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
      </div>
      <ul className={styles.menuItems + " " + styles.menuPadding}>
        {/* {Object.values(MenuHandler.getMenu()).map((item: IMenuItem) => (
          <MenuItem
            key={item.label}
            item={item}
            fatherOpen={menuOpen}
            activeState={activeState}
          />
        ))} */}
        {Object.entries(menu).map(([key, item]) => (
          <MenuItem key={key} item={item} itemKey={key} parentKey="" />
        ))}
      </ul>
      <div style={{ marginTop: "auto" }} className={styles.logoutBtn}>
        <button onClick={handleChangeView}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
            />
          </svg>
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}

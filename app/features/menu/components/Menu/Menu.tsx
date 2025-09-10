import {  useState } from "react";
import MenuItem from "../MenuItem/MenuItem";
import styles from "./index.module.css";
import { UsuarioTeste } from "../../../auth/user/typings";
import { useActiveMenu } from "../../hooks";
import {
  MenuHanlder,
  type IMenuItem,
  MenuConfig,
} from "../../typings";
export default function Menu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { activeState } = useActiveMenu(MenuHanlder.getMenu());
  console.log("activeState", activeState);
  return (
    <div
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => setMenuOpen(false)}
      className={styles.hierarchyMenu}
    >
      <div className={styles.menuHeader + " " + styles.menuPadding}>
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
        <div className={styles.dots}>
          <div
            style={{ backgroundColor: "var(--blue-primary)" }}
            className={styles.dot}
          ></div>
          <div
            style={{
              backgroundColor: "var(--orange)",
              transform: "translateY(-3px)",
            }}
            className={styles.dot}
          ></div>
          <div
            style={{ backgroundColor: "var(--blue)" }}
            className={styles.dot}
          ></div>
        </div>
        <div className={styles.userInfo}>
          <img src={UsuarioTeste.conta_ml?.image} alt="Sua Conta ML" />
          <div className={styles.userInfoText}>
            <p className={styles.userInfoContaMl}>
              {UsuarioTeste.conta_ml?.nome}
            </p>
            <p>{UsuarioTeste.nome}</p>
          </div>
        </div>
      </div>
      <ul className={styles.menuItems + " " + styles.menuPadding}>
        {Object.values(MenuConfig).map((item: IMenuItem) => (
          <MenuItem
            key={item.label}
            item={item}
            fatherOpen={menuOpen}
            activeState={activeState}
          />
        ))}
      </ul>
      <div style={{ marginTop: "auto" }} className={styles.logoutBtn}>
        <button>
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

import { Profiler } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { type RootState } from "~/store";
import { toggleOpen } from "../../redux";
import { type IMenuItem } from "../../typings";
import { getIcon, getRelativePath } from "../../utils";
import styles from "../index.module.css";
type Props = {
  item: IMenuItem;
  itemKey: string; // chave local (ex: "atendimento")
  parentKey: string; // chave pai (ex: "atendimento.mercado_livre")
};

export default function MenuItemTeste({ item, itemKey, parentKey }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentKey = parentKey ? `${parentKey}.${itemKey}` : itemKey;

  const isVisible = useSelector(
    (s: RootState) =>
      s.menu.views[itemKey as keyof typeof s.menu.views]?.active ?? true
  );

  const isOpen = useSelector(
    (s: RootState) => s.menu.open[currentKey] ?? false
  );

  const isCurrentSelected = useSelector(
    (s: RootState) => s.menu.currentSelected[currentKey] ?? false
  );

  if (!isVisible) return null;

  const handleClick = (e: React.MouseEvent) => {
    if (!item.path) {
      e.preventDefault();
      dispatch(toggleOpen({ path: currentKey }));
    }
  };

  return (
    <Profiler
      id={itemKey}
      onRender={() => {
        console.log("renderizei o ", itemKey);
      }}
    >
      <li className={styles.menuItem}>
        <Link
          to={getRelativePath(itemKey) ?? "#"}
          onClick={handleClick}
          className={
            styles.menuBtn +
            " " +
            (isCurrentSelected ? " " + styles.selected : "")
          }
        >
          {item.icon && <div>{getIcon(item.icon)()}</div>}
          <span>{item.label}</span>
          {item.dropdown ? (isOpen ? "▲" : "▼") : null}
        </Link>
        {item.dropdown && isOpen && (
          <ul>
            {Object.entries(item.dropdown).map(([childKey, child]) => (
              <MenuItemTeste
                key={childKey}
                item={child}
                itemKey={childKey}
                parentKey={currentKey}
              />
            ))}
          </ul>
        )}
      </li>
    </Profiler>
  );
}

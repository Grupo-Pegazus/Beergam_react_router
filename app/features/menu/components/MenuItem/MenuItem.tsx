import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { type RootState } from "~/store";
import { toggleOpen } from "../../redux";
import { type IMenuItem } from "../../typings";
import { DEFAULT_INTERNAL_PATH, getIcon, getRelativePath } from "../../utils";
import styles from "../index.module.css";

interface IMenuItemProps {
  item: IMenuItem;
  itemKey: string; // ex: "atendimento"
  parentKey: string; // ex: "atendimento.mercado_livre"
}

interface IMenuItemWrapperProps {
  isDropDown: boolean;
  open?: boolean;
  setOpen?: (params: { open: boolean }) => void;
  children: React.ReactNode;
  path?: string;
  isSelected?: boolean;
  target?: string | null;
}

function MenuItemWrapper({
  isDropDown,
  open,
  setOpen,
  children,
  path,
  isSelected,
  target,
}: IMenuItemWrapperProps) {
  if (isDropDown) {
    return (
      <button
        className={`${styles.menuBtn} ${isSelected ? styles.selected : ""}`}
        onClick={() => setOpen!({ open: !open })}
      >
        {children}
      </button>
    );
  }
  return (
    <Link
      className={`${styles.menuBtn} ${isSelected ? styles.selected : ""}`}
      to={path || ""}
      target={target ? target : undefined}
    >
      {children}
    </Link>
  );
}

export default function MenuItem({ item, itemKey, parentKey }: IMenuItemProps) {
  const dispatch = useDispatch();
  const currentKey = parentKey ? `${parentKey}.${itemKey}` : itemKey;

  const isVisible = useSelector(
    (s: RootState) =>
      s.menu.views[itemKey as keyof typeof s.menu.views]?.access ?? true
  );
  const open = useSelector((s: RootState) => s.menu.open[currentKey] ?? false);
  const isSelected = useSelector(
    (s: RootState) => s.menu.currentSelected[currentKey] ?? false
  );

  if (!isVisible) return <></>;

  return item.access !== false ? (
    <li
      className={`${item.dropdown ? styles.subNav : ""} ${open ? styles.open : ""} ${styles.menuItem}`}
    >
      <MenuItemWrapper
        isDropDown={!!item.dropdown}
        open={open}
        setOpen={() => dispatch(toggleOpen({ path: currentKey }))}
        path={
          getRelativePath(itemKey) ?? DEFAULT_INTERNAL_PATH + (item.path || "")
        }
        isSelected={isSelected}
        target={item.target}
      >
        {item.icon && (
          <>
            <div className={styles.menuIconContainer}>
              {React.createElement(getIcon(item.icon), {})}
            </div>
          </>
        )}
        <div className={styles.menuStatus + " " + styles[item.status]}></div>
        <span>{item.label}</span>
      </MenuItemWrapper>
      {item.dropdown && (
        <ul
          className={
            styles.biggerLine + " " + (open ? styles.opening : styles.close)
          }
          style={{ display: open ? "block" : "none" }}
        >
          {Object.entries(item.dropdown).map(([key, dropdownItem]) => (
            <MenuItem
              key={key}
              item={dropdownItem}
              itemKey={key}
              parentKey={currentKey}
            />
          ))}
        </ul>
      )}
    </li>
  ) : (
    <></>
  );
}

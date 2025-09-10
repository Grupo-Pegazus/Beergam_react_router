import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  DEFAULT_INTERNAL_PATH,
  type IMenuItem,
  getIcon,
  getRelativePath,
} from "../../typings";
import styles from "../index.module.css";
interface IMenuItemProps {
  item: IMenuItem;
  fatherOpen?: boolean;
  activeState: {
    activeItems: IMenuItem[];
  };
  relativePath?: string;
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

export default function MenuItem({
  item,
  fatherOpen,
  activeState,
  relativePath,
}: IMenuItemProps) {
  const [open, setOpen] = useState(fatherOpen || false);
  const [canChangeDisplay, setChangeDisplay] = useState(true);
  const isSelected = activeState.activeItems.some((i) => i == item);
  if (item.active === undefined) {
    item.active = true;
  }
  useEffect(() => {
    if (!open) {
      window.setTimeout(() => {
        setChangeDisplay(true);
      }, 300);
    } else {
      setChangeDisplay(false);
    }
  }, [open]);

  // Propaga o estado do pai para os filhos apenas quando o pai fechar
  useEffect(() => {
    if (fatherOpen !== undefined && !fatherOpen) {
      setOpen(fatherOpen);
    }
  }, [fatherOpen]);
  return item.active ? (
    <li
      className={`${item.dropdown ? styles.subNav : ""} ${open ? styles.open : ""} ${styles.menuItem}`}
    >
      <MenuItemWrapper
        isDropDown={!!item.dropdown}
        open={open}
        setOpen={(params) => setOpen(params.open)}
        path={relativePath ? relativePath : DEFAULT_INTERNAL_PATH + item.path}
        isSelected={isSelected}
        target={item.target}
      >
        {item.icon && (
          <>
            <div className={styles.menuIconContainer}>
              {getIcon(item.icon)()}
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
          style={{ display: canChangeDisplay ? "none" : "block" }}
        >
          {Object.entries(item.dropdown).map(([key, dropdownItem]) => (
            <MenuItem
              fatherOpen={open} // Passa o estado atual para os filhos
              key={key}
              item={dropdownItem}
              activeState={activeState}
              relativePath={getRelativePath(key)}
            />
          ))}
        </ul>
      )}
    </li>
  ) : (
    <></>
  );
}

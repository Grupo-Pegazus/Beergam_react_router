export type NavKey = 'home' | 'sales' | 'account' | 'complaints' | 'menu' | 'calculator';

export type NavDestination = {
  pathname: string;
};

import type React from "react";
import type { SvgBaseProps } from "~/src/assets/svgs/IconBase";

export type NavIcon = React.ComponentType<SvgBaseProps>;

export type BottomNavItem = {
  key: NavKey;
  label: string;
  destination?: NavDestination;
  icon: NavIcon;
  iconSolid?: NavIcon;
  isCenter?: boolean;
};

export type BottomNavConfig = Readonly<{
  items: ReadonlyArray<BottomNavItem>;
}>;



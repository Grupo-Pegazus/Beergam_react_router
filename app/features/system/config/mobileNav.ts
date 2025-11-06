import Svg from "../../../src/assets/svgs/_index";
import type { BottomNavConfig, NavIcon } from "../types";
import { DEFAULT_INTERNAL_PATH } from "~/features/menu/utils";

const mobileNav: BottomNavConfig = {
  items: [
    {
      key: "home",
      label: "Início",
      destination: { pathname: DEFAULT_INTERNAL_PATH },
      icon: Svg.home as unknown as NavIcon,
      iconSolid: Svg.home_solid as unknown as NavIcon,
    },
    {
      key: "sales",
      label: "Vendas",
      destination: { pathname: DEFAULT_INTERNAL_PATH + "/vendas" },
      icon: Svg.bag as unknown as NavIcon,
      iconSolid: Svg.bag_solid as unknown as NavIcon,
    },
    {
      key: "account",
      label: "Conta",
      icon: Svg.user_plus as unknown as NavIcon,
      isCenter: true,
    },
    {
      key: "complaints",
      label: "Reclamações",
      destination: { pathname: DEFAULT_INTERNAL_PATH + "/reclamacoes" },
      icon: Svg.megaphone as unknown as NavIcon,
    },
    {
      key: "menu",
      label: "Menu",
      icon: Svg.list as unknown as NavIcon,
    },
  ],
} as const;

export default mobileNav;

export const dynamicDefaultParentKey = "atendimento" as const;
import React, { createContext, useContext, useReducer, type ReactNode } from "react";
import { type MenuKeys, type MenuState as MenuStateType } from "../typings";
import { getDefaultViews } from "../utils";

type OpenMap = Record<string, boolean>;
type CurrentSelectedMap = Record<string, boolean>;

interface MenuReducerState {
  views: MenuStateType;
  open: OpenMap;
  currentSelected: CurrentSelectedMap;
}

type MenuAction =
  | { type: "SET_MENU_ACTIVE"; payload: { key: MenuKeys; active: boolean } }
  | { type: "TOGGLE_OPEN"; payload: { path: string } }
  | { type: "SET_OPEN"; payload: { path: string; value: boolean } }
  | { type: "SET_CURRENT_SELECTED"; payload: { path: string; value: boolean } }
  | { type: "SET_SELECTED_ONLY"; payload: { path: string } }
  | { type: "CLOSE_MANY"; payload: string[] };

interface MenuContextValue {
  state: MenuReducerState;
  dispatch: React.Dispatch<MenuAction>;
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

const initialState: MenuReducerState = {
  views: getDefaultViews(),
  open: {},
  currentSelected: {},
};

function menuReducer(state: MenuReducerState, action: MenuAction): MenuReducerState {
  switch (action.type) {
    case "SET_MENU_ACTIVE": {
      return {
        ...state,
        views: {
          ...state.views,
          [action.payload.key]: {
            ...state.views[action.payload.key],
            active: action.payload.active,
          },
        },
      };
    }
    case "TOGGLE_OPEN": {
      return {
        ...state,
        open: {
          ...state.open,
          [action.payload.path]: !state.open[action.payload.path],
        },
      };
    }
    case "SET_OPEN": {
      return {
        ...state,
        open: {
          ...state.open,
          [action.payload.path]: action.payload.value,
        },
      };
    }
    case "SET_CURRENT_SELECTED": {
      return {
        ...state,
        currentSelected: {
          ...state.currentSelected,
          [action.payload.path]: action.payload.value,
        },
      };
    }
    case "SET_SELECTED_ONLY": {
      return {
        ...state,
        currentSelected: {
          [action.payload.path]: true,
        },
      };
    }
    case "CLOSE_MANY": {
      const newOpen = { ...state.open };
      action.payload.forEach((key) => {
        if (newOpen[key]) {
          newOpen[key] = false;
        }
      });
      return {
        ...state,
        open: newOpen,
      };
    }
    default:
      return state;
  }
}

interface MenuProviderProps {
  children: ReactNode;
}

export function MenuProvider({ children }: MenuProviderProps) {
  const [state, dispatch] = useReducer(menuReducer, initialState);

  return (
    <MenuContext.Provider value={{ state, dispatch }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenuContext(): MenuContextValue {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenuContext deve ser usado dentro de MenuProvider");
  }
  return context;
}


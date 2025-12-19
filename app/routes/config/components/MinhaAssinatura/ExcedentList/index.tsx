import { Pagination } from "@mui/material";
import { useEffect, useReducer, useState } from "react";
import type { BaseMarketPlace } from "~/features/marketplace/typings";
import type { IColab } from "~/features/user/typings/Colab";
import ExcedentItem from "../ExcedentItem";
export interface SelectedItem<T extends IColab | BaseMarketPlace> {
  item: T;
  selected: boolean;
}

type ItemAction<T extends IColab | BaseMarketPlace> =
  | { type: "INITIALIZE"; payload: T[] }
  | { type: "TOGGLE_SELECTED"; payload: string };

function itemsReducer<T extends IColab | BaseMarketPlace>(
  state: SelectedItem<T>[],
  action: ItemAction<T>
): SelectedItem<T>[] {
  switch (action.type) {
    case "INITIALIZE":
      return action.payload.map((item) => ({
        item,
        selected: false,
      }));
    case "TOGGLE_SELECTED": {
      return state.map((selectedItem) => {
        const itemPin =
          "pin" in selectedItem.item ? selectedItem.item.pin : null;
        if (itemPin === action.payload) {
          return { ...selectedItem, selected: !selectedItem.selected };
        }
        return selectedItem;
      });
    }
    default:
      return state;
  }
}

interface ExcedentListProps<T extends IColab | BaseMarketPlace> {
  items: T[];
  maxQuantityAllowed: number;
  onSelectionChange?: (selectedItems: T[]) => void;
  getItemKey?: (item: T) => string;
}

export default function ExcedentList<T extends IColab | BaseMarketPlace>({
  items,
  maxQuantityAllowed,
  onSelectionChange,
  getItemKey = (item) => ("pin" in item ? item.pin || "" : ""),
}: ExcedentListProps<T>) {
  const [selectedItems, dispatch] = useReducer(itemsReducer<T>, []);
  const [page, setPage] = useState(1);
  const perPage = 6;
  useEffect(() => {
    dispatch({ type: "INITIALIZE", payload: items });
  }, [items]);
  const filteredItems = items.slice((page - 1) * perPage, page * perPage);
  useEffect(() => {
    if (onSelectionChange) {
      const selected = selectedItems
        .filter((item) => item.selected)
        .map((item) => item.item);
      onSelectionChange(selected);
    }
  }, [selectedItems, onSelectionChange]);

  const handleSelect = (item: T) => {
    const key = getItemKey(item);
    if (key) {
      dispatch({ type: "TOGGLE_SELECTED", payload: key });
    }
  };

  const getSelectedState = (item: T): boolean => {
    const key = getItemKey(item);
    const selectedItem = selectedItems.find(
      (si) => getItemKey(si.item) === key
    );
    return selectedItem?.selected ?? false;
  };

  const getSelectedCount = (): number => {
    return selectedItems.filter((item) => item.selected).length;
  };

  const currentQuantity = getSelectedCount();

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const key = getItemKey(item);
          return (
            <ExcedentItem
              key={key}
              item={item}
              selected={getSelectedState(item)}
              onSelect={() => handleSelect(item)}
              maxQuantityAllowed={maxQuantityAllowed}
              currentQuantity={currentQuantity}
            />
          );
        })}
      </div>
      <Pagination
        count={Math.ceil(items.length / perPage)}
        page={page}
        onChange={(event, value) => setPage(value)}
      ></Pagination>
    </>
  );
}

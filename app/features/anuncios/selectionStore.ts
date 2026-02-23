import { create } from "zustand";
import type { AdsFilters } from "./typings";

type SelectionMode = "none" | "manual" | "allFiltered";

export interface AdsSelectionState {
  mode: SelectionMode;
  baseFilter: Partial<AdsFilters> | null;
  selectedIds: Set<string>;
  excludedIdsFromAll: Set<string>;

  reset: () => void;
  selectAllFiltered: (filters: Partial<AdsFilters>) => void;
  toggleAd: (id: string, isSelected: boolean) => void;
}

export const useAdsSelectionStore = create<AdsSelectionState>((set) => ({
  mode: "none",
  baseFilter: null,
  selectedIds: new Set<string>(),
  excludedIdsFromAll: new Set<string>(),

  reset: () =>
    set({
      mode: "none",
      baseFilter: null,
      selectedIds: new Set<string>(),
      excludedIdsFromAll: new Set<string>(),
    }),

  selectAllFiltered: (filters) =>
    set({
      mode: "allFiltered",
      baseFilter: filters,
      selectedIds: new Set<string>(),
      excludedIdsFromAll: new Set<string>(),
    }),

  toggleAd: (id, isSelected) =>
    set((state) => {
      if (state.mode === "allFiltered") {
        const excludedIdsFromAll = new Set(state.excludedIdsFromAll);
        if (isSelected) {
          excludedIdsFromAll.delete(id);
        } else {
          excludedIdsFromAll.add(id);
        }
        return { excludedIdsFromAll };
      }

      const selectedIds = new Set(state.selectedIds);
      if (isSelected) {
        selectedIds.add(id);
      } else {
        selectedIds.delete(id);
      }

      return {
        selectedIds,
        mode: selectedIds.size > 0 ? "manual" : "none",
      };
    }),
}));

export function isAdSelected(state: AdsSelectionState, id: string): boolean {
  if (state.mode === "allFiltered") {
    return !state.excludedIdsFromAll.has(id);
  }

  if (state.mode === "manual") {
    return state.selectedIds.has(id);
  }

  return false;
}

export function getSelectedCount(
  state: AdsSelectionState,
  totalCountForCurrentFilter: number | null,
): number {
  if (state.mode === "manual") {
    return state.selectedIds.size;
  }

  if (state.mode === "allFiltered" && totalCountForCurrentFilter != null) {
    return totalCountForCurrentFilter - state.excludedIdsFromAll.size;
  }

  return 0;
}


import type { SchedulingFilters, SchedulingType, SchedulingStatus } from "../../typings";

export interface SchedulingFiltersProps {
  value: Partial<SchedulingFilters>;
  onChange: (filters: Partial<SchedulingFilters>) => void;
  onSubmit?: () => void;
  onReset?: () => void;
  isSubmitting?: boolean;
}

export type SchedulingTypeFilter = SchedulingType | "all";
export type SchedulingStatusFilter = SchedulingStatus | "all";


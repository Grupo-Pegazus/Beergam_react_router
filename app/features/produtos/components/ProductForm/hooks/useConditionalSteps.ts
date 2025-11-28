import { useMemo } from "react";
import type { FormStep } from "../types";
import { getVisibleSteps } from "../utils";

export function useConditionalSteps(
  steps: FormStep[],
  values: Record<string, unknown>
): FormStep[] {
  return useMemo(() => {
    return getVisibleSteps(steps, values);
  }, [steps, values]);
}


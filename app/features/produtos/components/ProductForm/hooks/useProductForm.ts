import { useCallback, useState, useMemo } from "react";
import type { FormConfig, FormState } from "../types";
import { setNestedValue, transformFormDataToProduct } from "../utils";
import { useFormValidation } from "./useFormValidation";
import { useConditionalSteps } from "./useConditionalSteps";

const createInitialState = (
  initialValues?: Record<string, unknown>
): FormState => ({
  values: initialValues || {},
  errors: {},
  touched: {},
  activeStep: 0,
  completedSteps: new Set<number>(),
});

export function useProductForm(config: FormConfig) {
  const [state, setState] = useState<FormState>(() =>
    createInitialState(config.initialValues)
  );

  const visibleSteps = useConditionalSteps(config.steps, state.values);

  const { errors, validateStepByIndex, getFieldError } = useFormValidation(
    visibleSteps,
    state.values,
    state.touched
  );

  const updateField = useCallback((name: string, value: unknown) => {
    setState((prev) => ({
      ...prev,
      values: setNestedValue(prev.values, name, value),
      touched: { ...prev.touched, [name]: true },
    }));
  }, []);

  const goToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= 0 && stepIndex < visibleSteps.length) {
        setState((prev) => ({
          ...prev,
          activeStep: stepIndex,
        }));
        config.onStepChange?.(stepIndex, visibleSteps[stepIndex].id);
      }
    },
    [visibleSteps, config]
  );

  const nextStep = useCallback(() => {
    setState((prev) => {
      const currentStep = visibleSteps[prev.activeStep];
      const shouldValidate = currentStep?.validateBeforeNext ?? false;

      if (shouldValidate && !validateStepByIndex(prev.activeStep)) {
        return prev;
      }

      const nextIndex = prev.activeStep + 1;
      if (nextIndex < visibleSteps.length) {
        const newCompletedSteps = new Set(prev.completedSteps);
        newCompletedSteps.add(prev.activeStep);

        return {
          ...prev,
          activeStep: nextIndex,
          completedSteps: newCompletedSteps,
        };
      }

      return prev;
    });
  }, [visibleSteps, validateStepByIndex]);

  const previousStep = useCallback(() => {
    setState((prev) => {
      if (prev.activeStep > 0) {
        return {
          ...prev,
          activeStep: prev.activeStep - 1,
        };
      }
      return prev;
    });
  }, []);

  const submit = useCallback(async () => {
    const transformedData = transformFormDataToProduct(state.values, config.mode);
    await config.onSubmit?.(transformedData);
  }, [state.values, config]);

  const isStepCompleted = useCallback(
    (stepIndex: number): boolean => {
      return state.completedSteps.has(stepIndex);
    },
    [state.completedSteps]
  );

  const canGoToStep = useCallback(
    (stepIndex: number): boolean => {
      if (stepIndex < 0 || stepIndex >= visibleSteps.length) {
        return false;
      }

      if (stepIndex <= state.activeStep) {
        return true;
      }

      for (let i = 0; i < stepIndex; i++) {
        const step = visibleSteps[i];
        if (step?.validateBeforeNext && !validateStepByIndex(i)) {
          return false;
        }
      }

      return true;
    },
    [visibleSteps, state.activeStep, validateStepByIndex]
  );

  return {
    state: {
      ...state,
      errors,
    },
    updateField,
    goToStep,
    nextStep,
    previousStep,
    submit,
    isStepCompleted,
    canGoToStep,
    getFieldError,
    visibleSteps,
    validateStepByIndex,
  };
}


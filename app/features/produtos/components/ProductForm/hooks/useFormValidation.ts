import { useCallback, useMemo } from "react";
import type { FormField, FormStep } from "../types";
import { validateField, validateStep, getNestedValue, getVisibleFields } from "../utils";

export function useFormValidation(
  steps: FormStep[],
  values: Record<string, unknown>,
  touched: Record<string, boolean>
) {
  const errors = useMemo(() => {
    const errorsMap: Record<string, string> = {};

    for (const step of steps) {
      const visibleFields = getVisibleFields(step.fields, values);

      for (const field of visibleFields) {
        const fieldValue = getNestedValue(values, field.name);
        const error = validateField(field, fieldValue);

        if (error) {
          errorsMap[field.name] = error;
        }
      }
    }

    return errorsMap;
  }, [steps, values]);

  const validateFieldByName = useCallback(
    (fieldName: string): string | null => {
      for (const step of steps) {
        const field = step.fields.find((f) => f.name === fieldName);
        if (field) {
          const fieldValue = getNestedValue(values, fieldName);
          return validateField(field, fieldValue);
        }
      }
      return null;
    },
    [steps, values]
  );

  const validateStepByIndex = useCallback(
    (stepIndex: number): boolean => {
      if (stepIndex < 0 || stepIndex >= steps.length) {
        return false;
      }
      return validateStep(steps[stepIndex], values);
    },
    [steps, values]
  );

  const isStepValid = useCallback(
    (stepIndex: number): boolean => {
      return validateStepByIndex(stepIndex);
    },
    [validateStepByIndex]
  );

  const hasErrors = useMemo(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  const getFieldError = useCallback(
    (fieldName: string): string | undefined => {
      if (!touched[fieldName]) {
        return undefined;
      }
      return errors[fieldName];
    },
    [errors, touched]
  );

  return {
    errors,
    validateFieldByName,
    validateStepByIndex,
    isStepValid,
    hasErrors,
    getFieldError,
  };
}


import type React from "react";
import type { InternalUploadService, ExternalUploadService } from "~/src/components/utils/upload/types";

export type FormMode = "simplificado" | "completo";

export type FormFieldType =
  | "text"
  | "number"
  | "email"
  | "tel"
  | "textarea"
  | "select"
  | "checkbox"
  | "upload"
  | "date"
  | "slider"
  | "toggle"
  | "category-cards"
  | "rich-text";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface UploadFieldConfig {
  typeImport: "internal" | "external";
  service: InternalUploadService | ExternalUploadService<unknown>;
  maxFiles?: number;
  accept?: string;
  emptyStateLabel?: string;
  draggingLabel?: string;
  uploadType?: "product" | "marketplace" | "shipping";
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  hint?: string;
  type: FormFieldType;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: unknown;
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: unknown) => string | null;
  };
  options?: SelectOption[];
  uploadConfig?: UploadFieldConfig;
  conditional?: {
    field: string;
    operator: "equals" | "notEquals" | "contains" | "greaterThan" | "lessThan";
    value: unknown;
  };
  gridCols?: 1 | 2 | 3 | 4 | 6 | 12;
  customComponent?: React.ComponentType<FormFieldProps>;
  prefix?: string;
  suffix?: string;
  sliderConfig?: {
    min: number;
    max: number;
    step?: number;
    unit?: string;
  };
  toggleOptions?: {
    left: string;
    right: string;
  };
  categoryOptions?: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
  }>;
}

export interface FormFieldProps {
  field: FormField;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
  onBlur?: () => void;
}

export interface ConditionalStep {
  condition: {
    field: string;
    operator: "equals" | "notEquals" | "contains" | "greaterThan" | "lessThan";
    value: unknown;
  };
}

export interface FormStep {
  id: string;
  label: string;
  description?: string;
  fields: FormField[];
  optional?: boolean;
  conditional?: ConditionalStep;
  validateBeforeNext?: boolean;
  icon?: React.ReactNode | string; // Ícone para o stepper (pode ser um componente React ou string de chave do Svg)
}

export interface FormConfig {
  mode: FormMode;
  steps: FormStep[];
  onSubmit?: (data: Record<string, unknown>) => void | Promise<void>;
  onStepChange?: (stepIndex: number, stepId: string) => void;
  initialValues?: Record<string, unknown>;
  validateOnChange?: boolean;
  uploadService?: InternalUploadService;
}

export interface FormState {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  activeStep: number;
  completedSteps: Set<number>;
}

export interface FormContextValue {
  state: FormState;
  updateField: (name: string, value: unknown) => void;
  validateField: (name: string) => string | null;
  validateStep: (stepIndex: number) => boolean;
  goToStep: (stepIndex: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  submit: () => Promise<void>;
  config: FormConfig;
}


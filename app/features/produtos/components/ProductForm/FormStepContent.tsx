import { Grid, Typography, Box } from "@mui/material";
import type { FormStep } from "./types";
import FormFieldRenderer from "./FormFieldRenderer";
import { getNestedValue, getVisibleFields } from "./utils";

interface FormStepContentProps {
  step: FormStep;
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onFieldChange: (name: string, value: unknown) => void;
  onFieldBlur?: (name: string) => void;
}

export default function FormStepContent({
  step,
  values,
  errors,
  touched,
  onFieldChange,
  onFieldBlur,
}: FormStepContentProps) {
  const visibleFields = getVisibleFields(step.fields, values);

  const getGridSize = (cols?: 1 | 2 | 3 | 4 | 6 | 12): number => {
    const colMap: Record<number, number> = {
      1: 12,
      2: 6,
      3: 4,
      4: 3,
      6: 2,
      12: 12,
    };
    return colMap[cols || 12] || 12;
  };

  const getFieldValue = (fieldName: string): unknown => {
    return getNestedValue(values, fieldName);
  };

  const getFieldError = (fieldName: string): string | undefined => {
    if (!touched[fieldName]) {
      return undefined;
    }
    return errors[fieldName];
  };

  return (
    <Box sx={{ p: 3 }}>
      {step.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {step.description}
        </Typography>
      )}

      <Grid container spacing={3}>
        {visibleFields.map((field) => {
          const gridSize = getGridSize(field.gridCols);
          const fieldValue = getFieldValue(field.name);
          const fieldError = getFieldError(field.name);

          return (
            <Grid item xs={12} sm={gridSize === 12 ? 12 : 6} md={gridSize} key={field.id}>
              <FormFieldRenderer
                field={field}
                value={fieldValue}
                error={fieldError}
                onChange={(value) => onFieldChange(field.name, value)}
                onBlur={() => onFieldBlur?.(field.name)}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}


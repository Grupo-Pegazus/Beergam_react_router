import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
} from "@mui/material";
import { z } from "zod";
import { Fields } from "~/src/components/utils/_fields";
import type {
  StockMovementForm as StockMovementFormType,
  StockMovementApiPayload,
} from "../../typings";
import { StockMovementFormSchema } from "../../typings";
import { useCreateStockMovement } from "../../hooks";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import BeergamButton from "~/src/components/utils/BeergamButton";

interface StockMovementFormProps {
  productId: string;
  variationId?: string | null;
  onSuccess?: () => void;
}

export default function StockMovementForm({
  productId,
  variationId,
  onSuccess,
}: StockMovementFormProps) {
  
  const [formData, setFormData] = useState<Partial<StockMovementFormType>>({
    modification_type: "ENTRY",
    quantity: undefined,
    unity_cost: undefined,
    reason: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const createMutation = useCreateStockMovement();

  const validateField = (name: string, value: unknown): string | null => {
    try {
      const fieldSchema = StockMovementFormSchema.shape[
        name as keyof typeof StockMovementFormSchema.shape
      ];
      
      if (!fieldSchema) return null;
      
      const result = fieldSchema.safeParse(value);
      
      if (!result.success && result.error.issues.length > 0) {
        return result.error.issues[0].message;
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleFieldChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Record<string, boolean>
    );
    setTouched(allTouched);

    try {
      const validatedData = StockMovementFormSchema.parse(formData);

      const quantityChange =
        validatedData.modification_type === "ENTRY"
          ? validatedData.quantity
          : -validatedData.quantity;

      const apiPayload: StockMovementApiPayload = {
        product_id: productId,
        quantity_change: quantityChange,
        reason: validatedData.reason,
        description: validatedData.description,
        unity_cost: validatedData.unity_cost,
        auto_sync: true,
      };
      
      if (variationId !== undefined && variationId !== null && variationId !== "") {
          apiPayload.variation_id = variationId;
      }


      createMutation.mutate(apiPayload, {
        onSuccess: () => {
          setFormData({
            modification_type: "ENTRY",
            quantity: undefined,
            unity_cost: undefined,
            reason: "",
            description: "",
          });
          setErrors({});
          setTouched({});
          onSuccess?.();
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path && issue.path.length > 0) {
            const fieldName = issue.path[0] as string;
            newErrors[fieldName] = issue.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const isEntry = formData.modification_type === "ENTRY";
  const hasErrors = Object.keys(errors).length > 0;
  const isFormValid = !hasErrors && formData.quantity && formData.reason && (isEntry ? formData.unity_cost !== undefined : true);

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: { xs: 2, sm: 3 } }} className="text-base sm:text-lg">
          Nova Movimentação de Estoque
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 3 } }}>
            <Fields.wrapper>
              <Fields.label text="Tipo de Movimentação" required />
              <ToggleButtonGroup
                value={formData.modification_type}
                exclusive
                onChange={(_, value) => {
                  if (value !== null) {
                    handleFieldChange("modification_type", value);
                    if (value === "EXIT") {
                      handleFieldChange("unity_cost", undefined);
                    }
                  }
                }}
                fullWidth
                sx={{
                  "& .MuiToggleButton-root": {
                    border: "1px solid",
                    borderColor: "grey.300",
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "white",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    },
                  },
                }}
              >
                <ToggleButton value="ENTRY">Entrada</ToggleButton>
                <ToggleButton value="EXIT">Saída</ToggleButton>
              </ToggleButtonGroup>
            </Fields.wrapper>

            <Fields.wrapper>
              <Fields.label text="Quantidade" required />
              <Fields.input
                type="number"
                value={String(formData.quantity || "")}
                onChange={(e) =>
                  handleFieldChange(
                    "quantity",
                    parseFloat(e.target.value) || undefined
                  )
                }
                onBlur={() => setTouched((prev) => ({ ...prev, quantity: true }))}
                error={
                  touched.quantity && errors.quantity ? errors.quantity : undefined
                }
                required
                min={0.01}
                step={0.01}
                placeholder="Digite a quantidade"
              />
            </Fields.wrapper>

            {isEntry && (
              <Fields.wrapper>
                <Fields.label text="Custo Unitário" required />
                <Box sx={{ position: "relative", width: "100%" }}>
                  <Typography
                    sx={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "text.secondary",
                      zIndex: 1,
                      pointerEvents: "none",
                    }}
                  >
                    R$
                  </Typography>
                  <Fields.input
                    type="number"
                    value={String(formData.unity_cost || "")}
                    onChange={(e) =>
                      handleFieldChange(
                        "unity_cost",
                        parseFloat(e.target.value) || undefined
                      )
                    }
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, unity_cost: true }))
                    }
                    error={
                      touched.unity_cost && errors.unity_cost
                        ? errors.unity_cost
                        : undefined
                    }
                    required
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    style={{ paddingLeft: "40px" }}
                  />
                </Box>
              </Fields.wrapper>
            )}

            {isEntry && formData.quantity && formData.unity_cost && (
              <Alert severity="info">
                Valor total:{" "}
                {formatCurrency(
                  (formData.quantity * formData.unity_cost).toString()
                )}
              </Alert>
            )}

            <Fields.wrapper>
              <Fields.label text="Motivo" required />
              <Fields.input
                type="text"
                value={formData.reason || ""}
                onChange={(e) => handleFieldChange("reason", e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, reason: true }))}
                error={
                  touched.reason && errors.reason ? errors.reason : undefined
                }
                required
                placeholder="Ex: Compra, Ajuste de inventário, etc."
              />
            </Fields.wrapper>

            <Fields.wrapper>
              <Fields.label text="Descrição (opcional)" />
              <Fields.input
                type="text"
                value={formData.description || ""}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                placeholder="Informações adicionais sobre a movimentação"
              />
            </Fields.wrapper>

            {createMutation.isError && (
              <Alert severity="error">
                {createMutation.error instanceof Error
                  ? createMutation.error.message
                  : "Erro ao criar movimentação"}
              </Alert>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <BeergamButton
                title={createMutation.isPending ? "Salvando..." : "Salvar Movimentação"}
                mainColor="beergam-blue-primary"
                animationStyle="slider"
                type="submit"
                disabled={!isFormValid || createMutation.isPending}
                className="w-full sm:w-auto"
                fetcher={{
                  fecthing: createMutation.isPending,
                  completed: false,
                  error: false,
                  mutation: createMutation,
                }}
              />
            </Box>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}


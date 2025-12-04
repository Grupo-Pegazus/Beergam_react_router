import React, { useEffect } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Typography,
  Container,
} from "@mui/material";
import { useProductForm } from "./hooks/useProductForm";
import FormStepContent from "./FormStepContent";
import CustomStepIcon, { setStepIconMap } from "./CustomStepIcon";
import type { FormConfig } from "./types";
import BeergamButton from "~/src/components/utils/BeergamButton";

interface ProductFormProps {
  config: FormConfig;
}

export default function ProductForm({ config }: ProductFormProps) {
  const {
    state,
    updateField,
    nextStep,
    previousStep,
    goToStep,
    submit,
    isStepCompleted,
    canGoToStep,
    visibleSteps,
    validateStepByIndex,
  } = useProductForm(config);

  // Mapeia os ícones dos steps baseado no índice (seguindo padrão da documentação MUI)
  useEffect(() => {
    const iconMapping: Record<number, string | React.ReactNode> = {};
    visibleSteps.forEach((step, index) => {
      if (step.icon) {
        iconMapping[index + 1] = step.icon; // MUI usa índice baseado em 1 para o icon prop
      }
    });
    setStepIconMap(iconMapping);
  }, [visibleSteps]);

  const handleFieldChange = (name: string, value: unknown) => {
    updateField(name, value);
  };

  const handleFieldBlur = () => {
    // Campo já é marcado como touched no updateField
  };

  const handleNext = () => {
    nextStep();
  };

  const handleBack = () => {
    previousStep();
  };

  const handleStepClick = (stepIndex: number) => {
    if (canGoToStep(stepIndex)) {
      goToStep(stepIndex);
    }
  };

  const handleSubmit = async () => {
    await submit();
  };

  const isLastStep = state.activeStep === visibleSteps.length - 1;
  const currentStep = visibleSteps[state.activeStep];
  const currentStepData = visibleSteps[state.activeStep];

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "grey.100" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box>
          {/* Formulário */}
          <Box>
            <Paper elevation={0} sx={{ p: 4, bgcolor: "grey.50", borderRadius: 2 }}>
              {/* Stepper Horizontal */}
              <Box sx={{ mb: 4 }}>
                <Stepper activeStep={state.activeStep} alternativeLabel>
                  {visibleSteps.map((step, index) => {
                    const isCompleted = isStepCompleted(index);
                    const canGo = canGoToStep(index);

                    return (
                      <Step
                        key={step.id}
                        completed={isCompleted}
                        sx={{
                          cursor: canGo ? "pointer" : "default",
                          "& .MuiStepLabel-root": {
                            cursor: canGo ? "pointer" : "default",
                          },
                        }}
                        onClick={() => handleStepClick(index)}
                      >
                        <StepLabel
                          StepIconComponent={CustomStepIcon}
                          sx={{
                            "& .MuiStepLabel-label": {
                              fontSize: "0.875rem",
                              fontWeight: index === state.activeStep ? 600 : 400,
                            },
                            "& .MuiStepLabel-label.Mui-active": {
                              color: "primary.main",
                            },
                            "& .MuiStepLabel-label.Mui-completed": {
                              color: "text.secondary",
                            },
                          }}
                        >
                          {step.label}
                        </StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
              </Box>

              {/* Título e Descrição da Etapa */}
              {currentStepData && (
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{ fontWeight: 600, color: "text.primary", mb: 2 }}
                  >
                    {currentStepData.label}
                  </Typography>
                  {currentStepData.description && (
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      {currentStepData.description}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Conteúdo da Etapa */}
              {currentStepData && (
                <FormStepContent
                  step={currentStepData}
                  values={state.values}
                  errors={state.errors}
                  touched={state.touched}
                  onFieldChange={handleFieldChange}
                  onFieldBlur={handleFieldBlur}
                />
              )}

              {/* Botões de Navegação */}
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, pt: 3 }}>
                <BeergamButton
                  title="Voltar"
                  mainColor="beergam-gray"
                  animationStyle="fade"
                  onClick={handleBack}
                  disabled={state.activeStep === 0}
                  className="min-w-[120px]"
                />
                <BeergamButton
                  title={isLastStep ? "Finalizar Cadastro" : "Próximo"}
                  mainColor="beergam-blue-primary"
                  animationStyle="slider"
                  onClick={isLastStep ? handleSubmit : handleNext}
                  disabled={
                    !isLastStep &&
                    currentStep?.validateBeforeNext &&
                    !validateStepByIndex(state.activeStep)
                  }
                  className="min-w-[120px]"
                />
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}


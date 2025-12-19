import { Step, StepLabel, Stepper } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { PlanBenefits } from "~/features/user/typings/BaseUser";
import BeergamButton from "~/src/components/utils/BeergamButton";

interface StepAvailable {
  access: boolean;
  label: string;
}

type TStepsAvailable = StepAvailable[];
export default function ExcedentBenefits({
  selectedBenefits,
  colabExcedentBenefits,
  marketplaceAccountsExcedentBenefits,
  onButtonClick,
}: {
  selectedBenefits: PlanBenefits | null;
  colabExcedentBenefits: number;
  marketplaceAccountsExcedentBenefits: number;
  onButtonClick: () => void;
}) {
  const navigate = useNavigate();
  if (!selectedBenefits) return null;

  const [steps, setSteps] = useState<number>(0);
  const [stepsAvailable, setStepsAvailable] = useState<TStepsAvailable>([
    {
      access: marketplaceAccountsExcedentBenefits > 0,
      label: "Contas de Marketplaces",
    },
    {
      access: colabExcedentBenefits > 0,
      label: "Contas de Colaboradores",
    },
  ]);
  const stepsAvailableFiltered = stepsAvailable.filter((step) => step.access);
  function getStepContent(step: StepAvailable) {
    if (step.label === "Contas de Marketplaces") {
      return (
        <>
          <p className="text-nowrap">
            Você possui {marketplaceAccountsExcedentBenefits} marketplaces
            excedentes.
          </p>
          <BeergamButton
            title="Gerenciar Marketplaces"
            onClick={() => {
              onButtonClick();
              navigate("/interno/config?session=Marketplaces");
            }}
          />
        </>
      );
    }
    if (step.label === "Contas de Colaboradores") {
      return (
        <>
          <p className="text-nowrap">
            Você possui {colabExcedentBenefits} colaboradores excedentes.
          </p>
          <BeergamButton
            title="Gerenciar Colaboradores"
            onClick={() => {
              onButtonClick();
              navigate("/interno/config?session=Colaboradores");
            }}
          />
        </>
      );
    }
  }
  useEffect(() => {
    setStepsAvailable([
      {
        access: marketplaceAccountsExcedentBenefits > 0,
        label: "Contas de Marketplaces",
      },
      {
        access: colabExcedentBenefits > 0,
        label: "Contas de Colaboradores",
      },
    ]);
  }, [marketplaceAccountsExcedentBenefits, colabExcedentBenefits]);
  if (colabExcedentBenefits <= 0 && marketplaceAccountsExcedentBenefits <= 0)
    return null;
  return (
    <>
      <div className="flex flex-col gap-2 items-center justify-center text-center">
        <h2>Você Possui Benefícios Excedentes.</h2>
        <p>
          Remova os benefícios excedentes para continuar a mudança de plano.
        </p>
        {/* <div className="flex items-center justify-center gap-2 p-2 bg-beergam-yellow/10 rounded-md border border-beergam-yellow">
          <Svg.alert
            width="24px"
            height="24px"
            tailWindClasses="text-beergam-yellow"
          />
          <p>
            Se nenhum benefício for selecionado, <u>TODOS</u> os benefícios
            serão removidos.
          </p>
        </div> */}
        <Stepper activeStep={steps} alternativeLabel>
          {stepsAvailableFiltered.map((step, index) => (
            <Step key={index}>
              <StepLabel className="text-nowrap!">{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <>
          <div className="flex flex-col gap-2 items-center justify-center text-center mt-4">
            {getStepContent(stepsAvailableFiltered[steps])}
          </div>
        </>
        <div className="flex w-full items-center justify-between gap-2">
          <BeergamButton
            title="Voltar"
            mainColor="beergam-gray"
            animationStyle="fade"
            onClick={() => {
              if (steps > 0) {
                setSteps(steps - 1);
              }
            }}
          />
          <BeergamButton
            title={`${steps < stepsAvailableFiltered.length - 1 ? "Continuar" : "Fechar"}`}
            animationStyle="slider"
            onClick={() => {
              if (steps < stepsAvailableFiltered.length - 1) {
                setSteps(steps + 1);
              }
              if (steps === stepsAvailableFiltered.length - 1) {
                onButtonClick();
              }
            }}
          />
        </div>
      </div>
    </>
  );
}

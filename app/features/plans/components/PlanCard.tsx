import React from "react";
import { getPlanIcon } from "~/features/plans/utils";
import type { Plan, PlanBenefits } from "~/features/user/typings/BaseUser";
import Svg from "~/src/assets/svgs/_index";
import BeergamButton from "~/src/components/utils/BeergamButton";
type BillingPeriod = "monthly" | "yearly";
export interface PlanProps {
  plan: Plan;
  planToCompare?: Plan | null;
  isPopular?: boolean;
  billingPeriod: BillingPeriod;
  onPlanSelect?: (plan: Plan) => void;
}

type BenefitComparison = "better" | "worse" | "same" | "none";

function CompareArrow({
  benefitComparision,
}: {
  benefitComparision: BenefitComparison;
}) {
  switch (benefitComparision) {
    case "better":
      return (
        <Svg.arrow_long_right
          width={24}
          height={24}
          tailWindClasses="text-beergam-green-primary"
        />
      );
    case "worse":
      return (
        <Svg.arrow_long_right
          width={24}
          height={24}
          tailWindClasses="text-beergam-red"
        />
      );
    case "same":
      return (
        <Svg.arrow_long_right
          width={24}
          height={24}
          tailWindClasses="text-beergam-gray-light"
        />
      );
  }
}

function BenefitSpan({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={`font-bold capitalize ${className ?? ""}`.trim()}>
      {text}
    </span>
  );
}

function toNumberIfPossible(value: unknown): number | null {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isNaN(n) ? null : n;
  }
  return null;
}

function formatBenefitValue(value: unknown): string {
  if (value === true) return "Sim";
  if (value === false) return "Não";
  if (value === null || value === undefined) return "-";
  return String(value);
}

function normalizeForComparison(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function rankGestaoFinanceira(value: unknown): number | null {
  if (typeof value !== "string") return null;
  const v = normalizeForComparison(value);

  // Aceita tanto os valores ("Básica") quanto chaves vindas de API ("básica")
  if (v === "basica" || v === "basico") return 1;
  if (v === "intermediario" || v === "intermediaria") return 2;
  if (v === "avancada" || v === "avancado") return 3;

  return null;
}

function compareBenefitValue(
  selectedValue: unknown,
  compareValue: unknown
): BenefitComparison {
  if (compareValue === undefined || compareValue === null) return "none";
  if (selectedValue === undefined || selectedValue === null) return "none";

  if (typeof selectedValue === "boolean" && typeof compareValue === "boolean") {
    // Mais intuitivo pro usuário: ter a funcionalidade (true) é melhor do que não ter (false)
    if (selectedValue === true && compareValue === false) return "better";
    if (selectedValue === false && compareValue === true) return "worse";
    return "same";
  }

  const selectedGF = rankGestaoFinanceira(selectedValue);
  const compareGF = rankGestaoFinanceira(compareValue);
  if (selectedGF !== null && compareGF !== null) {
    if (selectedGF > compareGF) return "better";
    if (selectedGF < compareGF) return "worse";
    return "same";
  }

  const selectedNumber = toNumberIfPossible(selectedValue);
  const compareNumber = toNumberIfPossible(compareValue);
  if (selectedNumber !== null && compareNumber !== null) {
    if (selectedNumber > compareNumber) return "better";
    if (selectedNumber < compareNumber) return "worse";
    return "same";
  }

  return "none";
}

function BenefitLabel({ benefitKey }: { benefitKey: keyof PlanBenefits }) {
  switch (benefitKey) {
    case "ML_accounts":
      return <>Contas de Marketplace</>;
    case "colab_accounts":
      return <>Contas de Colaborador</>;
    case "catalog_monitoring":
      return <>Monitoramento de Catálogo</>;
    case "dias_historico_vendas":
      return <>Dias de Histórico de Vendas</>;
    case "dias_registro_atividades":
      return <>Dias de Registro de Atividades</>;
    case "gestao_financeira":
      return <>Gestão Financeira</>;
    case "marketplaces_integrados":
      return <>Marketplaces Integrados</>;
    case "sincronizacao_estoque":
      return <>Sincronização de Estoque</>;
    case "clube_beergam":
      return <>Clube Beergam</>;
    case "comunidade_beergam":
      return <>Comunidade Beergam</>;
    case "ligacao_quinzenal":
      return <>Ligação Quinzenal</>;
    case "novidades_beta":
      return <>Novidades Beta</>;
  }
}

function BenefitPresenceIcon({ value }: { value: unknown }) {
  const hasBenefit =
    typeof value === "boolean"
      ? value === true
      : typeof value === "number"
        ? value > 0
        : typeof value === "string"
          ? value.trim().length > 0
          : value !== null && value !== undefined;

  return hasBenefit ? (
    <Svg.check
      width={16}
      height={16}
      tailWindClasses="text-beergam-green size-6"
    />
  ) : (
    <Svg.x width={16} height={16} tailWindClasses="text-beergam-red size-6" />
  );
}
function PlanBenefits({
  benefits,
  planToCompare,
}: {
  benefits: PlanBenefits;
  planToCompare?: Plan | null;
}) {
  if (!planToCompare) {
    return Object.entries(benefits).map(([key, value]) => {
      const benefitKey = key as keyof PlanBenefits;
      const selectedValue = value as PlanBenefits[keyof PlanBenefits];
      const isBoolean = typeof selectedValue === "boolean";

      return (
        <div key={key} className="flex items-center gap-2">
          <BenefitPresenceIcon value={selectedValue} />
          <div className="flex items-center gap-2 min-w-0">
            <span className="truncate">
              <BenefitLabel benefitKey={benefitKey} />
            </span>
            {!isBoolean && (
              <BenefitSpan text={formatBenefitValue(selectedValue)} />
            )}
          </div>
        </div>
      );
    });
  }

  return Object.entries(benefits).map(([key, value]) => {
    const benefitKey = key as keyof PlanBenefits;
    const selectedValue = value as PlanBenefits[keyof PlanBenefits];
    const compareValue = planToCompare?.benefits?.[benefitKey] as
      | PlanBenefits[keyof PlanBenefits]
      | undefined;

    const comparison = compareBenefitValue(selectedValue, compareValue);
    const valueClassName =
      comparison === "better"
        ? "text-beergam-green"
        : comparison === "worse"
          ? "text-beergam-red"
          : "text-beergam-blue-darker";

    const compareValueClassName =
      comparison === "better"
        ? "text-beergam-red"
        : comparison === "worse"
          ? "text-beergam-green"
          : "text-beergam-blue-darker";

    const dotsColorClass =
      comparison === "better"
        ? "text-beergam-green"
        : comparison === "worse"
          ? "text-beergam-red"
          : "text-beergam-gray";

    const selectedIsBoolean = typeof selectedValue === "boolean";
    const compareIsBoolean = typeof compareValue === "boolean";

    return (
      <div key={key} className="flex items-center gap-2 w-full">
        {/* Lado esquerdo (selecionado) */}
        <div className="flex items-center gap-2 min-w-0">
          <BenefitPresenceIcon value={selectedValue} />
          <span className="truncate">
            <BenefitLabel benefitKey={benefitKey} />
          </span>
          {!selectedIsBoolean && (
            <BenefitSpan
              text={formatBenefitValue(selectedValue)}
              className={valueClassName}
            />
          )}
        </div>

        {/* Pontos que ligam (cor = melhor/pior) */}
        <span
          className={`flex-1 overflow-hidden whitespace-nowrap text-xs leading-none select-none ${dotsColorClass}`}
          aria-hidden="true"
        >
          <CompareArrow benefitComparision={comparison} />
        </span>

        {/* Lado direito (comparado) */}
        <div className="flex items-center gap-2 justify-end min-w-0">
          <span className="truncate text-right text-beergam-blue-darker">
            <BenefitLabel benefitKey={benefitKey} />
          </span>
          {!compareIsBoolean && (
            <BenefitSpan
              text={formatBenefitValue(compareValue)}
              className={compareValueClassName}
            />
          )}
          <BenefitPresenceIcon value={compareValue} />
        </div>
      </div>
    );
  });
}

function createPlanHeader({
  plan,
  isPopular,
  isPlanToCompare = false,
  billingPeriod,
}: {
  plan: Plan;
  isPopular: boolean;
  isPlanToCompare?: boolean;
  billingPeriod: BillingPeriod;
}) {
  return (
    <div>
      <div
        className={`flex items-center gap-2 ${isPlanToCompare ? "flex-row-reverse" : ""}`}
      >
        <div
          className={`size-10 flex items-center justify-center ${isPopular ? "bg-beergam-orange" : "bg-beergam-blue-primary"} rounded-xl`}
        >
          {React.createElement(getPlanIcon(plan), {
            tailWindClasses: `text-beergam-white size-6`,
          })}
        </div>
        <h3
          className={`${isPopular ? "text-beergam-orange" : "text-beergam-blue-primary"}`}
        >
          {plan.display_name}
        </h3>
        {isPopular && (
          <div className="flex items-center bg-beergam-blue-primary p-1 px-3 gap-1 absolute rounded-tl-[0px] rounded-br-[0px] rounded-tr-2xl rounded-bl-2xl right-0 top-0">
            <span className="text-beergam-white text-sm">Popular</span>
            <Svg.star_solid
              width={16}
              height={16}
              tailWindClasses="text-beergam-white"
            />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <h2>
          {Number(
            billingPeriod === "monthly" ? plan.price : plan.price_1_year
          ).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </h2>
        <p className="text-beergam-gray">
          {billingPeriod === "monthly" ? "/mês" : "/ano"}
        </p>
      </div>
    </div>
  );
}

export default function PlanCard({
  plan,
  isPopular,
  billingPeriod,
  onPlanSelect,
  planToCompare,
}: PlanProps) {
  // Calcula quanto o usuário economiza escolhendo o plano anual em vez do mensal pelo período de 12 meses
  const price1Year = Number(plan.price_1_year || 0);
  const economiaAnual = plan.price * 12 - price1Year;
  const economiaAnualPercentual = (economiaAnual / (plan.price * 12)) * 100;
  return (
    <div
      className={`rounded-2xl relative bg-beergam-white p-4  text-beergam-blue-primary flex flex-col gap-2 ${isPopular ? "border-beergam-orange -translate-y-2 h-[calc(100%_+_0.5rem)]" : "border-beergam-gray"} shadow-lg overflow-hidden`}
    >
      <div className="flex items-center gap-2 justify-between">
        {createPlanHeader({
          plan,
          isPopular: isPopular ?? false,
          billingPeriod,
        })}
        {planToCompare && (
          <>
            <Svg.arrow_long_right
              width={32}
              height={32}
              tailWindClasses="text-beergam-blue-primary"
            />
            {createPlanHeader({
              plan: planToCompare,
              isPopular: false,
              isPlanToCompare: true,
              billingPeriod,
            })}
          </>
        )}
      </div>
      <div
        className={`absolute top-0 opacity-0 left-0 bg-beergam-blue-primary rounded-tl-lg rounded-br-lg p-1 px-2 text-beergam-white ${billingPeriod === "yearly" ? "opacity-100" : ""}`}
      >
        <p className="text-[12px]!">
          Economia de ~{economiaAnualPercentual.toFixed(0)}%
        </p>
      </div>
      {planToCompare ? null : (
        <p className="text-beergam-gray text-sm">{plan.description}</p>
      )}
      <div className="flex flex-col gap-2 mb-4 text-beergam-blue-darker">
        <PlanBenefits planToCompare={planToCompare} benefits={plan.benefits} />
      </div>
      {onPlanSelect && (
        <BeergamButton
          title={plan.is_current_plan ? "Plano Atual" : "Escolher Plano"}
          mainColor={
            plan.is_current_plan ? "beergam-gray" : "beergam-blue-primary"
          }
          animationStyle="slider"
          className={`w-full mt-auto`}
          onClick={() => onPlanSelect?.(plan)}
          disabled={plan.is_current_plan}
        />
      )}
    </div>
  );
}

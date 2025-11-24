import React from "react";
import { getPlanIcon } from "~/features/plans/utils";
import type { Plan, PlanBenefits } from "~/features/user/typings/BaseUser";
import Svg from "~/src/assets/svgs/_index";
import BeergamButton from "~/src/components/utils/BeergamButton";
export interface PlanProps {
  plan: Plan;
  isPopular?: boolean;
  billingPeriod: "monthly" | "yearly";
  onPlanSelect?: (plan: Plan) => void;
}

function BenefitSpan({ text }: { text: string }) {
  return <span className="font-bold capitalize">{text}</span>;
}

function BenefitText({
  benefitKey,
  value,
}: {
  benefitKey: keyof PlanBenefits;
  value: string;
}) {
  switch (benefitKey) {
    case "ML_accounts":
      return (
        <p>
          <BenefitSpan text={value} /> Contas de Marketplace
        </p>
      );
    case "colab_accounts":
      return (
        <p>
          <BenefitSpan text={value} /> Contas de Colaborador
        </p>
      );
    case "catalog_monitoring":
      return (
        <p>
          <BenefitSpan text={value} /> Monitoramento de Catálogo
        </p>
      );
    case "dias_historico_vendas":
      return (
        <p>
          <BenefitSpan text={value} /> Dias de Histórico de Vendas
        </p>
      );
    case "dias_registro_atividades":
      return (
        <p>
          <BenefitSpan text={value} /> Dias de Registro de Atividades
        </p>
      );
    case "gestao_financeira":
      return (
        <p>
          Gestão Financeira: <BenefitSpan text={value} />
        </p>
      );
    case "marketplaces_integrados":
      return (
        <p>
          <BenefitSpan text={value} /> Marketplaces Integrados
        </p>
      );
    case "sincronizacao_estoque":
      return <p>Sincronização de Estoque</p>;
    case "clube_beergam":
      return <p>Clube Beergam</p>;
    case "comunidade_beergam":
      return <p>Comunidade Beergam</p>;
    case "ligacao_quinzenal":
      return <p>Ligação Quinzenal</p>;
    case "novidades_beta":
      return <p>Novidades Beta</p>;
  }
}
function PlanBenefits({ benefits }: { benefits: PlanBenefits }) {
  return Object.entries(benefits).map(([key, value]) => (
    <div key={key} className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {typeof value === "boolean" ? (
          value ? (
            <Svg.check
              width={16}
              height={16}
              tailWindClasses="text-beergam-green size-6"
            />
          ) : (
            <Svg.x
              width={16}
              height={16}
              tailWindClasses="text-beergam-red size-6"
            />
          )
        ) : (
          <Svg.check
            width={16}
            height={16}
            tailWindClasses="text-beergam-green size-6"
          />
        )}
      </div>
      <BenefitText
        benefitKey={key as keyof PlanBenefits}
        value={value.toString()}
      />
    </div>
  ));
}

export default function PlanCard({
  plan,
  isPopular,
  billingPeriod,
  onPlanSelect,
}: PlanProps) {
  // Calcula quanto o usuário economiza escolhendo o plano anual em vez do mensal pelo período de 12 meses
  const price1Year = Number(plan.price_1_year || 0);
  const economiaAnual = plan.price * 12 - price1Year;
  const economiaAnualPercentual = (economiaAnual / (plan.price * 12)) * 100;
  return (
    <div
      className={`rounded-2xl relative bg-beergam-white p-4  text-beergam-blue-primary flex flex-col gap-2 ${isPopular ? "border-beergam-orange -translate-y-2 h-[calc(100%_+_0.5rem)]" : "border-beergam-gray"} shadow-lg overflow-hidden`}
    >
      <div className="flex items-center gap-2">
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
      <div
        className={`absolute top-0 opacity-0 left-0 bg-beergam-blue-primary rounded-tl-lg rounded-br-lg p-1 px-2 text-beergam-white ${billingPeriod === "yearly" ? "opacity-100" : ""}`}
      >
        <p className="text-[12px]!">
          Economia de ~{economiaAnualPercentual.toFixed(0)}%
        </p>
      </div>
      <div className="flex items-baseline gap-1">
        <h2
          className={
            isPopular ? "text-beergam-orange" : "text-beergam-blue-primary"
          }
        >
          {billingPeriod === "monthly"
            ? Number(plan.price).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : Number(plan.price_1_year || 0).toLocaleString("pt-BR", {
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
      <p className="text-beergam-gray text-sm">{plan.description}</p>
      <div className="flex flex-col gap-2 mb-4 text-beergam-blue-darker">
        <PlanBenefits benefits={plan.benefits} />
      </div>
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
    </div>
  );
}

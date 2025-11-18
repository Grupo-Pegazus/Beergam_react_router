import { useState } from "react";
import { toast } from "react-hot-toast";
import type { Plan } from "~/features/user/typings/BaseUser";
import Svg from "~/src/assets/svgs/_index";
import PlansSkeleton from "./PlansSkeleton";

type TMainColor = "beergam-orange" | "beergam-blue-primary";

interface PlansGridProps {
  plans: Plan[];
  isLoading: boolean;
  mainColor?: TMainColor;
  onPlanSelect: (plan: Plan) => void;
}

export default function PlansGrid({
  plans,
  isLoading,
  onPlanSelect,
  mainColor = "beergam-orange",
}: PlansGridProps) {
  const [expandedPlans, setExpandedPlans] = useState<Set<string>>(new Set());
  const [collapsingPlans, setCollapsingPlans] = useState<Set<string>>(
    new Set()
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPlanIcon = (plan: Plan) => {
    if (
      plan.display_name === "Plano Operacional" ||
      plan.display_name === "Influencer iniciante"
    ) {
      return <Svg.home width={32} height={32} />;
    }
    if (
      plan.display_name === "Plano Tático" ||
      plan.display_name === "Influencer intermediário"
    ) {
      return <Svg.building_library width={32} height={32} />;
    }
    if (
      plan.display_name === "Plano Estratégico" ||
      plan.display_name === "Influencer avançado"
    ) {
      return <Svg.graph width={32} height={32} />;
    }
  };

  // Determina qual plano é o mais popular (geralmente o do meio ou o mais vendido)
  const getPopularPlanIndex = (plansArray: Plan[]) => {
    if (!plansArray || plansArray.length === 0) return 0;

    // Retorna o índice do plano do meio como popular
    // return Math.floor(plansArray.length / 2);

    // plano que tem mais benefícios
    return 2;
  };

  // Reorganiza os planos para que o popular fique no meio do grid
  const arrangePlansWithPopularInMiddle = (
    plansArray: Plan[],
    popularIdx: number
  ) => {
    if (plansArray.length <= 2) return plansArray;

    const middleIndex = Math.floor(plansArray.length / 2);
    const popularPlan = plansArray[popularIdx];
    const otherPlans = plansArray.filter((_, idx) => idx !== popularIdx);

    // Divide os outros planos em antes e depois do meio
    const beforeMiddle = otherPlans.slice(0, middleIndex);
    const afterMiddle = otherPlans.slice(middleIndex);

    // Monta o array com o popular no meio
    return [...beforeMiddle, popularPlan, ...afterMiddle] as Plan[];
  };

  const sortedPlans =
    plans && Array.isArray(plans)
      ? [...plans].sort((a, b) => a.price - b.price)
      : [];
  const popularIndex = getPopularPlanIndex(sortedPlans);
  const arrangedPlans = arrangePlansWithPopularInMiddle(
    sortedPlans,
    popularIndex
  );

  // Função para renderizar todos os benefícios de um plano
  const renderBenefits = (plan: Plan) => {
    const benefits = [
      {
        icon: (
          <Svg.check
            width={20}
            height={20}
            tailWindClasses="stroke-beergam-green"
          />
        ),
        text: (
          <>
            <span className={`font-semibold capitalize text-${mainColor}`}>
              {plan.benefits.ML_accounts}
            </span>{" "}
            contas de marketplace
          </>
        ),
      },
      {
        icon: (
          <Svg.check
            width={20}
            height={20}
            tailWindClasses="stroke-beergam-green"
          />
        ),
        text: (
          <>
            <span className={`font-semibold capitalize text-${mainColor}`}>
              {plan.benefits.colab_accounts}
            </span>{" "}
            colaboradores
          </>
        ),
      },
      {
        icon: (
          <Svg.check
            width={20}
            height={20}
            tailWindClasses="stroke-beergam-green"
          />
        ),
        text: (
          <>
            Monitoramento de{" "}
            <span className={`font-semibold capitalize text-${mainColor}`}>
              {plan.benefits.catalog_monitoring}
            </span>{" "}
            catálogos
          </>
        ),
      },
      {
        icon: (
          <Svg.check
            width={20}
            height={20}
            tailWindClasses="stroke-beergam-green"
          />
        ),
        text: (
          <>
            <span className={`font-semibold capitalize text-${mainColor}`}>
              {plan.benefits.dias_historico_vendas}
            </span>{" "}
            dias de histórico de vendas
          </>
        ),
      },
      {
        icon: (
          <Svg.check
            width={20}
            height={20}
            tailWindClasses="stroke-beergam-green"
          />
        ),
        text: (
          <>
            <span className={`font-semibold capitalize text-${mainColor}`}>
              {plan.benefits.marketplaces_integrados}
            </span>{" "}
            marketplaces integrados
          </>
        ),
      },
      {
        icon: plan.benefits.sincronizacao_estoque ? (
          <Svg.check
            width={20}
            height={20}
            tailWindClasses="stroke-beergam-green"
          />
        ) : (
          <Svg.x width={20} height={20} tailWindClasses="stroke-beergam-red" />
        ),
        text: <>Sincronização de estoque</>,
      },
      {
        icon: (
          <Svg.check
            width={20}
            height={20}
            tailWindClasses="stroke-beergam-green"
          />
        ),
        text: (
          <>
            Gestão financeira:{" "}
            <span className={`font-semibold capitalize text-${mainColor}`}>
              {plan.benefits.gestao_financeira}
            </span>
          </>
        ),
      },
      {
        icon: (
          <Svg.check
            width={20}
            height={20}
            tailWindClasses="stroke-beergam-green"
          />
        ),
        text: (
          <>
            <span className={`font-semibold capitalize text-${mainColor}`}>
              {plan.benefits.dias_registro_atividades}
            </span>{" "}
            dias de registro de atividades
          </>
        ),
      },
      {
        icon: plan.benefits.clube_beergam ? (
          <Svg.check
            width={20}
            height={20}
            tailWindClasses="stroke-beergam-green"
          />
        ) : (
          <Svg.x width={20} height={20} tailWindClasses="stroke-beergam-red" />
        ),
        text: <>Clube Beergam</>,
      },
      {
        icon: plan.benefits.comunidade_beergam ? (
          <Svg.check
            width={20}
            height={20}
            tailWindClasses="stroke-beergam-green"
          />
        ) : (
          <Svg.x width={20} height={20} tailWindClasses="stroke-beergam-red" />
        ),
        text: <>Comunidade Beergam</>,
      },
      {
        icon: plan.benefits.ligacao_quinzenal ? (
          <Svg.check
            width={20}
            height={20}
            tailWindClasses="stroke-beergam-green"
          />
        ) : (
          <Svg.x width={20} height={20} tailWindClasses="stroke-beergam-red" />
        ),
        text: <>Ligação quinzenal</>,
      },
      {
        icon: plan.benefits.novidades_beta ? (
          <Svg.check
            width={20}
            height={20}
            tailWindClasses="stroke-beergam-green"
          />
        ) : (
          <Svg.x width={20} height={20} tailWindClasses="stroke-beergam-red" />
        ),
        text: <>Novidades Beta</>,
      },
    ];

    return benefits;
  };

  const togglePlanExpansion = (planName: string) => {
    const isCurrentlyExpanded = expandedPlans.has(planName);

    if (isCurrentlyExpanded) {
      // Iniciar animação de fadeOut
      setCollapsingPlans((prev) => new Set(prev).add(planName));

      // Após a animação, remover do estado expandido
      setTimeout(() => {
        setExpandedPlans((prev) => {
          const newSet = new Set(prev);
          newSet.delete(planName);
          return newSet;
        });
        setCollapsingPlans((prev) => {
          const newSet = new Set(prev);
          newSet.delete(planName);
          return newSet;
        });
      }, 300); // Tempo da animação fadeOut
    } else {
      // Expandir imediatamente
      setExpandedPlans((prev) => new Set(prev).add(planName));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full items-start">
      {isLoading ? (
        <PlansSkeleton />
      ) : arrangedPlans.length === 0 ? (
        <div className="col-span-full text-center text-beergam-white py-12">
          <p>Nenhum plano disponível no momento.</p>
        </div>
      ) : (
        arrangedPlans.map((plan) => {
          const isPopular =
            plan.display_name === sortedPlans[popularIndex]?.display_name;
          return (
            <div
              key={plan.display_name}
              className={`
                    relative flex flex-col
                    bg-beergam-white rounded-2xl p-8
                    border border-beergam-blue-light/30
                    transition-all duration-300 ease-in-out
                    hover:border-beergam-blue/50 hover:shadow-xl
                    ${isPopular ? "lg:scale-105 border-beergam-blue/50 shadow-lg" : ""}
                  `}
            >
              {/* Popular Badge - Top Right */}
              {isPopular && (
                <div className="absolute top-0 right-0">
                  <span className="bg-beergam-orange text-beergam-white px-4 py-1.5 rounded-bl-2xl rounded-tr-2xl text-xs font-bold">
                    Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                {/* Icon */}
                <div className="mb-4">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 bg-${mainColor} rounded-xl text-beergam-white overflow-visible`}
                  >
                    {getPlanIcon(plan)}
                  </div>
                </div>

                <h3 className="text-beergam-blue-primary text-2xl md:text-3xl font-bold mb-3">
                  {plan.display_name}
                </h3>

                {/* Description */}
                {plan.description && (
                  <p className="text-beergam-gray text-sm md:text-base mb-4 leading-relaxed">
                    {plan.description}
                  </p>
                )}

                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl md:text-5xl font-bold text-beergam-blue-primary">
                      {formatPrice(plan.price)}
                    </span>
                    <span className="text-beergam-gray text-lg">/mês</span>
                  </div>
                </div>
              </div>

              {/* Benefits List */}
              <div className="flex-1 mb-6 overflow-hidden transition-all duration-300 ease-in-out">
                {(() => {
                  const allBenefits = renderBenefits(plan);
                  const isExpanded = expandedPlans.has(plan.display_name);
                  const isCollapsing = collapsingPlans.has(plan.display_name);
                  // Quando está colapsando, ainda mostra todos para a animação
                  const shouldShowAll = isExpanded || isCollapsing;
                  const visibleBenefits = shouldShowAll
                    ? allBenefits
                    : allBenefits.slice(0, 7);
                  const hasMore = allBenefits.length > 8;

                  return (
                    <div className="space-y-4 transition-all duration-300 ease-in-out">
                      <div
                        className="space-y-4 transition-all duration-300 ease-in-out"
                        style={{
                          maxHeight: shouldShowAll ? "2000px" : "auto",
                          transition:
                            "max-height 300ms ease-in-out, opacity 300ms ease-in-out",
                        }}
                      >
                        {visibleBenefits.map((benefit, idx) => {
                          const isExtraBenefit = idx >= 7;
                          const shouldAnimateIn =
                            isExpanded && isExtraBenefit && !isCollapsing;
                          const shouldAnimateOut =
                            isCollapsing && isExtraBenefit;

                          return (
                            <div
                              key={`${plan.display_name}-${idx}`}
                              className="flex items-start transition-all duration-300 ease-in-out"
                              style={{
                                animation: shouldAnimateIn
                                  ? "slideDownFadeIn 0.4s ease-out forwards"
                                  : shouldAnimateOut
                                    ? "fadeOut 0.3s ease-in forwards"
                                    : undefined,
                                animationDelay: shouldAnimateIn
                                  ? `${(idx - 7) * 40}ms`
                                  : undefined,
                                opacity: shouldAnimateIn
                                  ? 0
                                  : shouldAnimateOut
                                    ? 1
                                    : 1,
                              }}
                            >
                              <div className="shrink-0 w-5 h-5 mt-0.5 mr-4">
                                {benefit.icon}
                              </div>
                              <span className="text-beergam-black-blue text-sm md:text-base">
                                {benefit.text}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      {hasMore && (
                        <button
                          onClick={() => togglePlanExpansion(plan.display_name)}
                          className="w-full text-center text-beergam-blue-primary hover:text-beergam-blue-dark text-sm font-medium mt-2 transition-colors duration-200"
                        >
                          {isExpanded ? "Mostrar menos" : "Mostrar mais"}
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* CTA Button */}
              {plan.is_current_plan ? (
                <button
                  disabled
                  className="w-full py-3 px-6 rounded-lg font-semibold text-beergam-blue-primary bg-beergam-blue-light/50 border border-beergam-blue-primary/20 cursor-not-allowed"
                >
                  Plano atual
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!plan.price_id) {
                      toast.error(
                        "Este plano não está disponível para assinatura no momento."
                      );
                      return;
                    }
                    onPlanSelect(plan);
                  }}
                  className={`
                        w-full py-3 px-6 rounded-lg font-semibold
                        transition-all duration-200
                        ${
                          isPopular
                            ? "bg-beergam-blue-primary text-beergam-white hover:bg-beergam-blue-dark"
                            : "bg-beergam-black-blue text-beergam-white hover:bg-beergam-blue-primary"
                        }
                      `}
                >
                  {plan.is_current_plan ? "Plano atual" : "Escolher plano"}
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

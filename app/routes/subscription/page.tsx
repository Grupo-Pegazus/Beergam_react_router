import { useState } from "react";
import { toast } from "react-hot-toast";
import PageLayout from "~/features/auth/components/PageLayout/PageLayout";
import type { Plan } from "~/features/user/typings/BaseUser";
import Svg from "~/src/assets/svgs/_index";
import Modal from "~/src/components/utils/Modal";
import PlansSkeleton from "./components/PlansSkeleton";
import StripeCheckout from "./components/StripeCheckout";

interface SubscriptionPageProps {
  plans: Plan[];
  isLoading: boolean;
}

export default function SubscriptionPage({
  plans,
  isLoading,
}: SubscriptionPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
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
      return <Svg.home />;
    }
    if (
      plan.display_name === "Plano Tático" ||
      plan.display_name === "Influencer intermediário"
    ) {
      return <Svg.building_library />;
    }
    if (
      plan.display_name === "Plano Estratégico" ||
      plan.display_name === "Influencer avançado"
    ) {
      return <Svg.graph />;
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
            <span className="font-semibold">{plan.benefits.ML_accounts}</span>{" "}
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
            <span className="font-semibold">
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
            <span className="font-semibold">
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
            <span className="font-semibold">
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
            <span className="font-semibold">
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
            <span className="font-semibold">
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
            <span className="font-semibold">
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
    <>
      <PageLayout tailwindClassName="flex items-center justify-center min-h-screen py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scale-90 origin-top">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-beergam-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Escolha seu Plano
            </h1>
            <p className="text-beergam-white text-sm md:text-lg max-w-4xl mx-auto">
              Desbloqueie todo o potencial do Beergam com nossos planos premium.
              Escolha o que melhor se adapta ao seu negócio.
            </p>
          </div>

          {/* Plans Grid */}
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
                        <span className="bg-beergam-blue text-beergam-white px-4 py-1.5 rounded-bl-2xl rounded-tr-2xl text-xs font-bold">
                          Popular
                        </span>
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="mb-6">
                      {/* Icon */}
                      <div className="mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-beergam-blue-primary rounded-xl text-beergam-white overflow-visible">
                          {plan.display_name === "Plano Operacional" ||
                          plan.display_name === "Influencer iniciante" ? (
                            <div
                              style={{
                                transform: "scale(0.5)",
                                width: "48px",
                                height: "48px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {getPlanIcon(plan)}
                            </div>
                          ) : (
                            getPlanIcon(plan)
                          )}
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
                          <span className="text-beergam-gray text-lg">
                            /mês
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Benefits List */}
                    <div className="flex-1 mb-6 overflow-hidden transition-all duration-300 ease-in-out">
                      {(() => {
                        const allBenefits = renderBenefits(plan);
                        const isExpanded = expandedPlans.has(plan.display_name);
                        const isCollapsing = collapsingPlans.has(
                          plan.display_name
                        );
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
                                onClick={() =>
                                  togglePlanExpansion(plan.display_name)
                                }
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
                          setSelectedPlan(plan);
                          setShowCheckout(true);
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
                        {plan.is_current_plan
                          ? "Plano atual"
                          : "Escolher plano"}
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Info */}
          <div className="text-center mt-8 md:mt-12 px-4">
            {/* <div className="inline-flex items-center space-x-2 text-beergam-white mb-3 flex-wrap justify-center">
            <Svg.check
              width={16}
              height={16}
              tailWindClasses="stroke-beergam-green"
            />
            <span className="font-medium text-sm md:text-base">
              Cancelamento a qualquer momento
            </span>
          </div> */}
            <p className="text-beergam-white text-xs md:text-sm max-w-xl mx-auto">
              Todos os planos incluem suporte 24/7 e garantia de satisfação de
              30 dias
            </p>
          </div>
        </div>
      </PageLayout>
      {/* Modal de Checkout */}
      {showCheckout && selectedPlan && (
        <Modal
          isOpen={showCheckout}
          onClose={() => {
            setShowCheckout(false);
            setSelectedPlan(null);
          }}
        >
          <StripeCheckout
            plan={selectedPlan}
            onSuccess={() => {
              setShowCheckout(false);
              setSelectedPlan(null);
              toast.success("Assinatura realizada com sucesso!");
            }}
            onError={(error) => {
              console.error("Erro no checkout:", error);
              toast.error(
                error || "Erro ao processar pagamento. Tente novamente."
              );
            }}
            onCancel={() => {
              setShowCheckout(false);
              setSelectedPlan(null);
            }}
          />
        </Modal>
      )}
    </>
  );
}

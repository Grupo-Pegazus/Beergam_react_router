import type { Plan } from "~/features/user/typings/User";
import PageLayout from "~/features/auth/components/PageLayout/PageLayout";
import Svg from "~/src/assets/svgs";

interface SubscriptionPageProps {
  plans: Plan[];
}

export default function SubscriptionPage({ plans }: SubscriptionPageProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPlanIcon = (plan: Plan) => {
    if (plan.display_name === "Freemium") {
      return <Svg.home />;
    }
    if (plan.display_name === "Basic") {
      return <Svg.building_library />;
    }
    if (plan.display_name === "Premium") {
      return <Svg.graph />;
    }
  };

  return (
    <PageLayout tailwindClassName="flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto p-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-beergam-white text-4xl font-bold mb-4">
            Escolha seu Plano
          </h1>
          <p className="text-beergam-white text-lg max-w-2xl mx-auto">
            Desbloqueie todo o potencial do Beergam com nossos planos premium. 
            Escolha o que melhor se adapta ao seu negócio.
          </p>
        </div>

        {/* Plans Flex */}
        <div className="flex flex-col lg:flex-row gap-6 w-full justify-center">
          {plans.sort((a, b) => a.price - b.price).map((plan) => (
            <div 
              key={plan.display_name} 
              className={`
                group relative w-[calc(100% / 3)] bg-beergam-white rounded-2xl shadow-lg/55 p-6 border-2 border-beergam-blue-light
                hover:border-beergam-blue transition-all duration-300 hover:shadow-xl
                ${plan.display_name === "Freemium" ? 'scale-105 ring-2 ring-beergam-blue z-10' : ''}
              `}
            >
              {plan.display_name === "Freemium" && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-beergam-blue text-beergam-white px-4 py-1 rounded-full text-xs font-semibold">
                    Mais Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-beergam-blue-primary rounded-xl mb-4 text-beergam-white">
                  {getPlanIcon(plan)}
                </div>
                <h3 className="text-beergam-blue-primary mb-3">
                  {plan.display_name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-beergam-orange">
                    {formatPrice(plan.price)}
                  </span>
                  <span className="text-beergam-gray ml-1">/mês</span>
                </div>
              </div>

              {/* Benefits List */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <div className="shrink-0 w-5 h-5 bg-beergam-green rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <Svg.check width={12} height={12} tailWindClasses="stroke-beergam-white" />
                  </div>
                  <span className="text-beergam-black-blue text-sm">
                    <span className="font-bold">{plan.benefits.ML_accounts}</span> contas de marketplace
                  </span>
                </div>
                
                <div className="flex items-start">
                  <div className="shrink-0 w-5 h-5 bg-beergam-green rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <Svg.check width={12} height={12} tailWindClasses="stroke-beergam-white" />
                  </div>
                  <span className="text-beergam-black-blue text-sm">
                    <span className="font-bold">{plan.benefits.colab_accounts}</span> colaboradores
                  </span>
                </div>
                
                <div className="flex items-start">
                  <div className="shrink-0 w-5 h-5 bg-beergam-green rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <Svg.check width={12} height={12} tailWindClasses="stroke-beergam-white" />
                  </div>
                  <span className="text-beergam-black-blue text-sm">
                    Monitoramento de <span className="font-bold">{plan.benefits.catalog_monitoring}</span> catálogos
                  </span>
                </div>
                
                <div className="flex items-start">
                  <div className="shrink-0 w-5 h-5 bg-beergam-green rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <Svg.check width={12} height={12} tailWindClasses="stroke-beergam-white" />
                  </div>
                  <span className="text-beergam-black-blue text-sm">
                    <span className="font-bold">{plan.benefits.dias_historico_vendas}</span> dias de histórico de vendas
                  </span>
                </div>
                
                <div className="flex items-start">
                  <div className="shrink-0 w-5 h-5 bg-beergam-green rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <Svg.check width={12} height={12} tailWindClasses="stroke-beergam-white" />
                  </div>
                  <span className="text-beergam-black-blue text-sm">
                    <span className="font-bold">{plan.benefits.marketplaces_integrados}</span> marketplaces integrados
                  </span>
                </div>
                
                {plan.benefits.sincronizacao_estoque && (
                  <div className="flex items-start">
                    <div className="shrink-0 w-5 h-5 bg-beergam-green rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <Svg.check width={12} height={12} tailWindClasses="stroke-beergam-white" />
                    </div>
                    <span className="text-beergam-black-blue text-sm">
                      Sincronização de estoque
                    </span>
                  </div>
                )}
                
                <div className="flex items-start">
                  <div className="shrink-0 w-5 h-5 bg-beergam-green rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <Svg.check width={12} height={12} tailWindClasses="stroke-beergam-white" />
                  </div>
                  <span className="text-beergam-black-blue text-sm">
                    Gestão financeira: <span className="font-bold">{plan.benefits.gestao_fincanceira}</span>
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              {plan.is_current_plan && (
                <button 
                className="w-full py-3 px-6 rounded-2xl font-medium text-beergam-blue-primary bg-beergam-blue-light hover:bg-beergam-blue-light transition-colors flex items-center justify-center gap-2">
                    <p className="text-beergam-blue-primary text-sm">Plano atual</p>
                </button>
              )}
              {!plan.is_current_plan && (
                <button 
                className="w-full py-3 px-6 rounded-2xl font-medium text-beergam-white bg-beergam-blue-primary hover:bg-beergam-orange transition-colors flex items-center justify-center gap-2">
                    <p className="text-beergam-white text-sm">Escolher plano</p>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 text-beergam-white mb-3">
            <Svg.check width={16} height={16} tailWindClasses="stroke-beergam-green" />
            <span className="font-medium">Cancelamento a qualquer momento</span>
          </div>
          <p className="text-beergam-white text-sm max-w-xl mx-auto">
            Todos os planos incluem suporte 24/7 e garantia de satisfação de 30 dias
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
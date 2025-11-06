import { useEffect, useState } from "react";
import { subscriptionService } from "~/features/plans/subscriptionService";
import type { Subscription } from "~/features/user/typings/BaseUser";
import Svg from "~/src/assets/svgs/_index";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import MinhaAssinaturaSkeleton from "./skeleton";
import { SubscriptionStatus } from "~/features/user/typings/BaseUser";


const openCenteredWindow = (url: string, width: number = 800, height: number = 800) => {

  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;
  
  const windowFeatures = [
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    'toolbar=no',
    'location=no',
    'directories=no',
    'status=no',
    'menubar=no',
    'scrollbars=yes',
    'resizable=yes'
  ].join(',');

  return window.open(url, '_blank', windowFeatures);
};

export default function MinhaAssinatura() {
  const [isBillingLoading, setIsBillingLoading] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { data: subscriptionResponse, isLoading: isLoadingSubscription, isError: isErrorSubscription } = useQuery({
    queryKey: ["subscriptionResponse"],
    queryFn: subscriptionService.getSubscription,
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (!subscriptionResponse) {
      setSubscription(null);
      return;
    }
    const data = subscriptionResponse.data as Partial<Subscription> | undefined;
    const hasValidSubscription = Boolean(
      subscriptionResponse.success && data && data.plan
    );
    setSubscription(hasValidSubscription ? (subscriptionResponse.data as Subscription) : null);
  }, [subscriptionResponse]);
  const isError = isErrorSubscription;
  if (isLoadingSubscription) {
    return <MinhaAssinaturaSkeleton />;
  }
  if (isError) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center py-8">
        <div className="text-center max-w-md">
          <h3 className="text-beergam-red text-xl font-bold mb-2">Erro ao buscar assinatura</h3>
          <p className="text-beergam-gray mb-6">Tente novamente em alguns instantes.</p>
        </div>
      </div>
    );
  }
  /**
   * Abre o portal de billing do Stripe para o cliente gerenciar sua assinatura
   */
  const handleManageBilling = async () => {
    if (!subscription) {
      console.error("Usuário não possui assinatura ativa");
      return;
    }

    setIsBillingLoading(true);
    try {
      const returnUrl = `${window.location.origin}/interno/perfil`;
      
      const response = await subscriptionService.createBillingPortalSession(
        returnUrl
      );

      if (response.success && response.data) {
        openCenteredWindow(response.data.url);
      } else {
        console.error("Erro ao criar sessão do portal", response.message);
        alert(response.message || "Erro ao acessar o portal de billing");
      }
    } catch (error) {
      console.error("Erro ao abrir portal de billing:", error);
      alert("Erro ao acessar o portal de billing. Tente novamente em alguns instantes.");
    } finally {
      setIsBillingLoading(false);
    }
  };

  /**
   * Formata uma data para exibição
   */
  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(dateObj);
  };

  /**
   * Verifica se a assinatura está em período de trial
   */
  const isInTrialPeriod = (subscription: Subscription): boolean => {
    return subscription.status === SubscriptionStatus.TRIALING;
  };

  /**
   * Verifica se a assinatura está ativa
   */
  const isSubscriptionActive = (subscription: Subscription): boolean => {
    const now = new Date();
    const endDate = typeof subscription.end_date === "string" 
      ? new Date(subscription.end_date) 
      : subscription.end_date;
    
    return endDate > now;
  };

  if (!subscription) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center py-8">
        <div className="text-center max-w-md">
          <h3 className="text-beergam-blue-primary text-xl font-bold mb-2">
            Nenhuma Assinatura Ativa
          </h3>
          <p className="text-beergam-gray mb-6">
            Você ainda não possui uma assinatura ativa. Assine um plano para começar a usar os recursos premium.
          </p>
          <button 
            onClick={() => navigate("/interno/subscription")}
            className="inline-block bg-beergam-blue-primary hover:bg-beergam-orange text-beergam-white px-6 py-3 rounded-2xl font-medium transition-colors"
          >
            Ver Planos Disponíveis
          </button>
        </div>
      </div>
    );
  }

  const subscriptionActive = isSubscriptionActive(subscription);
  const inTrial = isInTrialPeriod(subscription);

  return (
    <div className="flex flex-col gap-6">
      {/* Header da assinatura */}
      <div className="bg-beergam-blue-primary p-6 rounded-2xl text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">Minha Assinatura</h3>
          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
            inTrial 
              ? "bg-beergam-yellow text-white" 
              : subscriptionActive 
              ? "bg-beergam-green" 
              : "bg-beergam-red"
          }`}>
            {inTrial ? "Período de Teste" : subscriptionActive ? "Ativa" : "Expirada"}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm opacity-80 mb-1">Plano Atual</p>
            <p className="text-xl font-bold">{subscription.plan.display_name}</p>
          </div>
          <div>
            <p className="text-sm opacity-80 mb-1">Início</p>
            <p className="text-lg font-semibold">{subscription.start_date ? formatDate(subscription.start_date) : "N/A"}</p>
          </div>
          <div>
            <p className="text-sm opacity-80 mb-1">
              {inTrial ? "Trial até" : "Renovação"}
            </p>
            <p className="text-lg font-semibold">
              {subscription.end_date ? formatDate(subscription.end_date) : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Benefícios do plano */}
      <div className="bg-beergam-white p-6 rounded-2xl shadow-lg">
        <h4 className="text-beergam-blue-primary font-bold text-lg mb-4">
          Benefícios do Seu Plano
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-6 h-6 bg-beergam-green rounded-full flex items-center justify-center">
              <Svg.check width={14} height={14} tailWindClasses="stroke-beergam-white" />
            </div>
            <p className="text-sm text-beergam-black-blue">
              <span className="font-bold">{subscription.plan.benefits.ML_accounts}</span> contas de marketplace
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="shrink-0 w-6 h-6 bg-beergam-green rounded-full flex items-center justify-center">
              <Svg.check width={14} height={14} tailWindClasses="stroke-beergam-white" />
            </div>
            <p className="text-sm text-beergam-black-blue">
              <span className="font-bold">{subscription.plan.benefits.colab_accounts}</span> colaboradores
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="shrink-0 w-6 h-6 bg-beergam-green rounded-full flex items-center justify-center">
              <Svg.check width={14} height={14} tailWindClasses="stroke-beergam-white" />
            </div>
            <p className="text-sm text-beergam-black-blue">
              Monitoramento de <span className="font-bold">{subscription.plan.benefits.catalog_monitoring}</span> catálogos
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="shrink-0 w-6 h-6 bg-beergam-green rounded-full flex items-center justify-center">
              <Svg.check width={14} height={14} tailWindClasses="stroke-beergam-white" />
            </div>
            <p className="text-sm text-beergam-black-blue">
              <span className="font-bold">{subscription.plan.benefits.dias_historico_vendas}</span> dias de histórico de vendas
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="shrink-0 w-6 h-6 bg-beergam-green rounded-full flex items-center justify-center">
              <Svg.check width={14} height={14} tailWindClasses="stroke-beergam-white" />
            </div>
            <p className="text-sm text-beergam-black-blue">
              <span className="font-bold">{subscription.plan.benefits.marketplaces_integrados}</span> marketplaces integrados
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="shrink-0 w-6 h-6 bg-beergam-green rounded-full flex items-center justify-center">
              <Svg.check width={14} height={14} tailWindClasses="stroke-beergam-white" />
            </div>
            <p className="text-sm text-beergam-black-blue">
              Gestão financeira: <span className="font-bold">{subscription.plan.benefits.gestao_financeira}</span>
            </p>
          </div>

          {subscription.plan.benefits.sincronizacao_estoque && (
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-6 h-6 bg-beergam-green rounded-full flex items-center justify-center">
                <Svg.check width={14} height={14} tailWindClasses="stroke-beergam-white" />
              </div>
              <p className="text-sm text-beergam-black-blue">
                Sincronização de estoque
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Botão de gerenciar billing */}
      <div className="bg-beergam-white p-6 rounded-2xl shadow-lg">
        <h4 className="text-beergam-blue-primary font-bold text-lg mb-4">
          Gerenciar Assinatura
        </h4>
        <p className="text-beergam-gray text-sm mb-4">
          Acesse o portal para atualizar métodos de pagamento, visualizar faturas, 
          alterar seu plano ou cancelar sua assinatura.
        </p>
          <button
          onClick={handleManageBilling}
          disabled={isBillingLoading}
          className="w-full bg-beergam-blue-primary hover:bg-beergam-orange disabled:bg-beergam-gray text-beergam-white px-6 py-3 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          {isBillingLoading ? (
            <>
              <Svg.arrow_path width={20} height={20} tailWindClasses="stroke-beergam-white animate-spin" />
              <span>Carregando...</span>
            </>
          ) : (
            <>
              <Svg.card width={20} height={20} tailWindClasses="stroke-beergam-white" />
              <span>Gerenciar Assinatura</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}


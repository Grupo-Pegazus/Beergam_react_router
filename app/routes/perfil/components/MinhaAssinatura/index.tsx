import { useState } from "react";
import type { IUser } from "~/features/user/typings/User";
import { subscriptionService } from "~/features/plans/subscriptionService";
import type { Subscription } from "~/features/user/typings/BaseUser";
import Svg from "~/src/assets/svgs";
import { useNavigate } from "react-router";

interface MinhaAssinaturaProps {
  user: IUser;
}

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

export default function MinhaAssinatura({ user }: MinhaAssinaturaProps) {
  const [isLoading, setIsLoading] = useState(false);
  const subscription = user.details.subscription;
  const navigate = useNavigate();
  /**
   * Abre o portal de billing do Stripe para o cliente gerenciar sua assinatura
   */
  const handleManageBilling = async () => {
    if (!subscription) {
      console.error("Usuário não possui assinatura ativa");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Você precisa armazenar o customer_id do Stripe no backend
      // Por enquanto, vamos assumir que o customer_id está em algum campo do usuário
      // ou você vai precisar buscar do backend baseado no user.id
      
      const returnUrl = `${window.location.origin}/interno/perfil`;
      
      // TODO: Buscar o customer_id do Stripe do backend
      // Por enquanto, vamos usar o ID do usuário como referência
      // O backend vai precisar ter um campo stripe_customer_id na tabela de usuários
      // Você precisa criar um endpoint no backend que retorne o customer_id do Stripe
      
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
      setIsLoading(false);
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
    const now = new Date();
    const trialUntil = typeof subscription.free_trial_until === "string" 
      ? new Date(subscription.free_trial_until) 
      : subscription.free_trial_until;
    
    return trialUntil > now;
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
            {inTrial ? "Período de Trial" : subscriptionActive ? "Ativa" : "Expirada"}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm opacity-80 mb-1">Plano Atual</p>
            <p className="text-xl font-bold">{subscription.plan.display_name}</p>
          </div>
          <div>
            <p className="text-sm opacity-80 mb-1">Início</p>
            <p className="text-lg font-semibold">{formatDate(subscription.start_date)}</p>
          </div>
          <div>
            <p className="text-sm opacity-80 mb-1">
              {inTrial ? "Trial até" : "Renovação"}
            </p>
            <p className="text-lg font-semibold">
              {inTrial 
                ? formatDate(subscription.free_trial_until)
                : formatDate(subscription.end_date)
              }
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
              Gestão financeira: <span className="font-bold">{subscription.plan.benefits.gestao_fincanceira}</span>
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
          disabled={isLoading}
          className="w-full bg-beergam-blue-primary hover:bg-beergam-orange disabled:bg-beergam-gray text-beergam-white px-6 py-3 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Svg.arrow_path />
              <span>Carregando...</span>
            </>
          ) : (
            <>
              <Svg.card />
              <span>Gerenciar Assinatura</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}


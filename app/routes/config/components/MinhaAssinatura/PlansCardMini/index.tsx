import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import PlanCard from "~/features/plans/components/PlanCard";
import type { Plan, Subscription } from "~/features/user/typings/BaseUser";
import authStore from "~/features/store-zustand";
import { subscriptionService } from "~/features/plans/subscriptionService";
import Section from "~/src/components/ui/Section";
import BeergamButton from "~/src/components/utils/BeergamButton";
import toast from "react-hot-toast";
import { useModal } from "~/src/components/utils/Modal/useModal";
import Modal from "~/src/components/utils/Modal";
import StripeCheckout from "~/features/plans/components/StripeCheckout";

interface PlanModalContentProps {
  plan: Plan;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  onConfirmChange: () => void;
  onManageBilling: () => void;
  mutation: {
    reset: () => void;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
  };
}

function PlanModalContent({
  plan,
  isPending,
  isSuccess,
  isError,
  onConfirmChange,
  onManageBilling,
  mutation,
}: PlanModalContentProps) {
  return (
    <div className="flex flex-col gap-4">
      <PlanCard plan={plan || {}} billingPeriod="monthly" />
      {!plan?.is_current_plan && (
        <div className="flex flex-col gap-3 mt-4">
          <div className="p-4 bg-beergam-blue-primary/10 rounded-lg border border-beergam-blue-primary/20">
            <p className="text-sm text-beergam-gray mb-2">
              A mudança de plano será aplicada imediatamente à sua assinatura.
            </p>
            <p className="text-sm text-beergam-gray">
              Se deseja alterar informações do cartão ou ver mais detalhes, use
              o botão abaixo.
            </p>
          </div>
          <BeergamButton
            title="Confirmar mudança de plano"
            icon="star_solid"
            mainColor="beergam-orange"
            onClick={onConfirmChange}
            className="w-full"
            animationStyle="slider"
            fetcher={{
              fecthing: isPending,
              completed: isSuccess,
              error: isError,
              mutation: mutation,
            }}
          />
          <BeergamButton
            title="Gerenciar Assinatura"
            icon="card"
            mainColor="beergam-blue-primary"
            onClick={onManageBilling}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}

/**
 * Verifica se o plano atual da subscription é freemium
 */
const isFreemiumPlan = (subscription: Subscription | null | undefined): boolean => {
  if (!subscription) return false;
  const planName = subscription.plan.display_name.toLowerCase();
  return planName.includes("freemium") || planName.includes("gratuito") || planName.includes("free");
};

export default function PlansCardMini({ 
  plan, 
  subscription 
}: { 
  plan: Plan;
  subscription: Subscription | null;
}) {
  const { openModal, closeModal, isOpen } = useModal();
  const queryClient = useQueryClient();
  const [isMyModalOpen, setIsMyModalOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Determina se deve usar checkout ou mudança de plano
  const shouldUseCheckout = !subscription || isFreemiumPlan(subscription);

  const changePlanMutation = useMutation({
    mutationFn: async () => {
      const response = await subscriptionService.changeSubscriptionPlan(
        plan.price_id
      );

      if (!response.success) {
        throw new Error(response.message || "Erro ao alterar plano");
      }

      // Busca a subscription atualizada
      const subscriptionResponse = await subscriptionService.getSubscription();

      if (!subscriptionResponse.success || !subscriptionResponse.data) {
        throw new Error(
          subscriptionResponse.message ||
            "Erro ao atualizar assinatura. Recarregue a página."
        );
      }

      return subscriptionResponse.data;
    },
    onSuccess: (subscription) => {
      // Atualiza o authStore
      authStore.getState().updateAuthInfo({
        subscription,
        loading: false,
        error: null,
        success: true,
        usageLimitData: null,
      });

      // Invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });

      toast.success("Plano alterado com sucesso!");
      closeModal();
    },
    onError: (error: Error) => {
      console.error("Erro ao alterar plano:", error);
      toast.error(error.message || "Erro ao alterar plano. Tente novamente.");
    },
  });

  const handleManageBilling = async () => {
    const returnUrl = `${window.location.origin}/interno/config?session=Minha Assinatura`;

    const response =
      await subscriptionService.createBillingPortalSession(returnUrl);

    if (response.success && response.data) {
      const left = (window.screen.width - 800) / 2;
      const top = (window.screen.height - 800) / 2;

      const windowFeatures = [
        `width=800`,
        `height=800`,
        `left=${left}`,
        `top=${top}`,
        "toolbar=no",
        "location=no",
        "directories=no",
        "status=no",
        "menubar=no",
        "scrollbars=yes",
        "resizable=yes",
      ].join(",");

      window.open(response.data.url, "_blank", windowFeatures);
    } else {
      toast.error(response.message || "Erro ao acessar o portal de billing");
    }
  };

  const createModalContent = () => (
    <PlanModalContent
      plan={plan}
      isPending={changePlanMutation.isPending}
      isSuccess={changePlanMutation.isSuccess}
      isError={changePlanMutation.isError}
      onConfirmChange={() => changePlanMutation.mutate()}
      onManageBilling={handleManageBilling}
      mutation={changePlanMutation}
    />
  );

  useEffect(() => {
    // Só atualiza o modal se foi este componente que o abriu
    if (isOpen && isMyModalOpen) {
      // Atualiza o conteúdo do modal quando a mutation mudar para forçar re-render
      openModal(createModalContent(), { title: `Visualizar plano - ${plan?.display_name}` });
    }
  }, [
    isOpen,
    isMyModalOpen,
    changePlanMutation.isPending,
    changePlanMutation.isSuccess,
    changePlanMutation.isError,
    openModal,
    plan,
  ]);

  useEffect(() => {
    // Reseta a flag quando o modal é fechado
    if (!isOpen) {
      setIsMyModalOpen(false);
    }
  }, [isOpen]);

  const openPlanModal = () => {
    // Se deve usar checkout, abre modal de checkout diretamente
    if (shouldUseCheckout) {
      setShowCheckout(true);
      return;
    }
    // Caso contrário, abre modal de visualização/mudança de plano
    setIsMyModalOpen(true);
    openModal(createModalContent(), { title: `Visualizar plano - ${plan?.display_name}` });
  };

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    toast.success("Assinatura realizada com sucesso!");
    // Invalida queries para atualizar os dados
    queryClient.invalidateQueries({ queryKey: ["subscription"] });
    queryClient.invalidateQueries({ queryKey: ["plans"] });
  };

  const handleCheckoutError = (error: string) => {
    console.error("Erro no checkout:", error);
    toast.error(error || "Erro ao processar pagamento. Tente novamente.");
  };

  const handleCheckoutCancel = () => {
    setShowCheckout(false);
  };

  return (
    <Section
      title={plan?.display_name || ""}
      key={plan?.display_name || ""}
      onClick={openPlanModal}
      actions={
        <>
          {!plan?.is_current_plan ? (
            <BeergamButton
              title="Assinar"
              icon="star_solid"
              mainColor="beergam-orange"
              disabled={plan?.is_current_plan || changePlanMutation.isPending}
              onClick={openPlanModal}
            />
          ) : (
            // <BeergamButton
            //   title="Atual"
            //   icon="check_solid"
            //   mainColor="beergam-blue-primary"
            // />
            <p className="text-beergam-blue-primary font-bold px-4 py-2 rounded-2xl bg-beergam-blue-primary/10">
              Atual
            </p>
          )}
        </>
      }
    >
      <div className="flex md:flex-row flex-col gap-2">
        {" "}
        <div>
          <h3 className="text-beergam-gray">
            {plan?.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}{" "}
            /mês
          </h3>
          <p>{plan?.description}</p>
        </div>
        {plan?.display_name == "Plano Estratégico" && (
          <Section
            title="Comunidade Beergam"
            className="bg-beergam-blue-primary text-beergam-white"
            titleClassName="text-beergam-white!"
          >
            <hr className="mb-4" />
            <p>
              Ao assinar o plano Estratégico, você também terá acesso à
              comunidade Beergam, onde você pode compartilhar suas ideias e
              projetos com outros usuários do sistema.
            </p>
          </Section>
        )}
      </div>
      {/* Modal de checkout para quando não há assinatura ou é freemium */}
      <Modal
        isOpen={showCheckout}
        onClose={handleCheckoutCancel}
      >
        <StripeCheckout
          plan={plan}
          onSuccess={handleCheckoutSuccess}
          onError={handleCheckoutError}
          onCancel={handleCheckoutCancel}
        />
      </Modal>
    </Section>
  );
}

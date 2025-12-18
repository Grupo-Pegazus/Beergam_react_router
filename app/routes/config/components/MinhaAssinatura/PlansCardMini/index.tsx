import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "~/features/auth/hooks";
import PlanCard from "~/features/plans/components/PlanCard";
import StripeCheckout from "~/features/plans/components/StripeCheckout";
import { subscriptionService } from "~/features/plans/subscriptionService";
import authStore from "~/features/store-zustand";
import type { Plan, Subscription } from "~/features/user/typings/BaseUser";
import Svg from "~/src/assets/svgs/_index";
import Section from "~/src/components/ui/Section";
import BeergamButton from "~/src/components/utils/BeergamButton";
import Modal from "~/src/components/utils/Modal";
import { useModal } from "~/src/components/utils/Modal/useModal";

type PlanModalType = "Visualizar" | "Comparar";

interface PlanModalContentProps {
  plan: Plan;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  onConfirmChange: () => void;
  mutation: {
    reset: () => void;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
  };
  type: PlanModalType;
}

function PlanModalContent({
  plan,
  isPending,
  isSuccess,
  isError,
  onConfirmChange,
  mutation,
  type,
}: PlanModalContentProps) {
  const currentPlan = useAuth().authInfo.subscription?.plan;
  return (
    <div className="flex flex-col gap-4">
      <PlanCard
        plan={plan || {}}
        billingPeriod="monthly"
        planToCompare={type === "Comparar" ? currentPlan : null}
      />
      {!plan?.is_current_plan && type === "Comparar" && (
        <div className="flex flex-col gap-3 mt-4">
          <div className="p-4 bg-beergam-blue-primary/10 rounded-lg border border-beergam-blue-primary/20">
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center gap-2 p-2 border border-beergam-gray/20 rounded-lg">
                <Svg.arrow_long_right
                  width={20}
                  height={20}
                  tailWindClasses="text-beergam-gray"
                />
                <p className="text-sm text-beergam-gray">Igual</p>
              </div>
              <div className="flex items-center gap-2 p-2 border border-beergam-green-primary/20 rounded-lg">
                <Svg.arrow_long_right
                  width={20}
                  height={20}
                  tailWindClasses="text-beergam-green-primary"
                />
                <p className="text-sm text-beergam-green-primary">Melhoria</p>
              </div>
              <div className="flex items-center gap-2 p-2 border border-beergam-red/20 rounded-lg">
                <Svg.arrow_long_right
                  width={20}
                  height={20}
                  tailWindClasses="text-beergam-red"
                />
                <p className="text-sm text-beergam-red">Pioria</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Svg.information_circle
                width={20}
                height={20}
                tailWindClasses="text-beergam-gray"
              />
              <p className="text-sm text-beergam-gray">
                A mudança de plano será aplicada imediatamente à sua assinatura.
              </p>
            </div>
          </div>
          <BeergamButton
            title="Confirmar Mudança de Plano"
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
        </div>
      )}
    </div>
  );
}

/**
 * Verifica se o plano atual da subscription é freemium
 */
const isFreemiumPlan = (
  subscription: Subscription | null | undefined
): boolean => {
  if (!subscription?.plan?.display_name) return false;
  const planName = subscription.plan.display_name.toLowerCase();
  return (
    planName.includes("freemium") ||
    planName.includes("gratuito") ||
    planName.includes("free")
  );
};

export default function PlansCardMini({
  plan,
  subscription,
}: {
  plan: Plan;
  subscription: Subscription | null;
}) {
  const { openModal, closeModal, isOpen } = useModal();
  const queryClient = useQueryClient();
  const [isMyModalOpen, setIsMyModalOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [planModalType, setPlanModalType] = useState<"Visualizar" | "Comparar">(
    "Visualizar"
  );
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

  const createModalContent = (type: PlanModalType) => (
    <PlanModalContent
      plan={plan}
      isPending={changePlanMutation.isPending}
      isSuccess={changePlanMutation.isSuccess}
      isError={changePlanMutation.isError}
      onConfirmChange={() => changePlanMutation.mutate()}
      mutation={changePlanMutation}
      type={type}
    />
  );

  useEffect(() => {
    // Só atualiza o modal se foi este componente que o abriu
    if (isOpen && isMyModalOpen) {
      // Atualiza o conteúdo do modal quando a mutation mudar para forçar re-render
      openModal(createModalContent(planModalType), {
        title: `${planModalType} Plano - ${plan?.display_name}`,
      });
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
    openModal(createModalContent(planModalType), {
      title: `${planModalType} Plano - ${plan?.display_name}`,
    });
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
      onClick={() => {
        setPlanModalType("Visualizar");
        openPlanModal();
      }}
      actions={
        <>
          {!plan?.is_current_plan ? (
            <BeergamButton
              title="Assinar"
              icon="star_solid"
              mainColor="beergam-orange"
              disabled={plan?.is_current_plan || changePlanMutation.isPending}
              onClick={(e) => {
                e.stopPropagation();
                setPlanModalType("Comparar");
                openPlanModal();
              }}
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
      <Modal isOpen={showCheckout} onClose={handleCheckoutCancel}>
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

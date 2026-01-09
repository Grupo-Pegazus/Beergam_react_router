import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "~/features/auth/hooks";
import PlanCard from "~/features/plans/components/PlanCard";
import StripeCheckout from "~/features/plans/components/StripeCheckout";
import type { Plan, Subscription } from "~/features/user/typings/BaseUser";
import Svg from "~/src/assets/svgs/_index";
import Section from "~/src/components/ui/Section";
import BeergamButton from "~/src/components/utils/BeergamButton";
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
  return planName.includes("freemium") || planName.includes("Freemium");
};

export default function PlansCardMini({
  plan,
  subscription,
  onPlanSelected,
  onAssinarClick,
  changePlanMutation,
}: {
  plan: Plan;
  subscription: Subscription | null;
  onPlanSelected: (plan: Plan) => void;
  onAssinarClick: (plan: Plan) => void;
  changePlanMutation: {
    reset: () => void;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
  };
}) {
  const { openModal, closeModal, isOpen } = useModal();
  const queryClient = useQueryClient();
  const [isMyModalOpen, setIsMyModalOpen] = useState(false);
  const [planModalType, setPlanModalType] = useState<"Visualizar" | "Comparar">(
    "Visualizar"
  );

  // Determina se deve usar checkout ou mudança de plano
  // Se não tem subscription OU não tem plan válido OU é plano freemium, usa checkout (nova assinatura)
  // Caso contrário, usa mudança de plano (já tem assinatura ativa)
  // Nota: subscriptionService retorna {} quando não há subscription, então verificamos se tem plan válido
  const hasValidSubscription = subscription?.plan?.display_name;
  const shouldUseCheckout =
    !hasValidSubscription || isFreemiumPlan(subscription);

  const createModalContent = (type: PlanModalType) => (
    <PlanModalContent
      plan={plan}
      isPending={changePlanMutation.isPending}
      isSuccess={changePlanMutation.isSuccess}
      isError={changePlanMutation.isError}
      // onConfirmChange={() => changePlanMutation.mutate()}
      onConfirmChange={() => onAssinarClick(plan)}
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

  const handleCheckoutSuccess = () => {
    closeModal();
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
    closeModal();
  };

  const createCheckoutContent = () => (
    <StripeCheckout
      plan={plan}
      onSuccess={handleCheckoutSuccess}
      onError={handleCheckoutError}
      onCancel={handleCheckoutCancel}
    />
  );

  useEffect(() => {
    // Reseta as flags quando o modal é fechado
    if (!isOpen) {
      setIsMyModalOpen(false);
    }
  }, [isOpen]);

  const openPlanModal = () => {
    // Se não tem subscription ou é freemium, abre checkout diretamente (nova assinatura)
    if (shouldUseCheckout) {
      openModal(createCheckoutContent(), {
        title: `Assinar ${plan?.display_name}`,
      });
      return;
    }
    // Se já tem subscription ativa, abre modal de visualização/mudança de plano
    setIsMyModalOpen(true);
    openModal(createModalContent(planModalType), {
      title: `Visualizar plano - ${plan?.display_name}`,
    });
  };

  return (
    <Section
      title={plan?.display_name || ""}
      key={plan?.display_name || ""}
      onClick={() => {
        setPlanModalType("Visualizar");
        openPlanModal();
        onPlanSelected(plan);
      }}
      actions={
        <>
          {!plan?.is_current_plan ? (
            <BeergamButton
              title="Assinar"
              icon="star_solid"
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
          <h3 className="text-beergam-typography-secondary">
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
            className="bg-beergam-primary! text-beergam-white!"
            titleClassName="text-beergam-white!"
          >
            <hr className="mb-4" />
            <p className="text-beergam-white!">
              Ao assinar o plano Estratégico, você também terá acesso à
              comunidade Beergam, onde você pode compartilhar suas ideias e
              projetos com outros usuários do sistema.
            </p>
          </Section>
        )}
      </div>
    </Section>
  );
}

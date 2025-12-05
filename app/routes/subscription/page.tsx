import { useState } from "react";
import PageLayout from "~/features/auth/components/PageLayout/PageLayout";
import type { TAuthError } from "~/features/auth/redux";
import type { Plan } from "~/features/user/typings/BaseUser";
import BeergamButton from "~/src/components/utils/BeergamButton";
import Modal from "~/src/components/utils/Modal";
import toast from "~/src/utils/toast";
import PlansGrid from "../../features/plans/components/PlansGrid";
import StripeCheckout from "../../features/plans/components/StripeCheckout";
interface SubscriptionPageProps {
  plans: Plan[];
  isLoading: boolean;
  subscriptionError: TAuthError;
  homeSelectedPlan: Plan | null;
}

export default function SubscriptionPage({
  plans,
  isLoading,
  subscriptionError,
  homeSelectedPlan,
}: SubscriptionPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(
    homeSelectedPlan || null
  );
  const [showCheckout, setShowCheckout] = useState(
    homeSelectedPlan ? true : false
  );
  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const [showContent, setShowContent] = useState(
    subscriptionError === null || homeSelectedPlan ? true : false
  );
  return (
    <>
      <PageLayout tailwindClassName="flex items-center justify-center py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scale-90 origin-top">
          {/* Header Section */}
          {subscriptionError !== null && !showContent && (
            <div className="text-center">
              <h1 className="text-beergam-white mb-6">
                Você não possui uma assinatura ativa
              </h1>
              <h3 className="text-beergam-white">
                Você ainda{" "}
                <span className="text-beergam-blue-primary">não possui</span>{" "}
                uma assinatura ativa. Assine um plano para começar a usar os
                recursos premium.
              </h3>
              <div className="flex gap-4 w-full justify-center mt-4">
                <BeergamButton
                  onClick={() => setShowContent(true)}
                  title="Ver planos"
                  className="bg-beergam-white"
                />
              </div>
            </div>
          )}
          {showContent && (
            <>
              <div className="text-center">
                <h1 className="text-beergam-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Escolha seu Plano
                </h1>
                <p className="text-beergam-white text-sm md:text-lg max-w-4xl mx-auto">
                  Desbloqueie todo o potencial do Beergam com nossos planos
                  premium. Escolha o que melhor se adapta ao seu negócio.
                </p>
              </div>

              {/* Plans Grid */}
              <PlansGrid
                plans={plans}
                isLoading={isLoading}
                onPlanSelect={handlePlanSelect}
              />

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
                  Todos os planos incluem suporte 24/7 e garantia de satisfação
                  de 30 dias
                </p>
              </div>
            </>
          )}
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

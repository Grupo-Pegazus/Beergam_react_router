import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouteLoaderData } from "react-router";
import PageLayout from "~/features/auth/components/PageLayout/PageLayout";
import { type IAuthState } from "~/features/auth/redux";
import type { Plan } from "~/features/user/typings/BaseUser";
import Modal from "~/src/components/utils/Modal";
import PlansGrid from "./components/PlansGrid";
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
  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const rootData = useRouteLoaderData("root") as
    | { authInfo?: IAuthState }
    | undefined;
  const authInfo = rootData?.authInfo;
  const type = authInfo?.error;
  const [showContent, setShowContent] = useState(type === null ? true : false);
  return (
    <>
      <PageLayout
        showLogoutButton
        tailwindClassName="flex items-center justify-center min-h-screen py-12"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scale-90 origin-top">
          {/* Header Section */}
          {type !== null && !showContent && (
            <div className="text-center mb-16">
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
                <button
                  onClick={() => setShowContent(true)}
                  className="relative text-beergam-blue-primary bg-beergam-white font-semibold py-2 px-4 rounded-lg shadow-sm group"
                >
                  <span
                    className="absolute inset-0 left-0 top-0 h-full rounded-lg w-0 bg-beergam-blue-primary transition-all duration-300 group-hover:w-full z-0"
                    aria-hidden="true"
                  ></span>
                  <span className="relative z-10  group-hover:text-beergam-white">
                    Ver planos
                  </span>
                </button>
              </div>
            </div>
          )}
          {showContent && (
            <>
              <div className="text-center mb-16">
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

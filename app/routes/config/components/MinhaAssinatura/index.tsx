import { Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import PlanBenefitsCard from "~/features/plans/components/PlanBenefits";
import { plansService } from "~/features/plans/service";
import { subscriptionService } from "~/features/plans/subscriptionService";
import UserFields from "~/features/user/components/UserFields";
import { SubscriptionStatus } from "~/features/user/typings/BaseUser";
import Section from "~/src/components/ui/Section";
import BeergamButton from "~/src/components/utils/BeergamButton";
import PlansCardMini from "./PlansCardMini";
export default function MinhaAssinatura() {
  const { data: subscriptionResponse, isLoading: isLoadingSubscription } =
    useQuery({
      queryKey: ["subscription"],
      queryFn: subscriptionService.getSubscription,
    });
  const { data: plans, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["plans"],
    queryFn: plansService.getPlans,
  });
  const [isBillingLoading, setIsBillingLoading] = useState(false);
  const subscription = subscriptionResponse?.data;
  const openCenteredWindow = (
    url: string,
    width: number = 800,
    height: number = 800
  ) => {
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const windowFeatures = [
      `width=${width}`,
      `height=${height}`,
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

    return window.open(url, "_blank", windowFeatures);
  };
  const handleManageBilling = async () => {
    if (!subscription) {
      console.error("Usuário não possui assinatura ativa");
      return;
    }

    setIsBillingLoading(true);
    try {
      const returnUrl = `${window.location.origin}/interno/perfil`;

      const response =
        await subscriptionService.createBillingPortalSession(returnUrl);

      if (response.success && response.data) {
        openCenteredWindow(response.data.url);
      } else {
        console.error("Erro ao criar sessão do portal", response.message);
        alert(response.message || "Erro ao acessar o portal de billing");
      }
    } catch (error) {
      console.error("Erro ao abrir portal de billing:", error);
      alert(
        "Erro ao acessar o portal de billing. Tente novamente em alguns instantes."
      );
    } finally {
      setIsBillingLoading(false);
    }
  };
  return (
    <>
      <Section
        className="bg-beergam-white"
        title="Informações da Assinatura"
        actions={
          <>
            {!isLoadingSubscription && (
              <BeergamButton
                title="Gerenciar Assinatura"
                icon="card"
                onClick={handleManageBilling}
                loading={isBillingLoading}
              />
            )}
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <UserFields
              label="Status da Assinatura"
              name="status"
              canAlter={false}
              value={
                SubscriptionStatus[
                  subscription?.status as unknown as keyof typeof SubscriptionStatus
                ]
              }
              loading={isLoadingSubscription}
            />
            <UserFields
              label="Início"
              name="start_date"
              canAlter={false}
              value={
                subscription?.start_date
                  ? new Date(subscription.start_date).toLocaleDateString(
                      "pt-BR"
                    )
                  : ""
              }
              loading={isLoadingSubscription}
            />
            <UserFields
              label="Término"
              name="end_date"
              canAlter={false}
              value={
                subscription?.end_date
                  ? new Date(subscription.end_date).toLocaleDateString("pt-BR")
                  : ""
              }
              loading={isLoadingSubscription}
            />
            <UserFields
              label="Plano Atual"
              name="plan_name"
              canAlter={false}
              value={
                subscription?.plan.display_name || "Não possui plano atual"
              }
              loading={isLoadingSubscription}
            />
          </div>
          <Section title="Seus Benefícios">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <PlanBenefitsCard
                loading={isLoadingPlans}
                benefits={subscription?.plan.benefits || {}}
              />
            </div>
          </Section>
        </div>
      </Section>
      <Section title="Nossos Planos" className="bg-beergam-white">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {isLoadingPlans ? (
            <>
              <Skeleton variant="rectangular" width="100%" height={56} />
              <Skeleton variant="rectangular" width="100%" height={56} />
            </>
          ) : (
            plans?.data
              ?.filter((plan) => plan.display_name !== "Plano Estratégico")
              ?.map((plan) => (
                <PlansCardMini plan={plan} key={plan.display_name} />
              ))
          )}
        </div>
        {isLoadingPlans ? (
          <>
            <Skeleton
              variant="rectangular"
              width="100%"
              className="mt-4"
              height={126}
            />
          </>
        ) : plans?.data && plans?.data.length > 0 ? (
          plans?.data
            ?.filter((plan) => plan.display_name === "Plano Estratégico")
            ?.map((plan) => (
              <PlansCardMini plan={plan} key={plan.display_name} />
            ))
        ) : (
          <p className="text-beergam-gray">Não há planos disponíveis</p>
        )}
      </Section>
    </>
  );
}

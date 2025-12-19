import { Skeleton } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router";
import { useAuthUser } from "~/features/auth/context/AuthStoreContext";
import { marketplaceService } from "~/features/marketplace/service";
import type { BaseMarketPlace } from "~/features/marketplace/typings";
import PlanBenefitsCard from "~/features/plans/components/PlanBenefits";
import { plansService } from "~/features/plans/service";
import { subscriptionService } from "~/features/plans/subscriptionService";
import authStore from "~/features/store-zustand";
import UserFields from "~/features/user/components/UserFields";
import type {
  Plan,
  PlanBenefits,
  Subscription,
} from "~/features/user/typings/BaseUser";
import {
  SubscriptionSchema,
  SubscriptionStatus,
} from "~/features/user/typings/BaseUser";
import type { IUser } from "~/features/user/typings/User";
import { isMaster } from "~/features/user/utils";
import Section from "~/src/components/ui/Section";
import Alert from "~/src/components/utils/Alert";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { useModal } from "~/src/components/utils/Modal/useModal";
import ExcedentBenefits from "./ExcedentBenefits";
import PlansCardMini from "./PlansCardMini";
export default function MinhaAssinatura() {
  const queryClient = useQueryClient();
  function getColabsExcedent({
    //Função para calcular a quantidade de colaboradores excedentes
    user,
    selectedBenefits,
  }: {
    user: IUser;
    selectedBenefits: PlanBenefits;
  }): number {
    if (!selectedBenefits) return 0;
    const colabAccounts = Object.keys(user.colabs).length; // Quantidade de colaboradores registrados
    const maxColabAccounts = selectedBenefits.colab_accounts; // Quantidade máxima de colaboradores permitidos
    return colabAccounts - maxColabAccounts; // Quantidade de colaboradores excedentes
  }
  const changePlanMutation = useMutation({
    mutationFn: async (plan: Plan) => {
      const response = await subscriptionService.changeSubscriptionPlan(
        plan.price_id
      );

      if (!response.success) {
        if (response.error_code === 6105) {
          throw new Error("Cartão não cadastrado");
        }
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
    onSuccess: (subscription: Subscription) => {
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
      if (error.message === "Cartão não cadastrado") {
        openModal(
          <Alert type="error" closeTimer={{ time: 30000, active: true }}>
            <h3>
              Você precisa cadastrar um cartão para continuar com a assinatura.
            </h3>
            <p>Gerencie sua assinatura em "Minha Assinatura"</p>
          </Alert>,
          {
            title: "Erro ao alterar plano",
          }
        );
      }
      toast.error(error.message || "Erro ao alterar plano. Tente novamente.");
    },
  });
  function getMarketplacesAccountsExcedent({
    selectedBenefits,
    marketplaceAccounts,
  }: {
    selectedBenefits: PlanBenefits;
    marketplaceAccounts: BaseMarketPlace[];
  }): number {
    if (!selectedBenefits) return 0;
    const maxMarketplaceAccounts = selectedBenefits.ML_accounts; // Quantidade máxima de marketplaces permitidos
    return (marketplaceAccounts.length ?? 0) - maxMarketplaceAccounts; // Quantidade de marketplaces excedentes
  }
  const { data: subscriptionResponse, isLoading: isLoadingSubscription } =
    useQuery({
      queryKey: ["subscription"],
      queryFn: subscriptionService.getSubscription,
    });
  const { data: plans, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["plans"],
    queryFn: plansService.getPlans,
  });
  const { data: marketplaceAccounts } = useQuery({
    queryKey: ["marketplacesAccounts"],
    queryFn: () => marketplaceService.getMarketplacesAccounts(),
  });
  const user = useAuthUser();
  if (!user || !isMaster(user as IUser)) return null;
  const { openModal, closeModal } = useModal();
  const [isBillingLoading, setIsBillingLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [processingSession, setProcessingSession] = useState(false);
  const processedRef = useRef(false);
  const subscription = subscriptionResponse?.data;
  const setSubscription = authStore.use.setSubscription();
  // Verifica se há uma subscription válida (com plan válido)
  // Considera válido se: success é true E há um plan E o plan tem display_name (não vazio) ou outros campos
  const getPlanDisplayName = () => {
    if (!subscription?.plan) return "Não possui plano atual";
    return subscription.plan.display_name?.trim() || "Não possui plano atual";
  };
  /**
   * Trata o retorno do Stripe após pagamento
   * Quando há session_id na URL, significa que o usuário foi redirecionado após o pagamento
   */
  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId || processedRef.current) return;

    processedRef.current = true;
    setProcessingSession(true);

    const handlePaymentSuccess = async () => {
      try {
        const response = await subscriptionService.getSubscription();

        if (response.success && response.data) {
          const validatedSubscription = SubscriptionSchema.safeParse(
            response.data
          );

          if (validatedSubscription.success) {
            toast.success("Assinatura confirmada!");
            setSubscription(validatedSubscription.data);
            const params = new URLSearchParams(searchParams);
            params.delete("session_id");
            setSearchParams(params, { replace: true });
          } else {
            console.error(
              "Erro ao validar subscription:",
              validatedSubscription.error
            );
            toast.error("Erro ao validar dados da assinatura.");
            const params = new URLSearchParams(searchParams);
            params.delete("session_id");
            setSearchParams(params, { replace: true });
          }
        } else {
          console.error("Erro ao buscar subscription:", response.message);
          toast.error(response.message || "Erro ao atualizar sua assinatura.");
          const params = new URLSearchParams(searchParams);
          params.delete("session_id");
          setSearchParams(params, { replace: true });
        }
      } catch (error) {
        console.error("Erro ao buscar subscription atualizada:", error);
        toast.error("Erro ao atualizar sua assinatura.");
        const params = new URLSearchParams(searchParams);
        params.delete("session_id");
        setSearchParams(params, { replace: true });
      } finally {
        setProcessingSession(false);
      }
    };

    void handlePaymentSuccess();
  }, [searchParams, setSearchParams, setSubscription]);
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
      const returnUrl = `${window.location.origin}/interno/config?session=Minha Assinatura`;

      const response =
        await subscriptionService.createBillingPortalSession(returnUrl);

      if (response.success && response.data) {
        openCenteredWindow(response.data.url);
      } else {
        console.error("Erro ao criar sessão do portal", response.message);
        toast.error(response.message || "Erro ao acessar o portal de billing");
      }
    } catch (error) {
      console.error("Erro ao abrir portal de billing:", error);
      toast.error(
        "Erro ao acessar o portal de billing. Tente novamente em alguns instantes."
      );
    } finally {
      setIsBillingLoading(false);
    }
  };
  if (processingSession) {
    return (
      <div className="w-full flex items-center justify-center py-16 text-beergam-white">
        Confirmando pagamento...
      </div>
    );
  }

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
              value={getPlanDisplayName()}
              loading={isLoadingSubscription}
            />
          </div>
          <Section title="Seus Benefícios">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <PlanBenefitsCard
                loading={isLoadingPlans}
                benefits={subscription?.plan?.benefits ?? null}
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
                <PlansCardMini
                  plan={plan}
                  subscription={subscription || null}
                  key={plan.display_name}
                  onAssinarClick={(planSelected) => {
                    const colabExcedentBenefits = getColabsExcedent({
                      user: user as IUser,
                      selectedBenefits: planSelected.benefits as PlanBenefits,
                    });
                    const marketplaceAccountsExcedentBenefits =
                      getMarketplacesAccountsExcedent({
                        selectedBenefits: planSelected.benefits as PlanBenefits,
                        marketplaceAccounts: marketplaceAccounts?.data ?? [],
                      });
                    if (
                      colabExcedentBenefits > 0 ||
                      marketplaceAccountsExcedentBenefits > 0
                    ) {
                      openModal(
                        <ExcedentBenefits
                          onButtonClick={() => {
                            closeModal();
                          }}
                          colabExcedentBenefits={colabExcedentBenefits}
                          marketplaceAccountsExcedentBenefits={
                            marketplaceAccountsExcedentBenefits
                          }
                          selectedBenefits={planSelected?.benefits ?? null}
                        />,
                        {
                          title: "Benefícios Excedentes",
                        }
                      );
                    } else {
                      changePlanMutation.mutate(planSelected);
                    }
                  }}
                  changePlanMutation={changePlanMutation}
                  onPlanSelected={() => {}}
                />
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
              <PlansCardMini
                plan={plan}
                subscription={subscription || null}
                onPlanSelected={() => {}}
                changePlanMutation={changePlanMutation}
                onAssinarClick={(planSelected) => {
                  const colabExcedentBenefits = getColabsExcedent({
                    user: user as IUser,
                    selectedBenefits: planSelected.benefits as PlanBenefits,
                  });
                  const marketplaceAccountsExcedentBenefits =
                    getMarketplacesAccountsExcedent({
                      selectedBenefits: planSelected.benefits as PlanBenefits,
                      marketplaceAccounts: marketplaceAccounts?.data ?? [],
                    });
                  if (
                    colabExcedentBenefits > 0 ||
                    marketplaceAccountsExcedentBenefits > 0
                  ) {
                    openModal(
                      <ExcedentBenefits
                        onButtonClick={() => {
                          closeModal();
                        }}
                        colabExcedentBenefits={colabExcedentBenefits}
                        marketplaceAccountsExcedentBenefits={
                          marketplaceAccountsExcedentBenefits
                        }
                        selectedBenefits={planSelected?.benefits ?? null}
                      />
                    );
                  } else {
                    changePlanMutation.mutate(planSelected);
                  }
                }}
                key={plan.display_name}
              />
            ))
        ) : (
          <p className="text-beergam-gray">Não há planos disponíveis</p>
        )}
      </Section>
    </>
  );
}

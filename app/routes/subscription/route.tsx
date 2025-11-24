import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { updateSubscription } from "~/features/auth/redux";
import { plansService } from "~/features/plans/service";
import { subscriptionService } from "~/features/plans/subscriptionService";
import type { Plan } from "~/features/user/typings/BaseUser";
import { SubscriptionSchema } from "~/features/user/typings/BaseUser";
import SubscriptionPage from "./page";
export default function SubscriptionRoute() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [processingSession, setProcessingSession] = useState(false);
  const processedRef = useRef(false);
  const location = useLocation();
  const subscriptionError = location.state?.error;
  const homeSelectedPlan = location.state?.plan;
  const { data, isLoading, error } = useQuery({
    queryKey: ["plans"],
    queryFn: plansService.getPlans,
  });

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
            dispatch(updateSubscription(validatedSubscription.data));
            toast.success("Assinatura confirmada! Redirecionando...");
            // Limpa somente o session_id preservando outros parâmetros
            const params = new URLSearchParams(searchParams);
            params.delete("session_id");
            setSearchParams(params);
            navigate("/interno/perfil?subscription=success", { replace: true });
          } else {
            console.error(
              "Erro ao validar subscription:",
              validatedSubscription.error
            );
            toast.error("Erro ao validar dados da assinatura.");
            const params = new URLSearchParams(searchParams);
            params.delete("session_id");
            setSearchParams(params);
          }
        } else {
          console.error("Erro ao buscar subscription:", response.message);
          toast.error(response.message || "Erro ao atualizar sua assinatura.");
          const params = new URLSearchParams(searchParams);
          params.delete("session_id");
          setSearchParams(params);
        }
      } catch (error) {
        console.error("Erro ao buscar subscription atualizada:", error);
        toast.error("Erro ao atualizar sua assinatura.");
        const params = new URLSearchParams(searchParams);
        params.delete("session_id");
        setSearchParams(params);
      } finally {
        setProcessingSession(false);
      }
    };

    void handlePaymentSuccess();
  }, [searchParams, dispatch, navigate, setSearchParams]);

  if (processingSession) {
    return (
      <div className="w-full flex items-center justify-center py-16 text-beergam-white">
        Confirmando pagamento...
      </div>
    );
  }

  if (error) {
    return (
      <div>Erro ao buscar planos. Tente novamente em alguns instantes.</div>
    );
  }

  return (
    <SubscriptionPage
      subscriptionError={subscriptionError}
      plans={Array.isArray(data?.data) ? (data.data as Plan[]) : []}
      isLoading={isLoading}
      homeSelectedPlan={homeSelectedPlan}
    />
  );
}

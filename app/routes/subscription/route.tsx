import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import SubscriptionPage from "./page";
import { plansService } from "~/features/plans/service";
import { subscriptionService } from "~/features/plans/subscriptionService";
import { updateUserSubscription } from "~/features/auth/redux";
import { SubscriptionSchema } from "~/features/user/typings/BaseUser";
import type { Plan } from "~/features/user/typings/BaseUser";

export default function SubscriptionRoute() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [processingSession, setProcessingSession] = useState(false);
    const processedRef = useRef(false);
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
                    const validatedSubscription = SubscriptionSchema.safeParse(response.data);

                    if (validatedSubscription.success) {
                        dispatch(updateUserSubscription(validatedSubscription.data));
                        toast.success("Assinatura confirmada! Redirecionando...");
                        // Limpa somente o session_id preservando outros parâmetros
                        const params = new URLSearchParams(searchParams);
                        params.delete("session_id");
                        setSearchParams(params);
                        navigate("/interno/perfil?subscription=success", { replace: true });
                    } else {
                        console.error("Erro ao validar subscription:", validatedSubscription.error);
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
        return <div className="w-full flex items-center justify-center py-16 text-beergam-white">Confirmando pagamento...</div>;
    }

    if (error) {
        return <div>Erro ao buscar planos. Tente novamente em alguns instantes.</div>;
    }
    
    return <SubscriptionPage plans={data?.data as Plan[]} isLoading={isLoading} />;
}
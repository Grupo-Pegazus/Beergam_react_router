import { useQuery } from "@tanstack/react-query";
import SubscriptionPage from "./page";
import { plansService } from "~/features/plans/service";
import type { Plan } from "~/features/user/typings/BaseUser";

export default function SubscriptionRoute() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["plans"],
        queryFn: plansService.getPlans,
    });

    if (error) {
        return <div>Erro ao buscar planos. Tente novamente em alguns instantes.</div>;
    }
    return <SubscriptionPage plans={data?.data as Plan[]} isLoading={isLoading} />;
}
import { useState } from "react";
import type { Plan } from "~/features/user/typings/BaseUser";
import PlanCard from "./PlanCard";
type TMainColor = "beergam-orange" | "beergam-blue-primary";

interface PlansGridProps {
  plans: Plan[];
  isLoading?: boolean;
  mainColor?: TMainColor;
  onPlanSelect?: (plan: Plan) => void;
  isBillingAvailable?: boolean;
}
export default function PlansGrid({
  plans,
  onPlanSelect,
  isBillingAvailable,
}: PlansGridProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );

  if (!plans || !Array.isArray(plans) || plans.length === 0) {
    return <div>Nenhum plano disponível no momento.</div>;
  }
  const mostExpensivePlan = plans.reduce((prev, current) => {
    return current.price > prev.price ? current : prev;
  }, plans[0]);
  const otherPlans = plans.filter(
    (plan) => plan.display_name !== mostExpensivePlan.display_name
  );
  const midIndex = Math.floor(plans.length / 2);
  const arrangedPlans = [
    ...otherPlans.slice(0, midIndex),
    mostExpensivePlan,
    ...otherPlans.slice(midIndex),
  ];
  return (
    <div>
      {/* Toggle Monthly/Yearly */}
      <div className="flex justify-center mb-12">
        {isBillingAvailable && (
          <div className="relative inline-flex bg-beergam-black/50 border border-white/50 rounded-lg p-1">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`
              relative px-6 py-2 rounded-md text-sm font-medium z-10
              ${billingPeriod === "monthly" ? "text-white" : "text-beergam-white"}
            `}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`
              relative px-6 py-2 rounded-md text-sm font-medium z-10
              ${billingPeriod === "yearly" ? "text-white" : "text-beergam-white"}
            `}
            >
              Anual
            </button>
            {/* Indicador deslizante */}
            <div
              className={`
              absolute top-1 bottom-1 rounded-md bg-beergam-orange
              ${billingPeriod === "monthly" ? "left-1 w-[calc(50%-0.25rem)]" : "right-1 w-[calc(50%-0.25rem)]"}
            `}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full items-start">
        {arrangedPlans.map((plan) => (
          <PlanCard
            key={plan.display_name}
            plan={plan}
            isPopular={plan.display_name === mostExpensivePlan.display_name}
            billingPeriod={billingPeriod}
            onPlanSelect={() => onPlanSelect?.(plan)}
          />
        ))}
      </div>
    </div>
  );
}

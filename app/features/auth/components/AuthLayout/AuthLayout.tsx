import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import UsageTimeLimitWarning from "~/features/auth/components/UsageTimeLimitWarning/UsageTimeLimitWarning";
import authStore from "~/features/store-zustand";
export default function AuthLayout() {
  const user = authStore.use.user();
  const subscription = authStore.use.subscription();
  const error = authStore.use.error();
  const usageLimitData = authStore.use.usageLimitData();
  const navigate = useNavigate();
  const location = useLocation();
  const marketplace = authStore.use.marketplace();

  // ✅ apenas calcula a condição, sem retornar ainda
  const isUsageTimeLimit = error === "USAGE_TIME_LIMIT";

  useEffect(() => {
    if (!user) {
      navigate("/login", { viewTransition: true });
      return;
    }

    if (location.pathname !== "/interno/subscription") {
      if (marketplace === null) {
        navigate("/interno/choosen_account", { viewTransition: true });
        return;
      }
      if (subscription === null) {
        navigate("/interno/subscription", { viewTransition: true });
        return;
      }
    }
  }, [user, subscription, marketplace, location.pathname, navigate]);

  if (isUsageTimeLimit) {
    return (
      <UsageTimeLimitWarning
        message={usageLimitData?.message}
        nextAllowedAt={usageLimitData?.next_allowed_at}
        weekday={usageLimitData?.weekday}
      />
    );
  }

  return <Outlet />;
}

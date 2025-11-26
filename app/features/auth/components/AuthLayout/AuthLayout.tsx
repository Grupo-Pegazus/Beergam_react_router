import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import authStore from "~/features/store-zustand";
import UsageTimeLimitWarning from "../UsageTimeLimitWarning/UsageTimeLimitWarning";

export default function AuthLayout() {
  const user = authStore.use.user();
  const subscription = authStore.use.subscription();
  const error = authStore.use.error();
  const usageLimitData = authStore.use.usageLimitData();
  const navigate = useNavigate();
  const location = useLocation();
  if (error === "USAGE_TIME_LIMIT") {
    console.log("⏰ USAGE_TIME_LIMIT detectado, mostrando tela:", error);
    return (
      <UsageTimeLimitWarning
        message={usageLimitData?.message}
        nextAllowedAt={usageLimitData?.next_allowed_at}
        weekday={usageLimitData?.weekday}
      />
    );
  }
  useEffect(() => {
    if (!user) {
      navigate("/login", { viewTransition: true });
      return;
    }

    if (location.pathname !== "/interno/subscription") {
      if (subscription === null) {
        navigate("/interno/subscription", { viewTransition: true });
        return;
      }
      if (error) {
        navigate("/interno/subscription", {
          state: { error },
          viewTransition: true,
        });
      }
    }
  }, [user, subscription, error, location.pathname, navigate]);

  return <Outlet />;
}

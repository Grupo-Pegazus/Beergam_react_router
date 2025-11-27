import { Outlet, useNavigate } from "react-router";
import authStore from "~/features/store-zustand";
import { useAuthError } from "../../context/AuthErrorContext";
import MultipleDeviceWarning from "../MultipleDeviceWarning/MultipleDeviceWarning";
import UsageTimeLimitWarning from "../UsageTimeLimitWarning/UsageTimeLimitWarning";

export default function AuthLayout() {
  // const user = authStore.use.user();
  // const subscription = authStore.use.subscription();
  // const error = authStore.use.error();
  // const usageLimitData = authStore.use.usageLimitData();
  // const navigate = useNavigate();
  // const location = useLocation();
  // const marketplace = authStore.use.marketplace();

  // // ✅ apenas calcula a condição, sem retornar ainda
  // const isUsageTimeLimit = error === "USAGE_TIME_LIMIT";

  // useEffect(() => {
  //   if (!user) {
  //     navigate("/login", { viewTransition: true });
  //     return;
  //   }

  //   if (location.pathname !== "/interno/subscription") {
  //     if (marketplace === null && location.pathname != "/interno/perfil") {
  //       navigate("/interno/choosen_account", { viewTransition: true });
  //       return;
  //     }
  //     if (subscription === null) {
  //       navigate("/interno/subscription", { viewTransition: true });
  //       return;
  //     }
  //   }
  // }, [user, subscription, marketplace, location.pathname, navigate]);

  // if (isUsageTimeLimit) {
  //   return (
  //     <UsageTimeLimitWarning
  //       message={usageLimitData?.message}
  //       nextAllowedAt={usageLimitData?.next_allowed_at}
  //       weekday={usageLimitData?.weekday}
  //     />
  //   );
  // }
  const navigate = useNavigate();
  const authError = useAuthError();
  const user = authStore.use.user();
  if (
    authError !== null &&
    window.location.pathname !== "/interno/subscription"
  ) {
    switch (authError) {
      case "REFRESH_TOKEN_REVOKED":
        return <MultipleDeviceWarning />;
      case "SUBSCRIPTION_NOT_FOUND":
      case "SUBSCRIPTION_CANCELLED":
      case "SUBSCRIPTION_NOT_ACTIVE":
        return navigate("/interno/subscription", {
          replace: true,
          viewTransition: true,
        });
      case "USAGE_TIME_LIMIT":
        return <UsageTimeLimitWarning />
    }
  } else {
    if (!user) {
      return navigate("/login", { replace: true, viewTransition: true });
    } else {
      return <Outlet />;
    }
  }
}

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { Outlet, useNavigate } from "react-router";
import authStore from "~/features/store-zustand";
import { UserRoles } from "~/features/user/typings/BaseUser";
import { useAuthError } from "../../context/AuthErrorContext";
import { authService } from "../../service";
import MultipleDeviceWarning from "../MultipleDeviceWarning/MultipleDeviceWarning";
import UsageTimeLimitWarning from "../UsageTimeLimitWarning/UsageTimeLimitWarning";
export default function AuthLayout() {
  const navigate = useNavigate();
  const authError = useAuthError();
  const queryClient = useQueryClient();
  const user = authStore.use.user();
  const { data } = useQuery({
    queryKey: ["verifyTimeColab", user?.pin, user?.master_pin, user?.role],
    queryFn: () =>
      authService.verifyTimeColab(
        user?.pin ?? "",
        user?.master_pin ?? "",
        user?.role ?? UserRoles.COLAB
      ),
    enabled: authError === "USAGE_TIME_LIMIT",
  });
  useEffect(() => {
    if (!data) return;

    toast.success("useEffect do verifyTimeColabData");
    if (data.success) {
      authStore.setState({ error: null });
      queryClient.invalidateQueries({ queryKey: ["verifyTimeColab"] });
    } else {
      authStore.setState({ error: "USAGE_TIME_LIMIT" });
    }
  }, [data, queryClient]);
  if (
    authError !== null &&
    window.location.pathname !== "/interno/subscription"
  ) {
    switch (authError) {
      case "REFRESH_TOKEN_EXPIRED":
        return <p>amigao tu foi deslogado</p>;
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
        return (
          <>
            <p>{JSON.stringify(data)}</p>
            <UsageTimeLimitWarning />
          </>
        );
    }
  } else {
    if (!user) {
      return navigate("/login", { replace: true, viewTransition: true });
    } else {
      return <Outlet />;
    }
  }
}

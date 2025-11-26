import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import authStore from "~/features/store-zustand";

export default function AuthLayout() {
  const user = authStore.use.user();
  const subscription = authStore.use.subscription();
  const error = authStore.use.error();
  const navigate = useNavigate();
  const location = useLocation();

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

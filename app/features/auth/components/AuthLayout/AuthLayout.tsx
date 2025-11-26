import { Navigate, Outlet } from "react-router";
import authStore from "~/features/store-zustand";
export default function AuthLayout() {
  const user = authStore.use.user();
  const subscription = authStore.use.subscription();
  const error = authStore.use.error();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (window.location.pathname !== "/interno/subscription") {
    if (subscription === null) {
      return <Navigate to="/interno/subscription" replace />;
    }
    if (error) {
      return <Navigate to="/interno/subscription" state={{ error }} replace />;
    }
  }
  return (
    <>
      <Outlet />
    </>
  );
}

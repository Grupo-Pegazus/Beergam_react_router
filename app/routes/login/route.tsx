import authStore from "~/features/store-zustand";
import LoginPage from "./page";
export default function LoginRoute() {
  const marketplace = authStore.use.marketplace();
  const user = authStore.use.user();
  const success = authStore.use.success();

  // if (success) {
  //   if (marketplace) {
  //     const firstRoute = getFirstAllowedRoute(user);
  //     return <Navigate to={firstRoute} replace />;
  //   }
  //   return <Navigate to="/interno/choosen_account" replace />;
  // }
  return (
    <>
      <LoginPage isLoggedIn={{ success: success, user: user }} />
    </>
  );
}

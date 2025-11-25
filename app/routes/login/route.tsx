import { Navigate, useRouteLoaderData } from "react-router";
import { useSelector } from "react-redux";
import type { IAuthState } from "~/features/auth/redux";
import type { BaseMarketPlace } from "~/features/marketplace/typings";
import { getFirstAllowedRoute } from "~/features/menu/utils/getFirstAllowedRoute";
import type { RootState } from "~/store";
import LoginPage from "./page";
export default function LoginRoute() {
  const rootData = useRouteLoaderData("root") as
    | { marketplace?: BaseMarketPlace; authInfo?: IAuthState }
    | undefined;
  const marketplace = rootData?.marketplace;
  const authInfo = rootData?.authInfo;
  const user = useSelector((state: RootState) => state.user.user);
  
  if (authInfo?.success) {
    if (marketplace) {
      const firstRoute = getFirstAllowedRoute(user);
      return <Navigate to={firstRoute} replace />;
    }
    return <Navigate to="/interno/choosen_account" replace />;
  }
  return (
    <>
      <LoginPage />
    </>
  );
}

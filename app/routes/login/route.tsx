import { Navigate, useRouteLoaderData } from "react-router";
import type { IAuthState } from "~/features/auth/redux";
import type { BaseMarketPlace } from "~/features/marketplace/typings";
import LoginPage from "./page";
export default function LoginRoute() {
  const rootData = useRouteLoaderData("root") as
    | { marketplace?: BaseMarketPlace; authInfo?: IAuthState }
    | undefined;
  const marketplace = rootData?.marketplace;
  const authInfo = rootData?.authInfo;
  if (authInfo?.success) {
    if (marketplace) {
      return <Navigate to="/interno" replace />;
    }
    return <Navigate to="/interno/choosen_account" replace />;
  }
  return (
    <>
      <LoginPage />
    </>
  );
}

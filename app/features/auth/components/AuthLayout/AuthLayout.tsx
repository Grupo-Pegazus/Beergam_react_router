import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../hooks";
import MultipleDeviceWarning from "../MultipleDeviceWarning/MultipleDeviceWarning";

export default function AuthLayout() {
  // Usa o hook useAuth que monitora mudanças no Redux e força re-render
  const { userInfo, authInfo } = useAuth();

  if (authInfo?.error === "REFRESH_TOKEN_REVOKED") {
    return <MultipleDeviceWarning />;
  }
  if (!userInfo) return <Navigate to="/login" replace />;
  return <Outlet />;
}

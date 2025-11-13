import { useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../hooks";
import { logout } from "../../redux";
import MultipleDeviceWarning from "../MultipleDeviceWarning/MultipleDeviceWarning";

export default function AuthLayout() {
  // Usa o hook useAuth que monitora mudanças no Redux e força re-render
  const { userInfo, authInfo } = useAuth();
  const dispatch = useDispatch();
  if (authInfo?.error) {
    dispatch(logout()); //Remove as informações de redux e local storage
  }
  if (authInfo?.error === "REFRESH_TOKEN_EXPIRED") {
    return <Navigate to="/login" replace />;
  }
  if (authInfo?.error === "REFRESH_TOKEN_REVOKED") {
    return <MultipleDeviceWarning />;
  }
  if (!userInfo) return <Navigate to="/login" replace />;
  return <Outlet />;
}

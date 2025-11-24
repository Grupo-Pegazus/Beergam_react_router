import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../hooks";
import { logout } from "../../redux";
import MultipleDeviceWarning from "../MultipleDeviceWarning/MultipleDeviceWarning";
import UsageTimeLimitWarning from "../UsageTimeLimitWarning/UsageTimeLimitWarning";

export default function AuthLayout() {
  // Usa o hook useAuth que monitora mudanças no Redux e força re-render
  const { userInfo, authInfo } = useAuth();
  const dispatch = useDispatch();
  
  console.log("🔍 AuthLayout - authInfo:", authInfo);
  
  // Faz logout para todos os erros
  useEffect(() => {
    if (authInfo?.error) {
      dispatch(logout()); //Remove as informações de redux e local storage
    }
  }, [authInfo?.error, dispatch]);
  
  // Verifica erros e renderiza as telas correspondentes
  // O logout já foi feito no useEffect acima, mas o erro ainda está no Redux neste momento
  if (authInfo?.error === "REFRESH_TOKEN_EXPIRED") {
    return <Navigate to="/login" replace />;
  }
  if (authInfo?.error === "REFRESH_TOKEN_REVOKED") {
    return <MultipleDeviceWarning />;
  }
  if (authInfo?.error === "USAGE_TIME_LIMIT") {
    console.log("⏰ USAGE_TIME_LIMIT detectado, mostrando tela:", authInfo.usageLimitData);
    return (
      <UsageTimeLimitWarning
        message={authInfo.usageLimitData?.message}
        nextAllowedAt={authInfo.usageLimitData?.next_allowed_at}
        weekday={authInfo.usageLimitData?.weekday}
      />
    );
  }
  
  if (!userInfo) return <Navigate to="/login" replace />;
  return <Outlet />;
}

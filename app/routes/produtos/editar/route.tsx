import { Navigate, Outlet, useLocation } from "react-router";

export default function EditarProdutosRoute() {
    const location = useLocation();
  
    const isExactEditarProdutosRoute = 
      location.pathname === "/interno/produtos/editar"
    
    if (isExactEditarProdutosRoute) {
      return <Navigate to="/interno/produtos/gestao" replace />;
    }
  
    return (
      <Outlet />
    );
  }
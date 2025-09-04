import { Outlet } from "react-router";
import { useRouteHierarchy } from "~/hooks/useRouteHierarchy";
import { internal_routes } from "~/routes";
export default function MenuLayout() {
    const hierarchy = useRouteHierarchy();
  
    console.log("📍 Rota atual:", hierarchy.current);
    console.log("👨‍👦‍👦 Ancestrais:", hierarchy.ancestors);
    console.log("👶 Filhos:", hierarchy.children);
    console.log("👫 Irmãos:", hierarchy.siblings);
    console.log("🌳 Hierarquia completa:", hierarchy.getFullHierarchy());
  return <div>
    <h1>MenuLayout</h1>
    <p>{JSON.stringify(hierarchy)}</p>
    <Outlet />
  </div>;
}
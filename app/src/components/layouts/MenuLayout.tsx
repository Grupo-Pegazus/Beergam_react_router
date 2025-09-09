import { Outlet } from "react-router";
// import { all_routes } from "~/routes";
import { createMenuRoutes } from "~/routes";
export default function MenuLayout() {
    createMenuRoutes();
  return <div>
    <h1>MenuLayout</h1>
    {/* <p>{JSON.stringify(all_routes)}</p> */}
    <Outlet />
  </div>;
}
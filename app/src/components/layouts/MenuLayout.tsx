import { Outlet } from "react-router";
// import { all_routes } from "~/routes";
import { createMenuRoutes } from "~/routes";
import { Counter } from "~/features/counter/Counter";
import { Link } from "react-router";
export default function MenuLayout() {
    createMenuRoutes();
  return <div>
    <h1>MenuLayout</h1>
    <Link to="/interno/">Inicio</Link>
    <Link to="/interno/anuncios">Anuncios</Link>
    <Link to="/interno/atendimento/mercado_livre/perguntas">Perguntas</Link>
    <Link to="/interno/atendimento/mercado_livre/reclamacoes">Reclamações</Link>
    <Link to="/interno/atendimento/mercado_livre/mensagens">Mensagens</Link>
    {/* <p>{JSON.stringify(all_routes)}</p> */}
    <Counter />
    <Outlet />
  </div>;
}
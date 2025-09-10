import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setUser } from "~/features/auth/redux";
import { UsuarioTeste } from "~/features/auth/user/typings";
import type { Route } from "./+types/home";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function setUserFromInicio() {
    dispatch(setUser(JSON.parse(JSON.stringify(UsuarioTeste))));
    navigate("/interno");
  }

  return (
    <>
      <h1>Home</h1>
      <button onClick={setUserFromInicio}>Setar usuário</button>
    </>
  );
}

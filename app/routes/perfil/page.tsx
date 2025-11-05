import { useState } from "react";
import { useSelector } from "react-redux";
import type { IUser } from "~/features/user/typings/User";
import { type RootState } from "~/store";
import Colaboradores from "./components/Colaboradores";
import MinhaConta from "./components/MinhaConta";
import MinhaAssinatura from "./components/MinhaAssinatura";
import Impostos from "./components/Impostos";
import PerfilLayout from "./layout/PerfilLayout";
export default function PerfilPage() {
  const [activeButton, setActiveButton] = useState<string>("Minha Conta");
  const user = useSelector((state: RootState) => state.auth.user);
  function changeNavigation() {
    if (!user) return <>nenhum usuario encontrado</>;
    switch (activeButton) {
      case "Minha Conta":
        return <MinhaConta user={user} />;
      case "Colaboradores":
        return (
          <Colaboradores
            colabs={"colabs" in user ? ((user as IUser).colabs ?? []) : []}
          />
        );
      case "Minha Assinatura":
        return <MinhaAssinatura />;
      case "Impostos":
        return <Impostos />;
      default:
        return <MinhaConta user={user} />;
    }
  }
  function NavButton({
    text,
    emBreve = false,
  }: {
    text: string;
    emBreve?: boolean;
  }) {
    return (
      <button
        className={`text-beergam-white relative text-left p-2 rounded-md w-full bg-beergam-blue-primary/0 ${emBreve ? "cursor-not-allowed!" : "hover:bg-beergam-blue-primary/80"}   ${activeButton === text ? "bg-beergam-blue-primary!" : ""}`}
        onClick={() => {
          if (emBreve) return;
          console.log("cliquei no", text);
          setActiveButton(text);
        }}
      >
        {emBreve && (
          <div className="left-0 top-0 absolute w-full h-full flex justify-end items-center pr-2">
            <span className=" text-xs py-1.5 px-2.5 rounded bg-beergam-gray text-white">
              Em breve
            </span>
          </div>
        )}
        <h4>{text}</h4>
      </button>
    );
  }
  return (
    <PerfilLayout activeButton={activeButton} onSelectButton={setActiveButton}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.4fr] w-full h-full gap-4">
        {/* Menu Desktop - Sidebar */}
        <div className="p-6 flex-col right-0 bg-beergam-orange w-[60%] hidden lg:flex lg:w-full items-end absolute z-50 lg:static lg:bg-transparent lg:z-auto">
          <div className="w-[90%] flex flex-col items-start">
            <h3 className="uppercase text-beergam-white">
              CONFIGURAÇÕES DE USUÁRIO
            </h3>
            <nav className="flex flex-col gap-2 items-start w-full">
              <NavButton text="Minha Conta" />
              <NavButton text="Colaboradores" />
              <NavButton text="Minha Assinatura" />
              <NavButton text="Impostos" />
              <NavButton text="Afiliados" emBreve />
            </nav>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="bg-beergam-white p-6 rounded-tl-[16px] rounded-tr-none rounded-br-none rounded-bl-[16px] shadow-lg/55 overflow-y-auto max-h-screen">
          <h1 className="text-beergam-blue-primary mb-4">{activeButton}</h1>
          {changeNavigation()}
        </div>
      </div>
    </PerfilLayout>
  );
}

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import PageLayout from "~/features/auth/components/PageLayout/PageLayout";
import authStore from "~/features/store-zustand";
import { type IColab } from "~/features/user/typings/Colab";
import type { IUser } from "~/features/user/typings/User";
import Svg from "~/src/assets/svgs/_index";
import Colaboradores from "../config/components/Colaboradores";
import Impostos from "../config/components/Impostos";
import MinhaAssinatura from "../config/components/MinhaAssinatura/index";
import MinhaConta from "./components/MinhaConta";
import PerfilLayout from "./layout/PerfilLayout";

const LAST_ROUTE_BEFORE_PERFIL_KEY = "beergam:lastRouteBeforePerfil";
export default function PerfilPage() {
  const [activeButton, setActiveButton] = useState<string>("Minha Conta");
  const user = authStore.use.user();
  const navigate = useNavigate();
  const hasSavedRoute = useRef(false);
  const marketplace = authStore.use.marketplace();

  // Salvar a última rota quando montar o componente (primeira vez no perfil)
  useEffect(() => {
    if (hasSavedRoute.current || typeof window === "undefined") return;

    // Tentar pegar do referrer ou do histórico
    const referrer = document.referrer;
    if (referrer && !referrer.includes("/perfil")) {
      try {
        const referrerUrl = new URL(referrer);
        const referrerPath = referrerUrl.pathname;
        if (referrerPath && !referrerPath.includes("/perfil")) {
          sessionStorage.setItem(LAST_ROUTE_BEFORE_PERFIL_KEY, referrerPath);
          hasSavedRoute.current = true;
          return;
        }
      } catch {
        // Ignorar erro ao criar URL
      }
    }

    // Fallback: usar a rota do início do sistema
    const lastRoute = sessionStorage.getItem(LAST_ROUTE_BEFORE_PERFIL_KEY);
    if (!lastRoute || lastRoute.includes("/perfil")) {
      sessionStorage.setItem(LAST_ROUTE_BEFORE_PERFIL_KEY, "/interno");
    }
    hasSavedRoute.current = true;
  }, []);

  const handleVoltar = () => {
    // Tentar usar a rota salva primeiro (mais confiável)
    const lastRoute = sessionStorage.getItem(LAST_ROUTE_BEFORE_PERFIL_KEY);

    if (lastRoute && !lastRoute.includes("/perfil")) {
      navigate(lastRoute);
      return;
    }

    // Se não houver rota salva, tentar voltar no histórico
    try {
      navigate(-1);
    } catch {
      // Se falhar, usar fallback baseado no marketplace
      if (marketplace) {
        navigate("/interno");
      } else {
        navigate("/interno/choosen_account");
      }
    }
  };
  function changeNavigation() {
    if (!user) return <>nenhum usuario encontrado</>;
    switch (activeButton) {
      case "Minha Conta":
        return <MinhaConta user={user} />;
      case "Colaboradores":
        return (
          <Colaboradores
            colabs={
              "colabs" in user
                ? Object.values((user as IUser).colabs ?? {})
                : ([] as IColab[])
            }
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
      <PageLayout showLogo={false}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.4fr] w-full h-full">
          <div className="p-6 flex-col right-0 bg-beergam-orange w-[60%] hidden lg:flex lg:w-full items-end absolute z-50 lg:static lg:bg-transparent lg:z-auto">
            <div className="w-[90%] flex flex-col items-start">
              <h3 className="uppercase text-beergam-white">
                CONFIGURAÇÕES DE USUÁRIO
              </h3>
              <nav className="flex flex-col gap-2 items-start w-full">
                <button
                  onClick={handleVoltar}
                  className="text-beergam-white text-sm flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-beergam-white/10 transition-colors duration-200 font-medium group"
                >
                  <Svg.arrow_uturn_left tailWindClasses="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span>Voltar</span>
                </button>
                <NavButton text="Minha Conta" />
                <NavButton text="Colaboradores" />
                <NavButton text="Minha Assinatura" />
                <NavButton text="Impostos" />
                <NavButton text="Afiliados" emBreve />
              </nav>
            </div>
          </div>
          <div className="bg-beergam-white p-6 md:rounded-tl-[16px] rounded-tr-none rounded-br-none md:rounded-bl-[16px] shadow-lg/55 overflow-y-auto max-h-screen">
            <h1 className="text-beergam-blue-primary mb-4">{activeButton}</h1>
            {changeNavigation()}
          </div>
        </div>
      </PageLayout>
    </PerfilLayout>
  );
}

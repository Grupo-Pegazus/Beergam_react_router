import { Fade } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import PageLayout from "~/features/auth/components/PageLayout/PageLayout";
import { useAuthUser } from "~/features/auth/context/AuthStoreContext";
import authStore from "~/features/store-zustand";
import type { IColab } from "~/features/user/typings/Colab";
import type { IUser } from "~/features/user/typings/User";
import Svg from "~/src/assets/svgs/_index";
import ConfigSectionComponent from "./components/ConfigSectionComponent";
import MinhaConta from "./components/MinhaConta";
import VisaoGeral from "./components/VisaoGeral";
type SECTIONS =
  | "Visão Geral"
  | "Minha Conta"
  | "Marketplaces"
  | "Colaboradores"
  | "Minha Assinatura"
  | "Impostos"
  | "Afiliados";
interface IConfigSection {
  label: SECTIONS;
  icon: keyof typeof Svg;
}
const CONFIG_SECTIONS: IConfigSection[] = [
  { label: "Visão Geral", icon: "cog_8_tooth" },
  { label: "Minha Conta", icon: "user" },
  { label: "Marketplaces", icon: "globe" },
  { label: "Colaboradores", icon: "user_plus" },
  { label: "Minha Assinatura", icon: "card" },
  { label: "Impostos", icon: "building_library" },
  { label: "Afiliados", icon: "box" },
];

function ConfigSection({
  section,
  onClick,
  isSelected,
}: {
  section: IConfigSection;
  onClick: () => void;
  isSelected: boolean;
}) {
  const Icon = Svg[section.icon];
  return (
    <button
      className={`flex p-2 w-full rounded-lg text-left cursor-pointer gap-2 border border-transparent items-center text-beergam-white hover:bg-beergam-blue-primary/10 ${isSelected ? "bg-beergam-blue-primary! border-beergam-white!" : ""}`}
      onClick={onClick}
    >
      <Icon width={26} height={26} />
      <span className="text-sm font-medium">{section.label}</span>
    </button>
  );
}
function checkIfUrlIsAValidSession(url: string): boolean {
  return CONFIG_SECTIONS.some((section) => section.label === url)
    ? true
    : false;
}
function HandleSection(section: SECTIONS, user: IUser | IColab) {
  switch (section) {
    case "Visão Geral":
      return <VisaoGeral user={user} />;
    case "Minha Conta":
      return <MinhaConta user={user} />;
  }
}
export default function ConfigPage() {
  const searchParams = useSearchParams();
  const selectedSectionUrl = searchParams[0].get("session");
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] =
    useState<SECTIONS>("Minha Conta");
  const user = useAuthUser();
  const marketplace = authStore.use.marketplace();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    console.log(selectedSectionUrl);
    if (selectedSectionUrl) {
      if (checkIfUrlIsAValidSession(selectedSectionUrl)) {
        setSelectedSection(selectedSectionUrl as SECTIONS);
      } else {
        navigate(`/interno/config?session=Minha Conta`);
      }
    }
  }, [selectedSectionUrl]);
  return (
    <PageLayout tailwindClassName="flex justify-center">
      <div className="grid w-full relative px-4 md:w-[80%] md:px-0 grid-cols-1 md:grid-cols-[300px_1fr] gap-4">
        <div className="flex flex-col w-full gap-4">
          <div className="w-full flex justify-start items-center mt-2 md:hidden">
            <button
              className={`size-10 relavite z-1000 shadow-[2.5px_5px_5px_0px_rgba(0,0,0,0.65)] hover:translate-y-[2px] hover:shadow-transparent flex items-center text-xl! justify-center border ${menuOpen ? "shadow-transparent! translate-y-[2px]!" : ""} text-beergam-white bg-beergam-blue-primary border-beergam-white p-1 rounded-full`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <Svg.x width={26} height={26} />
              ) : (
                <Svg.hamburguer width={26} height={26} />
              )}
            </button>
          </div>
          <div className="block md:hidden">
            <Fade in={menuOpen} timeout={200}>
              <div className={`grid absolute top-14 gap-2 right-4 left-4`}>
                {CONFIG_SECTIONS.map((section) => (
                  <ConfigSection
                    key={section.label}
                    section={section}
                    onClick={() => {
                      navigate(`/interno/config?session=${section.label}`);
                      window.setTimeout(() => {
                        setMenuOpen(false);
                      }, 300);
                    }}
                    isSelected={selectedSection === section.label}
                  />
                ))}
                <button
                  className={`flex p-2 w-full rounded-lg text-left cursor-pointer gap-2 border border-transparent items-center text-beergam-white hover:bg-beergam-blue-primary/10 ${marketplace ? "" : "opacity-50 cursor-not-allowed"}`}
                  onClick={() => {
                    navigate(`/interno`);
                  }}
                >
                  <Svg.arrow_uturn_right width={26} height={26} />
                  <span className="text-sm font-medium">Acessar Programa</span>
                </button>
              </div>
            </Fade>
          </div>
          <div className="hidden md:block">
            <div className={`grid gap-2`}>
              {CONFIG_SECTIONS.map((section) => (
                <ConfigSection
                  key={section.label}
                  section={section}
                  onClick={() => {
                    navigate(`/interno/config?session=${section.label}`);
                    window.setTimeout(() => {
                      setMenuOpen(false);
                    }, 300);
                  }}
                  isSelected={selectedSection === section.label}
                />
              ))}
              <button
                className={`flex p-2 w-full rounded-lg text-left cursor-pointer gap-2 border border-transparent items-center text-beergam-white hover:bg-beergam-blue-primary/10 ${marketplace ? "" : "opacity-50 cursor-not-allowed"}`}
                onClick={() => {
                  navigate(`/interno`);
                }}
              >
                <Svg.arrow_uturn_right width={26} height={26} />
                <span className="text-sm font-medium">Acessar Programa</span>
              </button>
            </div>
          </div>
        </div>
        <ConfigSectionComponent menuOpen={menuOpen}>
          {user && HandleSection(selectedSection, user)}
        </ConfigSectionComponent>
      </div>
    </PageLayout>
  );
}

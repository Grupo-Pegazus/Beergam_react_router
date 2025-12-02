import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import PageLayout from "~/features/auth/components/PageLayout/PageLayout";
import { useAuthUser } from "~/features/auth/context/AuthStoreContext";
import Svg from "~/src/assets/svgs/_index";
import ConfigSectionComponent from "./components/ConfigSectionComponent";
import MinhaConta from "./components/MinhaConta";
type SECTIONS =
  | "Minha Conta"
  | "Colaboradores"
  | "Minha Assinatura"
  | "Impostos"
  | "Afiliados";
interface IConfigSection {
  label: SECTIONS;
  icon: keyof typeof Svg;
}
const CONFIG_SECTIONS: IConfigSection[] = [
  { label: "Minha Conta", icon: "user" },
  { label: "Colaboradores", icon: "user_plus" },
  { label: "Minha Assinatura", icon: "card" },
  { label: "Impostos", icon: "star" },
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
export default function ConfigPage() {
  const searchParams = useSearchParams();
  const selectedSectionUrl = searchParams[0].get("session");
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] =
    useState<SECTIONS>("Minha Conta");
  const user = useAuthUser();
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
      <div className="grid w-[80%] grid-cols-1 md:grid-cols-[300px_1fr] gap-4">
        <div className="flex flex-col w-full gap-4">
          <div className="text-beergam-white">
            <p className="text-lg! font-medium">{user?.name}</p>
          </div>
          <div className="grid gap-2 w-full">
            {CONFIG_SECTIONS.map((section) => (
              <ConfigSection
                key={section.label}
                section={section}
                onClick={() => {
                  navigate(`/interno/config?session=${section.label}`);
                }}
                isSelected={selectedSection === section.label}
              />
            ))}
          </div>
        </div>
        <ConfigSectionComponent>
          {selectedSection === "Minha Conta" && user && (
            <MinhaConta user={user} />
          )}
        </ConfigSectionComponent>
      </div>
    </PageLayout>
  );
}

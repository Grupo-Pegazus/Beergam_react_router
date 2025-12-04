// import ColabCard from "~/features/user/colab/components/ColabCard";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useReducer, useRef, useState } from "react";
import authStore from "~/features/store-zustand";
// import ColabInfo from "~/features/user/colab/components/ColabInfo";
// import ColabListMobile from "~/features/user/colab/components/ColabListMobile";
import ColabInfo from "~/features/user/colab/components/ColabInfo";
import ColabTable from "~/features/user/colab/components/ColabTable";
import { userService } from "~/features/user/service";
import { getDefaultColab, type IColab } from "~/features/user/typings/Colab";
import Svg from "~/src/assets/svgs/_index";
import Section from "~/src/components/ui/Section";
import BeergamButton from "~/src/components/utils/BeergamButton";
import type { ColabAction } from "../../../perfil/typings";

export default function Colaboradores({ colabs }: { colabs: IColab[] | [] }) {
  const updateColabs = authStore.use.updateColabs();
  const availableActions = {
    Editar: { icon: <Svg.pencil width={20} height={20} /> },
    Excluir: { icon: <Svg.trash width={20} height={20} /> },
    Criar: { icon: <Svg.plus_circle width={20} height={20} /> },
  };
  const initialColabState = {
    colab: null as IColab | null,
    action: null as ColabAction | null,
  };
  const [currentColab, setCurrentColab] = useReducer(
    (state: typeof initialColabState, action: typeof initialColabState) => {
      console.log("action", action);
      console.log("state", state);
      switch (action.action) {
        case "Editar":
          return { ...state, ...action };
        case "Excluir":
          if (state.colab?.pin === action.colab?.pin) {
            return { ...state, ...action, colab: null };
          } else {
            return { ...state };
          }
        case "Criar":
          return { ...state, ...action, colab: getDefaultColab() };
        default:
          return state;
      }
    },
    initialColabState
  );
  const { data } = useQuery({
    queryKey: ["getColabList"],
    queryFn: () => userService.getColabs(),
  });
  useEffect(() => {
    if (data?.success) {
      updateColabs(data.data as Record<string, IColab>);
    }
  }, [data, updateColabs]);
  const colabInfoRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar se é dispositivo móvel
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px é o breakpoint 'md' do Tailwind
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return (
    <>
      <Section
        title="Gerenciar Colaboradores"
        className="bg-beergam-white"
        actions={
          <BeergamButton
            title="Criar Colaborador"
            onClick={() => {
              setCurrentColab({ colab: null, action: "Criar" });
              if (isMobile) {
                setTimeout(() => {
                  colabInfoRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }, 100);
              }
            }}
          />
        }
      >
        <p>Quantidade de colaboradores registrados: {colabs.length}</p>
        <div className="hidden md:block">
          <ColabTable
            availableActions={Object.fromEntries(
              Object.entries(availableActions).filter(
                ([action]) => action !== "Criar"
              )
            )}
            colabs={colabs}
            onTableAction={(params) =>
              setCurrentColab({
                colab: params.colab,
                action: params.action as ColabAction,
              })
            }
            currentColabPin={currentColab.colab?.pin ?? null}
          />
        </div>
      </Section>
      <Section title="Editar Colaborador" className="bg-beergam-white">
        {currentColab.colab && currentColab.action ? (
          <ColabInfo
            colab={currentColab.colab}
            action={currentColab.action as ColabAction}
          />
        ) : (
          <p>Nenhum colaborador selecionado</p>
        )}
      </Section>
      {/* <div className="flex flex-col md:flex-row items-center justify-between pb-4">
        <p>Quantidade de colaboradores registrados: {colabs.length}</p>
        <BeergamButton
          title="Adicionar colaborador"
          mainColor="beergam-blue-primary"
          animationStyle="slider"
          onClick={() => {
            setCurrentColab({ colab: null, action: "Criar" });
            if (isMobile) {
              setTimeout(() => {
                colabInfoRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }, 100);
            }
          }}
          className="flex items-center gap-2"
        >
          <Svg.plus_circle
            width={20}
            height={20}
            tailWindClasses="stroke-beergam-white"
          />
          <span>Adicionar colaborador</span>
        </BeergamButton>
      </div>
      <div className="flex flex-col">
        <div className="hidden md:block">
          <ColabTable
            availableActions={Object.fromEntries(
              Object.entries(availableActions).filter(
                ([action]) => action !== "Criar"
              )
            )}
            colabs={colabs}
            onTableAction={(params) =>
              setCurrentColab({
                colab: params.colab,
                action: params.action as ColabAction,
              })
            }
            currentColabPin={currentColab.colab?.pin ?? null}
          />
        </div>
        <div className="md:hidden">
          <ColabListMobile
            colabs={colabs}
            onAction={(params) => {
              setCurrentColab({
                colab: params.colab,
                action: params.action as ColabAction,
              });
              if (params.action != "Excluir") {
                setTimeout(() => {
                  colabInfoRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }, 100);
              }
            }}
            currentColabPin={currentColab.colab?.pin ?? null}
          />
        </div>
        <div ref={colabInfoRef}>
          {currentColab.colab && currentColab.action && (
            <ColabInfo
              colab={currentColab.colab}
              action={currentColab.action as ColabAction}
              onColabCreated={(createdColab) => {
                setCurrentColab({
                  colab: createdColab,
                  action: "Editar",
                });
              }}
            />
          )}
        </div>
      </div> */}
    </>
  );
}

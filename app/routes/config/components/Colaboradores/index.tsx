// import ColabCard from "~/features/user/colab/components/ColabCard";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useReducer, useRef } from "react";
import authStore from "~/features/store-zustand";
// import ColabInfo from "~/features/user/colab/components/ColabInfo";
// import ColabListMobile from "~/features/user/colab/components/ColabListMobile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { type Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { authService } from "~/features/auth/service";
import { UserPasswordSchema } from "~/features/auth/typing";
import ColabListMobile from "~/features/user/colab/components/ColabListMobile";
import { userService } from "~/features/user/service";
import {
  ColabSchema,
  getDefaultColab,
  type IColab,
} from "~/features/user/typings/Colab";
import Section from "~/src/components/ui/Section";
import BeergamButton from "~/src/components/utils/BeergamButton";
import toast from "~/src/utils/toast";
import type { ColabAction } from "../../../perfil/typings";
import ColabForm from "../MinhaConta/ColabForm";

// Função para criar schema baseado na ação
const createColabFormSchema = (action: ColabAction | null) => {
  if (action === "Criar") {
    // Ao criar, senha é obrigatória
    return ColabSchema.extend({
      password: UserPasswordSchema,
    });
  } else {
    // Ao editar, senha é opcional, mas se fornecida, deve ser válida
    return ColabSchema.extend({
      password: z
        .string()
        .optional()
        .nullable()
        .refine(
          (password) => {
            // Se não forneceu senha, está ok (opcional)
            if (!password || password.trim() === "") {
              return true;
            }
            // Se forneceu senha, valida usando o UserPasswordSchema
            return UserPasswordSchema.safeParse(password).success;
          },
          {
            message:
              "Senha inválida. Deve conter pelo menos uma letra maiúscula, uma minúscula, um número, um caractere especial e ter no mínimo 8 caracteres.",
          }
        ),
    });
  }
};

type editColabFormData = z.infer<ReturnType<typeof createColabFormSchema>>;
export default function Colaboradores({ colabs }: { colabs: IColab[] | [] }) {
  const updateColab = authStore.use.updateColab();
  const createColab = authStore.use.createColab();
  const updateColabs = authStore.use.updateColabs();
  const createColabMutation = useMutation({
    mutationFn: ({ colab, password }: { colab: IColab; password: string }) =>
      authService.createColab(colab, password ?? ""),
    onSuccess: (data) => {
      if (data.success) {
        createColab(data.data);
        toast.success("Colaborador criado com sucesso");
      } else {
        throw new Error(data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const updateColabMutation = useMutation({
    mutationFn: ({ colab, password }: { colab: IColab; password: string }) =>
      userService.updateColab(colab, password ?? ""),
    onSuccess: (data) => {
      if (data.success) {
        updateColab(data.data);
        toast.success("Colaborador atualizado com sucesso");
      } else {
        throw new Error(data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
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
        case "Visualizar":
          return { ...state, ...action };
        default:
          return state;
      }
    },
    initialColabState
  );

  // Cria o schema baseado na ação atual usando useMemo
  const formSchema = useMemo(
    () => createColabFormSchema(currentColab.action),
    [currentColab.action]
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<editColabFormData>({
    resolver: zodResolver(formSchema) as unknown as Resolver<editColabFormData>,
    defaultValues: formSchema.safeParse(currentColab.colab ?? getDefaultColab())
      .data,
  });

  // Atualiza os valores do form quando a ação ou colaborador mudar
  useEffect(() => {
    const newDefaultValues = formSchema.safeParse(
      currentColab.colab ?? getDefaultColab()
    ).data;
    reset(newDefaultValues);
  }, [currentColab.action, currentColab.colab, formSchema, reset]);
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

  const onSubmit = (data: editColabFormData) => {
    if (createColabMutation.isPending || updateColabMutation.isPending) return;
    if (currentColab.action === "Criar") {
      createColabMutation.mutate({
        colab: data,
        password: data.password ?? "",
      });
    } else if (currentColab.action === "Editar") {
      updateColabMutation.mutate({
        colab: data,
        password: data.password ?? "",
      });
    }
  };
  useEffect(() => {
    if (currentColab.action !== "Excluir") {
      colabInfoRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentColab.action, currentColab.colab]);
  return (
    <>
      <Section
        title="Gerenciar Colaboradores"
        className="bg-beergam-white"
        actions={
          <BeergamButton
            title="Criar Colaborador"
            icon="user_plus"
            onClick={() => {
              setCurrentColab({ colab: null, action: "Criar" });
              setTimeout(() => {
                colabInfoRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }, 100);
            }}
          />
        }
      >
        <ColabListMobile
          colabs={colabs}
          currentAction={currentColab.action ?? null}
          currentColabPin={currentColab.colab?.pin ?? null}
          onAction={(params) =>
            setCurrentColab({
              colab: params.colab,
              action: params.action as ColabAction,
            })
          }
        />
      </Section>
      <Section
        title={
          currentColab.action === "Visualizar"
            ? "Visualizar Colaborador"
            : currentColab.action === "Criar"
              ? "Criar Colaborador"
              : "Editar Colaborador"
        }
        ref={colabInfoRef}
        actions={
          (currentColab.action === "Editar" ||
            currentColab.action === "Criar") && (
            <>
              {currentColab.action == "Editar" && (
                <BeergamButton
                  title="Reverter"
                  icon="arrow_uturn_left"
                  mainColor="beergam-red"
                  className="w-full md:w-auto"
                  onClick={() => {
                    if (currentColab.colab?.pin) {
                      const originalColab = colabs.find(
                        (colab) => colab.pin === currentColab.colab?.pin
                      );
                      if (originalColab) {
                        // Cria uma nova referência do objeto para forçar rerender
                        setCurrentColab({
                          action: "Editar",
                          colab: { ...originalColab },
                        });
                      }
                    }
                  }}
                />
              )}
              <BeergamButton
                title="Salvar Informações"
                icon="pencil_solid"
                fetcher={{
                  fecthing:
                    currentColab.action === "Criar"
                      ? createColabMutation.isPending
                      : updateColabMutation.isPending,
                  completed:
                    currentColab.action === "Criar"
                      ? createColabMutation.isSuccess
                      : updateColabMutation.isSuccess,
                  error:
                    currentColab.action === "Criar"
                      ? createColabMutation.isError
                      : updateColabMutation.isError,
                  mutation:
                    currentColab.action === "Criar"
                      ? createColabMutation
                      : updateColabMutation,
                }}
                onClick={() => {
                  handleSubmit(onSubmit, (errors) => {
                    toast.error("Você possui erros pendentes no formulário.");
                    console.warn("Erros de validação:", errors);
                  })();
                  // if (currentColab.action === "Criar") {
                  //   createColabMutation.mutate({
                  //     colab: watch(),
                  //     password: watch("password") ?? "",
                  //   });
                  // }
                }}
              />
            </>
          )
        }
        className="bg-beergam-white"
      >
        {currentColab.colab && currentColab.action ? (
          <ColabForm
            user={currentColab.colab}
            register={register}
            watch={watch}
            // handleSubmit={handleSubmit(onSubmit)}
            reset={reset}
            setValue={setValue}
            errors={errors}
            action={currentColab.action}
          />
        ) : (
          <p>Nenhum colaborador selecionado</p>
        )}
      </Section>
    </>
  );
}

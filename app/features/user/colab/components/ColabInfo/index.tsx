import { Paper, Switch } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { authService } from "~/features/auth/service";
import { UserPasswordSchema } from "~/features/auth/typing";
import {
  MenuConfig,
  type MenuKeys,
  type MenuState,
} from "~/features/menu/typings";
import { updateColab } from "~/features/user/redux";
import {
  createColabPhotoUploadService,
  userService,
} from "~/features/user/service";
import {
  WeekDay,
  WeekDayToPortuguese,
  type DayTimeAccess,
  type IAllowedTimes,
} from "~/features/user/typings/AllowedTimes";
import { FormatUserStatus, UserStatus } from "~/features/user/typings/BaseUser";
import {
  ColabLevel,
  ColabSchema,
  getDefaultColab,
  type IColab,
} from "~/features/user/typings/Colab";
import type { IUser } from "~/features/user/typings/User";
import { FormatColabLevel, isMaster } from "~/features/user/utils";
import type { ColabAction } from "~/routes/perfil/typings";
import Svg from "~/src/assets/svgs/_index";
import { Fields } from "~/src/components/utils/_fields";
import Time from "~/src/components/utils/Time";
import UploadOverlay from "~/src/components/utils/upload/components/Overlay";
import type { RootState } from "~/store";
import { EnumKeyFromValue } from "~/utils/typings/EnumKeysFromValues";
import ColabDetails from "../ColabDetails";
import ViewAccess from "../ViewAccess";
export default function ColabInfo({
  colab,
  action,
}: {
  colab: IColab | null;
  action: ColabAction | null;
}) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user } = useSelector((state: RootState) => state.user);
  const [password, setPassword] = useState("");
  const updateColabMutation = useMutation({
    mutationFn: (colab: IColab) => userService.updateColab(colab, password),
  });
  const createColabMutation = useMutation({
    mutationFn: (colab: IColab) => authService.createColab(colab, password),
  });

  // Formata Date | string | null para "HH:mm"
  const toHHmm = (value: unknown): string => {
    if (!value) return "";
    // Já está no formato "HH:mm"
    if (typeof value === "string" && /^\d{2}:\d{2}$/.test(value)) return value;
    // String ISO ou outra: tentar converter para Date
    const date: Date =
      typeof value === "string" ? new Date(value) : (value as Date);
    if (date instanceof Date && !isNaN(date.getTime())) {
      const h = date.getHours().toString().padStart(2, "0");
      const m = date.getMinutes().toString().padStart(2, "0");
      return `${h}:${m}`;
    }
    return "";
  };
  const [editedColab, setEditedColab] = useReducer(
    (state: IColab | null, action: Partial<IColab>) => {
      console.log(action);
      if (!state) return null;
      return { ...state, ...action } as IColab;
    },
    colab ?? null
  );

  const [isHoveringPhoto, setIsHoveringPhoto] = useState(false);
  const [isPhotoUploaderVisible, setIsPhotoUploaderVisible] = useState(false);

  const canUploadPhoto = Boolean(editedColab?.pin);
  const colabPhotoUploadService = useMemo(
    () =>
      editedColab?.pin ? createColabPhotoUploadService(editedColab.pin) : null,
    [editedColab?.pin]
  );

  const handleOpenPhotoUploader = useCallback(() => {
    if (!canUploadPhoto) {
      return;
    }
    setIsPhotoUploaderVisible(true);
  }, [canUploadPhoto]);

  const handleClosePhotoUploader = useCallback(() => {
    setIsPhotoUploaderVisible(false);
    setIsHoveringPhoto(false);
  }, []);

  const masterPin = useMemo(() => {
    if (user && isMaster(user)) {
      return (user as IUser).pin;
    }
    return editedColab?.master_pin ?? null;
  }, [user, editedColab?.master_pin]);

  const colabPhotoUrl = useMemo(() => {
    if (!masterPin || !editedColab?.details?.photo_id) {
      return null;
    }
    return `https://cdn.beergam.com.br/colab_photos/colab/${masterPin}/${editedColab.details.photo_id}.webp`;
  }, [masterPin, editedColab?.details?.photo_id]);

  const handleUploadSuccess = useCallback(
    (ids: string[]) => {
      if (!ids.length || !editedColab) {
        return;
      }
      const newPhotoId = ids[0];
      const updatedColab: IColab = {
        ...editedColab,
        details: {
          ...editedColab.details,
          photo_id: newPhotoId,
        },
      };
      setEditedColab(updatedColab);
      dispatch(updateColab(updatedColab));
      queryClient.invalidateQueries({ refetchType: "active" });
      handleClosePhotoUploader();
    },
    [editedColab, dispatch, handleClosePhotoUploader, queryClient]
  );

  const passwordValidation = UserPasswordSchema.safeParse(password);
  const passwordValidationError = passwordValidation.error
    ? z.treeifyError(passwordValidation.error)
    : null;
  const [isShowPassword, setIsShowPassword] = useState(false);
  const editedColabValidation = ColabSchema.safeParse(editedColab);
  const editedColabError = editedColabValidation.error
    ? z.treeifyError(editedColabValidation.error)
    : null;
  if (!editedColab)
    return (
      <div>
        <h1>Nenhum colaborador encontrado</h1>
        <p>Colab: {JSON.stringify(colab)}</p>
        <p>Edited Colab: {JSON.stringify(editedColab)}</p>
        <p>Initial Colab: {JSON.stringify(colab)}</p>
      </div>
    );
  function handleFetch() {
    if (!editedColab) return;
    if (updateColabMutation.isPending || createColabMutation.isPending) return;
    switch (action) {
      case "Criar":
        toast.promise(createColabMutation.mutateAsync(editedColab), {
          loading: "Carregando...",
          success: (data) => {
            if (!data.success) {
              throw new Error(data.message);
            }
            queryClient.invalidateQueries({ refetchType: "active" });
            return data.message;
          },
          error: "Erro ao criar colaborador",
        });
        break;
      case "Editar":
        toast.promise(updateColabMutation.mutateAsync(editedColab), {
          loading: "Carregando...",
          success: (data) => {
            if (!data.success) {
              throw new Error(data.message);
            }

            dispatch(updateColab(data.data));
            return data.message;
          },
          error: "Erro ao atualizar colaborador",
        });
        break;
      default:
        toast.error("Ação inválida");
        break;
    }
  }
  const parseTimeString = (time: string | Date): Date => {
    // Se já é Date, retorna o próprio Date
    if (time instanceof Date) {
      return time;
    }
    // Se é string "HH:mm", converte para Date
    const [hours, minutes] = time.split(":").map(Number);
    const d = new Date();
    d.setHours(hours ?? 0, minutes ?? 0, 0, 0);
    return d;
  };
  function setHorarioComercial() {
    if (!editedColab) return;
    const current = editedColab as IColab;
    // Para todos os dias em allowed_times, ajusta start_date e end_date
    setEditedColab({
      details: {
        ...current.details,
        allowed_times: ((): IAllowedTimes => {
          const entries = (Object.values(WeekDay) as WeekDay[]).map((day) => {
            const value = current.details.allowed_times[day];
            if (day === WeekDay.SATURDAY || day === WeekDay.SUNDAY) {
              // Não alterar sábado e domingo
              return [day, value] as const;
            }
            const updated: DayTimeAccess = {
              ...value,
              start_date: parseTimeString("08:00"),
              end_date: parseTimeString("20:00"),
              access: true,
            };
            return [day, updated] as const;
          });
          return Object.fromEntries(entries) as unknown as IAllowedTimes;
        })(),
      },
    });
  }
  useEffect(() => {
    setPassword("");
    setIsPhotoUploaderVisible(false);
    setIsHoveringPhoto(false);
    if (action === "Criar") {
      setEditedColab(getDefaultColab());
      setIsShowPassword(true);
    }
    if (action === "Editar" && colab) {
      setEditedColab(colab);
      setIsShowPassword(false);
    }
  }, [action, colab]);
  return (
    <>
      <hr className="h-[1px] mb-3.5 mt-5 border-beergam-gray-light" />
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-beergam-blue-primary !font-bold uppercase">
            {action === "Editar"
              ? "Editar Colaborador"
              : action === "Visualizar"
                ? "Visualizar Colaborador"
                : action === "Criar"
                  ? "Criar Colaborador"
                  : "Nenhum colaborador encontrado"}
          </h3>
        </div>
        <button className="opacity-90 hover:opacity-100">
          <Svg.trash
            stroke={"var(--color-beergam-red)"}
            width={28}
            height={28}
          />
        </button>
      </div>
      <div>
        {action === "Visualizar" ? (
          <ColabDetails colab={colab} />
        ) : (
          <div>
            <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[1fr_1.3fr]">
              <Paper className="grid md:grid-rows-2 gap-4 border-1 border-beergam-gray-light rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-4 w-full justify-items-center md:justify-items-start">
                  <div className="w-24 h-24 md:w-full md:h-full md:max-h-[80px] md:max-w-[80px] bg-beergam-orange rounded-full flex items-center justify-center">
                    <button
                      type="button"
                      className="relative flex h-full w-full items-center justify-center rounded-full bg-beergam-orange text-white transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-beergam-blue-primary disabled:cursor-not-allowed disabled:opacity-60 overflow-hidden"
                      style={{
                        backgroundImage: colabPhotoUrl
                          ? `url(${colabPhotoUrl})`
                          : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                      disabled={!canUploadPhoto}
                      onMouseEnter={() => setIsHoveringPhoto(true)}
                      onMouseLeave={() => setIsHoveringPhoto(false)}
                      onFocus={() => setIsHoveringPhoto(true)}
                      onBlur={() => setIsHoveringPhoto(false)}
                      onClick={handleOpenPhotoUploader}
                    >
                      {!colabPhotoUrl && (
                        <span
                          className={`uppercase transition-opacity duration-150 ${
                            isHoveringPhoto && canUploadPhoto
                              ? "opacity-0"
                              : "opacity-100"
                          }`}
                        >
                          {editedColab.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <span
                        className={`pointer-events-none absolute inset-0 flex items-center justify-center px-3 text-center text-[11px] font-semibold uppercase transition-opacity duration-150 bg-beergam-black-blue/60 ${
                          isHoveringPhoto || !canUploadPhoto
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        {canUploadPhoto
                          ? "Clique para alterar"
                          : "Salve o colaborador para adicionar foto"}
                      </span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                    <Fields.wrapper>
                      <Fields.label text="NOME" />
                      <Fields.input
                        onChange={(e) =>
                          setEditedColab({ name: e.target.value })
                        }
                        value={editedColab.name}
                        dataTooltipId="name-input"
                        error={editedColabError?.properties?.name?.errors?.[0]}
                      />
                    </Fields.wrapper>
                    <Fields.wrapper>
                      <Fields.label text="SENHA DE ACESSO" />
                      <Fields.input
                        error={
                          action === "Editar" && isShowPassword
                            ? passwordValidationError?.errors?.[0]
                            : undefined
                        }
                        dataTooltipId="password-input"
                        onChange={(e) => {
                          if (isShowPassword) {
                            setPassword(e.target.value);
                          }
                        }}
                        onEyeChange={(showPassword) =>
                          setIsShowPassword(!showPassword)
                        }
                        showPassword={isShowPassword}
                        value={
                          (action === "Editar" || action === "Criar") &&
                          isShowPassword
                            ? password
                            : "asokaoksas"
                        }
                        type="password"
                      />
                    </Fields.wrapper>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex justify-end items-end gap-2 w-[80px]">
                    <div className="flex flex-row items-start md:flex-col justify-between gap-2 w-full min-h-[68px]">
                      <Fields.label
                        text="STATUS"
                        hint="Ativar/Desativar colaborador do sistema."
                      />
                      <Switch
                        title="Ativar/Desativar colaborador"
                        checked={
                          FormatUserStatus(editedColab.status as UserStatus) ===
                          UserStatus.ACTIVE
                        }
                        onChange={(e) => {
                          setEditedColab({
                            status: EnumKeyFromValue(
                              UserStatus,
                              e.target.checked
                                ? UserStatus.ACTIVE
                                : UserStatus.INACTIVE
                            ) as UserStatus,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end items-end gap-2 w-full">
                    <div className="flex flex-col justify-between gap-2 w-full min-h-[68px]">
                      <Fields.label
                        text="NÍVEL"
                        hint="Nível de acesso do colaborador ao sistema."
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                        {Object.keys(ColabLevel).map((level) => (
                          <button
                            key={level}
                            className={`text-white p-2 rounded-md hover:bg-beergam-orange ${
                              editedColab.details.level === level
                                ? "bg-beergam-orange"
                                : "bg-beergam-blue-primary"
                            }`}
                            onClick={() =>
                              setEditedColab({
                                details: {
                                  ...editedColab.details,
                                  level: level as ColabLevel,
                                },
                              })
                            }
                          >
                            <p>{FormatColabLevel(level as ColabLevel)}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Paper>

              <Paper className="flex flex-col border-1 border-beergam-gray-light rounded-md p-4">
                <Fields.label text="HORÁRIOS DE FUNCIONAMENTO" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.values(WeekDay).map((day: WeekDay) => (
                    <Time
                      key={day}
                      dia={WeekDayToPortuguese[day]}
                      access={
                        editedColab.details.allowed_times[day as WeekDay].access
                      }
                      start_date={toHHmm(
                        editedColab.details.allowed_times[day as WeekDay]
                          .start_date
                      )}
                      end_date={toHHmm(
                        editedColab.details.allowed_times[day as WeekDay]
                          .end_date
                      )}
                      setHorario={(params: {
                        access: boolean;
                        start_date: string;
                        end_date: string;
                      }) => {
                        setEditedColab({
                          details: {
                            ...editedColab.details,
                            allowed_times: {
                              ...editedColab.details.allowed_times,
                              [day]: {
                                access: params.access,
                                start_date: parseTimeString(params.start_date),
                                end_date: parseTimeString(params.end_date),
                              },
                            },
                          },
                        });
                      }}
                    />
                  ))}
                  <button
                    onClick={setHorarioComercial}
                    className="bg-beergam-blue-primary text-beergam-white p-2 rounded-md hover:bg-beergam-orange flex items-center justify-center gap-2"
                  >
                    <Svg.clock width={20} height={20} />
                    <p>Horário Comercial</p>
                  </button>
                </div>
              </Paper>
            </div>
            <Paper className="grid grid-cols-1 gap-4 p-4 mt-4">
              <Fields.wrapper>
                <Fields.label text="ACESSOS" />
                <ViewAccess
                  views={editedColab.details.allowed_views}
                  onChange={(key, value) => {
                    const currentViews = editedColab.details.allowed_views;
                    const menuKeys = Object.keys(MenuConfig) as MenuKeys[];
                    const updatedViews: MenuState = {} as MenuState;

                    // Garante que todas as chaves estejam presentes
                    for (const menuKey of menuKeys) {
                      if (menuKey === key) {
                        updatedViews[menuKey] = { access: value };
                      } else {
                        const existingView = currentViews?.[menuKey];
                        updatedViews[menuKey] = existingView
                          ? {
                              access: existingView.access,
                              notifications: existingView.notifications,
                            }
                          : { access: false };
                      }
                    }

                    setEditedColab({
                      details: {
                        ...editedColab.details,
                        allowed_views: updatedViews,
                      },
                    });
                  }}
                />
              </Fields.wrapper>
            </Paper>
            <button
              onClick={handleFetch}
              className="sticky mt-2.5 bottom-0 left-0 right-0 bg-beergam-blue-primary text-beergam-white p-2 rounded-md hover:bg-beergam-orange"
            >
              Salvar Informações
            </button>
          </div>
        )}
      </div>
      {colabPhotoUploadService && (
        <UploadOverlay
          isOpen={isPhotoUploaderVisible}
          onClose={handleClosePhotoUploader}
          title="Atualizar foto do colaborador"
          description="Adicione ou atualize a foto do seu colaborador."
          uploadProps={{
            typeImport: "internal",
            service: colabPhotoUploadService,
            maxFiles: 1,
            accept: "image/*",
            emptyStateLabel: "Arraste ou selecione a nova foto do colaborador",
            onUploadSuccess: handleUploadSuccess,
          }}
        />
      )}
    </>
  );
}

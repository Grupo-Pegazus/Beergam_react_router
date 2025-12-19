import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useForm,
  type Resolver,
  type UseFormHandleSubmit,
} from "react-hook-form";
import { z } from "zod";
import { UserPasswordSchema } from "~/features/auth/typing";
import type { MenuKeys, MenuState } from "~/features/menu/typings";
import { MenuConfig } from "~/features/menu/typings";
import authStore from "~/features/store-zustand";
import AllowedTimes from "~/features/user/colab/components/ColabDetails/AllowedTimes";
import AllowedViews from "~/features/user/colab/components/ColabDetails/AllowedViews";
import ColabPhoto from "~/features/user/colab/components/ColabPhoto";
import UserFields from "~/features/user/components/UserFields";
import { createColabPhotoUploadService } from "~/features/user/service";
import {
  getEmptyAllowedTimes,
  type IAllowedTimes,
} from "~/features/user/typings/AllowedTimes";
import { UserStatus } from "~/features/user/typings/BaseUser";
import {
  ColabLevel,
  ColabSchema,
  getDefaultColab,
  type IColab,
} from "~/features/user/typings/Colab";
import { type ColabAction } from "~/routes/config/typings";
import Section from "~/src/components/ui/Section";
import Upload from "~/src/components/utils/upload";
import type { InternalUploadService } from "~/src/components/utils/upload/types";

// const CreateColabSchema = ColabSchema.extend({
//   password: UserPasswordSchema.optional().nullable(),
// });

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
export type editColabFormData = z.infer<
  ReturnType<typeof createColabFormSchema>
>;
export default function ColabForm({
  user,
  action,
  onHandleSubmitReady,
}: {
  user: IColab;
  action: ColabAction;
  onHandleSubmitReady?: (
    handleSubmit: UseFormHandleSubmit<editColabFormData>
  ) => void;
}) {
  const formSchema = useMemo(() => createColabFormSchema(action), [action]);
  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<editColabFormData>({
    resolver: zodResolver(formSchema) as unknown as Resolver<editColabFormData>,
    defaultValues: formSchema.safeParse(user).data,
  });

  // Observa mudanças em allowedTimes e ajusta os valores quando necessário
  const allowedTimes = watch("details.allowed_times");
  useEffect(() => {
    if (allowedTimes) {
      Object.keys(allowedTimes as unknown as IAllowedTimes).forEach((time) => {
        if (
          allowedTimes[time as keyof IAllowedTimes].access === true &&
          (!allowedTimes[time as keyof IAllowedTimes].start_date ||
            !allowedTimes[time as keyof IAllowedTimes].end_date)
        ) {
          setValue(
            `details.allowed_times.${time as keyof IAllowedTimes}.access`,
            false,
            { shouldValidate: true }
          );
        }
      });
    }
  }, [allowedTimes, setValue]);

  // Cria um handleSubmit customizado que garante que os valores estão ajustados antes de submeter
  const adjustedHandleSubmit = useCallback(
    (
      onValid: Parameters<UseFormHandleSubmit<editColabFormData>>[0],
      onInvalid?: Parameters<UseFormHandleSubmit<editColabFormData>>[1]
    ) => {
      return handleSubmit((data) => {
        // Ajusta os valores antes de submeter para garantir que estão corretos
        const allowedTimesData = data.details?.allowed_times;
        if (allowedTimesData) {
          let needsUpdate = false;
          const updatedData = { ...data };

          if (!updatedData.details) {
            updatedData.details = { ...data.details };
          }
          if (!updatedData.details.allowed_times) {
            updatedData.details.allowed_times = {} as IAllowedTimes;
          }

          Object.keys(allowedTimesData as unknown as IAllowedTimes).forEach(
            (time) => {
              const timeKey = time as keyof IAllowedTimes;
              const timeData = allowedTimesData[timeKey];
              if (
                timeData?.access === true &&
                (!timeData.start_date || !timeData.end_date)
              ) {
                updatedData.details.allowed_times[timeKey] = {
                  ...timeData,
                  access: false,
                };
                needsUpdate = true;
              }
            }
          );

          // Se houve ajustes, usa os dados atualizados, senão usa os dados originais
          onValid(needsUpdate ? updatedData : data);
        } else {
          onValid(data);
        }
      }, onInvalid);
    },
    [handleSubmit]
  );

  useEffect(() => {
    if (onHandleSubmitReady) {
      onHandleSubmitReady(adjustedHandleSubmit);
      setValue("password", null);
    }
  }, [adjustedHandleSubmit, onHandleSubmitReady]);

  const updateColab = authStore.use.updateColab();
  const allowedViews = watch("details.allowed_views") ?? ({} as MenuState);
  const accessList = Object.keys(MenuConfig).map((key) => ({
    key,
    label: MenuConfig[key as MenuKeys].label,
    access: allowedViews?.[key as MenuKeys]?.access ?? false,
  }));
  const [uploadVisible, setUploadVisible] = useState<boolean>(false);
  useEffect(() => {
    if (action === "Criar") {
      reset(getDefaultColab());
    } else {
      reset(formSchema.safeParse(user).data);
    }
  }, [user, action]);
  const colabPhotoUploadService = useMemo(
    () => (user?.pin ? createColabPhotoUploadService(user.pin) : null),
    [user?.pin]
  );
  
  const photoId = watch("details.photo_id");
  const masterPin = watch("master_pin");
  
  const currentPhotoUrl = useMemo(() => {
    if (!masterPin || !photoId) {
      return null;
    }
    return `https://cdn.beergam.com.br/colab_photos/colab/${masterPin}/${photoId}.webp`;
  }, [photoId, masterPin]);

  const handleUploadChange = useCallback(
    (ids: string[]) => {
      const newPhotoId = ids.length > 0 ? ids[0] : null;
      const newColab: IColab = {
        ...user,
        details: { ...user.details, photo_id: newPhotoId ?? null },
      };
      setValue("details.photo_id", newPhotoId ?? null);
      updateColab(newColab);
    },
    [user, setValue, updateColab]
  );

  const handleUploadSuccess = useCallback(
    (ids: string[]) => {
      if (!ids.length) {
        return;
      }
      handleUploadChange(ids);
    },
    [handleUploadChange]
  );

  const canUploadPhoto = useMemo(() => {
    return action !== "Visualizar" && action !== "Criar";
  }, [action]);

  return (
    <>
      <Section title="Dados do Colaborador" className="bg-beergam-white">
        <div className="flex items-center flex-col md:flex-row gap-4">
          <ColabPhoto
            photo_id={watch("details.photo_id")}
            name={watch("name")}
            masterPin={watch("master_pin")}
            size="large"
            canUploadPhoto={canUploadPhoto}
            onClick={() => canUploadPhoto && setUploadVisible(!uploadVisible)}
          />
          <div className="grid w-full md:grid-cols-4 grid-cols-1 gap-4 overflow-visible">
            <UserFields
              label="Nome"
              {...register("name")}
              canAlter={action !== "Visualizar"}
              error={errors.name?.message}
            />
            <UserFields
              label="Nível"
              // {...register("details.level")}
              value={watch("details.level")}
              {...register("details.level")}
              canAlter={action !== "Visualizar"}
              options={Object.keys(ColabLevel).map((level) => ({
                value: level,
                label: ColabLevel[level as keyof typeof ColabLevel],
              }))}
            />
            <UserFields
              label="Status"
              {...register("status")}
              value={watch("status")}
              options={Object.keys(UserStatus).map((status) => ({
                value: status,
                label: UserStatus[status as keyof typeof UserStatus],
              }))}
              canAlter={action !== "Visualizar"}
            />
            {action !== "Visualizar" && (
              <UserFields
                label="Senha"
                {...register("password")}
                canAlter={true}
                type="password"
                error={errors.password?.message}
              />
            )}
          </div>
        </div>
      </Section>
      <Section title="Horários de Funcionamento" className="bg-beergam-white">
        <AllowedTimes
          schedule={watch("details.allowed_times") ?? getEmptyAllowedTimes()}
          action={action}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          errors={(errors as any)?.details?.allowed_times}
          onScheduleChange={(day, scheduleData) => {
            setValue(`details.allowed_times.${day}`, scheduleData, {
              shouldValidate: true,
            });
          }}
        />
      </Section>
      <Section title="Acessos Permitidos" className="bg-beergam-white">
        <AllowedViews
          accessList={accessList}
          action={action}
          setValue={(key, value) => {
            setValue(
              `details.allowed_views.${key as MenuKeys}`,
              { access: value },
              {
                shouldValidate: true,
              }
            );
          }}
        />
        <Upload
          key={`upload-${user.pin}`}
          isOpen={uploadVisible}
          onClose={() => setUploadVisible(false)}
          typeImport="internal"
          service={colabPhotoUploadService as InternalUploadService}
          maxFiles={1}
          accept="image/*"
          emptyStateLabel="Arraste ou selecione a nova foto do colaborador"
          onUploadSuccess={handleUploadSuccess}
          onChange={handleUploadChange}
          initialFiles={currentPhotoUrl ? [currentPhotoUrl] : []}
          allowRemoveInitialFiles={true}
        />
      </Section>
    </>
  );
}

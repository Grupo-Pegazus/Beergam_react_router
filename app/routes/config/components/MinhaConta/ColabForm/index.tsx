import { useEffect } from "react";
import {
  type FieldErrors,
  type UseFormHandleSubmit,
  type UseFormRegister,
  type UseFormReset,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import { z } from "zod";
import { UserPasswordSchema } from "~/features/auth/typing";
import type { MenuKeys, MenuState } from "~/features/menu/typings";
import { MenuConfig } from "~/features/menu/typings";
import AllowedTimes from "~/features/user/colab/components/ColabDetails/AllowedTimes";
import AllowedViews from "~/features/user/colab/components/ColabDetails/AllowedViews";
import ColabPhoto from "~/features/user/colab/components/ColabPhoto";
import UserFields from "~/features/user/components/UserFields";
import { getEmptyAllowedTimes } from "~/features/user/typings/AllowedTimes";
import { UserStatus } from "~/features/user/typings/BaseUser";
import {
  ColabLevel,
  ColabSchema,
  getDefaultColab,
  type IColab,
} from "~/features/user/typings/Colab";
import Section from "~/src/components/ui/Section";
import type { ColabAction } from "../../../../perfil/typings";
const CreateColabSchema = ColabSchema.extend({
  password: UserPasswordSchema.optional().nullable(),
});
type editColabFormData = z.infer<typeof CreateColabSchema>;
export default function ColabForm({
  user,
  action,
  watch,
  // handleSubmit,
  reset,
  setValue,
  errors,
  register,
}: {
  user: IColab;
  action: ColabAction;
  watch: UseFormWatch<editColabFormData>;
  handleSubmit?: UseFormHandleSubmit<editColabFormData> | null;
  reset: UseFormReset<editColabFormData>;
  setValue: UseFormSetValue<editColabFormData>;
  errors: FieldErrors<editColabFormData>;
  register: UseFormRegister<editColabFormData>;
}) {
  const allowedViews = watch("details.allowed_views") ?? ({} as MenuState);
  const accessList = Object.keys(MenuConfig).map((key) => ({
    key,
    label: MenuConfig[key as MenuKeys].label,
    access: allowedViews?.[key as MenuKeys]?.access ?? false,
  }));
  useEffect(() => {
    if (action === "Criar") {
      reset(getDefaultColab());
    } else {
      reset(CreateColabSchema.safeParse(user).data);
    }
  }, [user, action]);
  return (
    <>
      <Section title="Dados do Colaborador" className="bg-beergam-white">
        <div className="flex items-center flex-col md:flex-row gap-4">
          <ColabPhoto
            photo_id={watch("details.photo_id")}
            name={watch("name")}
            masterPin={watch("master_pin")}
            size="large"
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
      </Section>
    </>
  );
}

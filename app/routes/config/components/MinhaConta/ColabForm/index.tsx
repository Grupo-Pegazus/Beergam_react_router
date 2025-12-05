import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import type { MenuKeys, MenuState } from "~/features/menu/typings";
import { MenuConfig } from "~/features/menu/typings";
import AllowedTimes from "~/features/user/colab/components/ColabDetails/AllowedTimes";
import AllowedViews from "~/features/user/colab/components/ColabDetails/AllowedViews";
import ColabPhoto from "~/features/user/colab/components/ColabPhoto";
import UserFields from "~/features/user/components/UserFields";
import { UserStatus } from "~/features/user/typings/BaseUser";
import {
  ColabLevel,
  ColabSchema,
  type IColab,
  getDefaultColab,
} from "~/features/user/typings/Colab";
import Section from "~/src/components/ui/Section";
import type { ColabAction } from "../../../../perfil/typings";
type editColabFormData = z.infer<typeof ColabSchema>;
export default function ColabForm({
  user,
  action,
}: {
  user: IColab;
  action: ColabAction;
}) {
  const allowedViews = user.details.allowed_views ?? ({} as MenuState);
  const accessList = Object.keys(MenuConfig).map((key) => ({
    key,
    label: MenuConfig[key as MenuKeys].label,
    access: allowedViews?.[key as MenuKeys]?.access ?? false,
  }));
  const colabInfoRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<editColabFormData>({
    resolver: zodResolver(ColabSchema) as unknown as Resolver<
      z.infer<typeof ColabSchema>
    >,
    defaultValues: ColabSchema.safeParse(user).data,
  });
  useEffect(() => {
    if (action === "Criar") {
      reset(getDefaultColab());
    } else {
      reset(ColabSchema.safeParse(user).data);
    }
  }, [user, action]);
  return (
    <>
      <Section title="Dados do Colaborador" className="bg-beergam-white">
        <div className="flex gap-4">
          <ColabPhoto
            photo_id={watch("details.photo_id")}
            name={watch("name")}
            masterPin={watch("master_pin")}
            size="large"
          />
          <div className="grid grid-cols-4 gap-4 overflow-visible">
            <UserFields
              label="Nome"
              {...register("name")}
              canAlter={action !== "Visualizar"}
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
                label: status,
              }))}
              canAlter={action !== "Visualizar"}
            />
            {action !== "Criar" && (
              <UserFields
                label="PIN"
                name="pin"
                value={watch("pin") ?? ""}
                canAlter={false}
              />
            )}
          </div>
        </div>
      </Section>
      <Section title="Horários de Funcionamento" className="bg-beergam-white">
        <AllowedTimes schedule={user.details.allowed_times} action={action} />
      </Section>
      <Section title="Acessos Permitidos" className="bg-beergam-white">
        <AllowedViews accessList={accessList} action={action} />
      </Section>
    </>
  );
}

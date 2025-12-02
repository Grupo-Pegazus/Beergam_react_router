// import { useForm } from "react-hook-form";
import {
  MenuConfig,
  type MenuKeys,
  type MenuState,
} from "~/features/menu/typings";
import type { IColab } from "~/features/user/typings/Colab";
import { type IUser } from "~/features/user/typings/User";
import { isMaster } from "~/features/user/utils";
import UserForm from "./UserForm";
export default function MinhaConta({ user }: { user: IUser | IColab }) {
  const allowedViews = user.details.allowed_views ?? ({} as MenuState);
  const accessList = Object.keys(MenuConfig).map((key) => ({
    key,
    label: MenuConfig[key as MenuKeys].label,
    access: allowedViews?.[key as MenuKeys]?.access ?? false,
  }));

  return (
    <>
      {/* {isMaster(editedUser) && isMaster(user) && (
        <>
          <p>{JSON.stringify(editedUserValidation.success)}</p>
          <Section
            title="Dados Pessoais"
            className="bg-beergam-white"
            actions={<BeergamButton title="Salvar" />}
          >
            <>
              <div className="grid grid-cols-3 gap-4">
                <Fields.input {...register("name")} />
                <>
                  <Fields.input {...register("name")} />
                  <Fields.input {...register("name")} />
                  <Fields.input {...register("name")} />
                  <Fields.input {...register("name")} />
                  <Fields.input {...register("name")} />
                </>
              </div>
              <div className="grid grid-cols-3 mt-4">
                <Fields.input {...register("name")} />
                <Fields.input {...register("name")} />
                <Fields.input {...register("name")} />
              </div>
            </>
          </Section>
          <Section title="Dados Financeiros" className="bg-beergam-white">
            <div className="grid grid-cols-3 gap-4">
              <Fields.input {...register("name")} />
              <Fields.input {...register("name")} />
              <Fields.input {...register("name")} />
              <Fields.input {...register("name")} />
              <Fields.input {...register("name")} />
              <Fields.input {...register("name")} />
              <Fields.input {...register("name")} />
              <Fields.input {...register("name")} />
              <Fields.input {...register("name")} />
              <Fields.input {...register("name")} />
              <Fields.input {...register("name")} />
              <Fields.wrapper>
                <Fields.label text="Emite nota fiscal em flex" />
                <Switch
                  checked={editedUser.details.invoice_in_flex ?? false}
                  onChange={() => {}}
                />
              </Fields.wrapper>
            </div>
          </Section>
        </>
      )}
      {isColab(editedUser) && isColab(user) && (
        <>
          <Section title="Dados do Colaborador" className="bg-beergam-white">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-start gap-2">
                <ColabPhoto
                  photo_id={editedUser.details.photo_id}
                  name={editedUser.name}
                  masterPin={editedUser.master_pin}
                  size="large"
                />
                <Fields.input {...register("name")} />
              </div>

              <Fields.input {...register("name")} />
              <Fields.input {...register("name")} />
            </div>
          </Section>
          <Section
            title="Horários de funcionamento"
            className="bg-beergam-white"
          >
            <AllowedTimes schedule={editedUser.details.allowed_times} />
          </Section>
          <Section title="Acessos Permitidos" className="bg-beergam-white">
            <AllowedViews accessList={accessList} />
          </Section>
        </>
      )} */}
      {isMaster(user) && <UserForm user={user as IUser} />}
    </>
  );
}

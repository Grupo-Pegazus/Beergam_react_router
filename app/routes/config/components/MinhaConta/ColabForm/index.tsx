import type { MenuKeys, MenuState } from "~/features/menu/typings";
import { MenuConfig } from "~/features/menu/typings";
import AllowedTimes from "~/features/user/colab/components/ColabDetails/AllowedTimes";
import AllowedViews from "~/features/user/colab/components/ColabDetails/AllowedViews";
import ColabPhoto from "~/features/user/colab/components/ColabPhoto";
import UserFields from "~/features/user/components/UserFields";
import type { IColab } from "~/features/user/typings/Colab";
import Section from "~/src/components/ui/Section";

export default function ColabForm({ user }: { user: IColab }) {
  const allowedViews = user.details.allowed_views ?? ({} as MenuState);
  const accessList = Object.keys(MenuConfig).map((key) => ({
    key,
    label: MenuConfig[key as MenuKeys].label,
    access: allowedViews?.[key as MenuKeys]?.access ?? false,
  }));
  return (
    <>
      <Section title="Dados do Colaborador" className="bg-beergam-white">
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          <div className="flex items-start gap-2 flex-col md:flex-row">
            <ColabPhoto
              photo_id={user.details.photo_id}
              name={user.name}
              masterPin={user.master_pin}
              size="large"
            />
            <UserFields
              label="Nome"
              name="name"
              value={user.name}
              canAlter={false}
            />
          </div>

          <UserFields
            label="Nível"
            name="level"
            value={user.details.level}
            canAlter={false}
          />
          <UserFields
            label="PIN"
            name="pin"
            value={user.pin ?? ""}
            canAlter={false}
          />
        </div>
      </Section>
      <Section title="Horários de Funcionamento" className="bg-beergam-white">
        <AllowedTimes schedule={user.details.allowed_times} />
      </Section>
      <Section title="Acessos Permitidos" className="bg-beergam-white">
        <AllowedViews accessList={accessList} />
      </Section>
    </>
  );
}

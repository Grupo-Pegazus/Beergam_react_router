import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  MenuConfig,
  type MenuKeys,
  type MenuState,
} from "~/features/menu/typings";
import AllowedTimes from "~/features/user/colab/components/ColabDetails/AllowedTimes";
import AllowedViews from "~/features/user/colab/components/ColabDetails/AllowedViews";
import ColabPhoto from "~/features/user/colab/components/ColabPhoto";
import { userService } from "~/features/user/service";
import type { IColab } from "~/features/user/typings/Colab";
import { ColabLevel } from "~/features/user/typings/Colab";
import type { IUser } from "~/features/user/typings/User";
import { FormatColabLevel, isColab, isMaster } from "~/features/user/utils";
import Section from "~/src/components/ui/Section";
import BeergamButton from "~/src/components/utils/BeergamButton";
import UserFields from "../../../../features/user/components/UserFields";
export default function MinhaConta({ user }: { user: IUser | IColab }) {
  const allowedViews = user.details.allowed_views ?? ({} as MenuState);
  const accessList = Object.keys(MenuConfig).map((key) => ({
    key,
    label: MenuConfig[key as MenuKeys].label,
    access: allowedViews?.[key as MenuKeys]?.access ?? false,
  }));
  const colabMutation = useMutation({
    mutationFn: () => userService.getColabs(),
  });
  return (
    <>
      {isMaster(user) && (
        <>
          <Section
            title="Dados Pessoais"
            className="bg-beergam-white"
            actions={<BeergamButton title="Salvar" />}
          >
            <>
              <div className="grid grid-cols-2 gap-4">
                <UserFields
                  canAlter={false}
                  value={user.name}
                  label="Nome"
                  onChange={() => {}}
                />
                <>
                  <UserFields
                    canAlter={false}
                    value={user.details.email}
                    label="Email"
                    onChange={() => {}}
                    clipboard={true}
                  />
                  <UserFields
                    canAlter={user.details.cpf ? false : true}
                    value={user.details.cpf}
                    label="CPF"
                    onChange={() => {}}
                  />
                  <UserFields
                    canAlter={user.details.cnpj ? false : true}
                    value={user.details.cnpj}
                    label="CNPJ"
                    onChange={() => {}}
                  />
                  <UserFields
                    canAlter={false}
                    value={user.details.phone}
                    label="Telefone"
                    onChange={() => {}}
                  />
                  <UserFields
                    canAlter={true}
                    value={user.details.secondary_phone}
                    label="WhatsApp"
                    onChange={() => {}}
                  />
                </>
              </div>
              <div className="grid grid-cols-3 mt-4">
                <UserFields
                  canAlter={false}
                  value={user.pin}
                  label="PIN"
                  type="text"
                  hint="O PIN é usado na aba de colaboradores para acessar o sistema."
                  clipboard
                />
                <UserFields
                  canAlter={false}
                  value={user.details.personal_reference_code}
                  label="Código de Referência"
                  type="text"
                  hint="O código de referência é usado para convidar novos usuários para o Beergam."
                  clipboard
                />
                <UserFields
                  canAlter={false}
                  value={user.details.sub_count?.toString() ?? "0"}
                  label="Usuários convidados"
                  type="text"
                  hint="Compartilhe seu código de referência com parceiros para que eles tenham 14 dias grátis."
                />
              </div>
            </>
          </Section>
        </>
      )}
      {isColab(user) && (
        <>
          <Section title="Dados do Colaborador" className="bg-beergam-white">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-start gap-2">
                <ColabPhoto
                  photo_id={user.details.photo_id}
                  name={user.name}
                  masterPin={user.master_pin}
                  size="large"
                />
                <UserFields
                  canAlter={false}
                  value={user.name}
                  label="Nome do Colaborador"
                  onChange={() => {}}
                />
              </div>

              <UserFields
                canAlter={false}
                value={FormatColabLevel(
                  user.details.level as unknown as ColabLevel
                )}
                label="Nível do Colaborador"
                onChange={() => {}}
              />
              <UserFields
                canAlter={false}
                value={dayjs(user.updated_at).format("DD/MM/YYYY HH:mm")}
                label="Data de atualização"
                onChange={() => {}}
              />
            </div>
          </Section>
          <Section
            title="Horários de funcionamento"
            className="bg-beergam-white"
          >
            <AllowedTimes schedule={user.details.allowed_times} />
          </Section>
          <Section title="Acessos Permitidos" className="bg-beergam-white">
            <AllowedViews accessList={accessList} />
          </Section>
        </>
      )}
    </>
  );
}

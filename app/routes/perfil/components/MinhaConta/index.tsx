import React, { useReducer } from "react";
import type { IBaseUser } from "~/features/user/typings/BaseUser";
import {
  ComoConheceu,
  ProfitRange,
  type IUser,
} from "~/features/user/typings/User";
import Svg from "~/src/assets/svgs";
import { Fields } from "~/src/components/utils/_fields";
import Hint from "~/src/components/utils/Hint";
interface MinhaContaProps {
  user: IUser | IBaseUser | undefined;
}
export default function MinhaConta({ user }: MinhaContaProps) {
  function CreateFields({
    //Função que cria os campos do formulário com algumas configurações por padrão, lógica de edição, etc.
    label,
    value,
    canBeAlter = false,
    onChange,
    placeholder,
    isEditing = false,
    selectOptions = null,
    hint = null,
  }: {
    label: string;
    value: string | null;
    canBeAlter: boolean;
    onChange: (value: string) => void;
    placeholder?: string;
    isEditing?: boolean;
    selectOptions?: Array<{ value: string; label: string }> | null;
    hint?: string | null;
  }) {
    return (
      <Fields.wrapper>
        <div className="flex justify-between items-center gap-2">
          <Fields.label text={label} />
          {hint && <Hint message={hint} />}
        </div>
        {value ? (
          isEditing && canBeAlter ? (
            selectOptions ? (
              <Fields.select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                options={selectOptions}
                tailWindClasses="!w-1/2"
              />
            ) : (
              <Fields.input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                tailWindClasses="!w-1/2"
                hasError={false}
              />
            )
          ) : selectOptions ? (
            <p>
              {selectOptions.find((option) => option.value === value)?.label}
            </p>
          ) : (
            <p>{value}</p>
          )
        ) : canBeAlter && isEditing ? (
          selectOptions ? (
            <Fields.select
              value={""}
              onChange={(e) => onChange(e.target.value)}
              options={selectOptions}
              tailWindClasses="!w-1/2"
            />
          ) : (
            <Fields.input
              value={""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              tailWindClasses="!w-1/2"
              hasError={false}
            />
          )
        ) : (
          <h4>Você ainda não preencheu este campo.</h4>
        )}
      </Fields.wrapper>
    );
  }
  const editingInitialState = {
    "Dados Pessoais": false,
    "Dados Financeiros": false,
  };
  function CreateFieldsSections({
    children,
    sectionTitle,
  }: {
    children: React.ReactNode;
    sectionTitle: keyof typeof editingInitialState;
  }) {
    return (
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-beergam-blue-primary uppercase">
            {sectionTitle}
          </h3>
          <button
            onClick={() =>
              setIsEditing({ [sectionTitle]: !isEditing[sectionTitle] })
            }
          >
            <div className="flex justify-center items-center gap-2 p-4 pt-1 pb-1 rounded-xl bg-beergam-blue-primary hover:bg-beergam-orange text-beergam-white">
              <p>Editar {sectionTitle}</p>
              {isEditing[sectionTitle] ? (
                <Svg.x width={17} height={17} />
              ) : (
                <Svg.pencil width={17} height={17} />
              )}
            </div>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">{children}</div>
      </div>
    );
  }
  function GenerateFieldsBySection( //Função que gera os campos se baseando nas sessões
    sectionTitle: keyof typeof editingInitialState,
    editing: boolean
  ) {
    if (!user) return null;
    switch (sectionTitle) {
      case "Dados Pessoais":
        return (
          <>
            <CreateFields
              label="NOME COMPLETO / RAZÃO SOCIAL"
              value={user?.name ?? ""}
              canBeAlter={false}
              onChange={() => {}}
            />
            {"details" in user && (
              <>
                <CreateFields
                  label="EMAIL"
                  value={user?.details?.email ?? ""}
                  canBeAlter={false}
                  onChange={() => {}}
                />
                <CreateFields
                  label="TELEFONE"
                  value={user?.details?.phone ?? ""}
                  canBeAlter={false}
                  onChange={() => {}}
                />
                <CreateFields
                  label="CPF"
                  value={user?.details?.cpf ?? null}
                  canBeAlter={
                    user?.details?.cpf == null ||
                    user?.details?.cpf == undefined
                  }
                  onChange={() => {}}
                  placeholder="Digite seu CPF"
                  isEditing={editing}
                />
                <CreateFields
                  label="CNPJ"
                  value={user?.details?.cnpj ?? null}
                  canBeAlter={
                    user?.details?.cnpj == null ||
                    user?.details?.cnpj == undefined
                  }
                  onChange={() => {}}
                  placeholder="Digite seu CNPJ"
                  isEditing={editing}
                />
                <CreateFields
                  label="CÓDIGO DE INDICAÇÃO"
                  value={user?.details?.personal_reference_code ?? ""}
                  canBeAlter={false}
                  onChange={() => {}}
                  hint="Compartilhe seu código de indicação para convidar novos usuários ao Beergam e aproveite benefícios exclusivos."
                />
                <CreateFields
                  label="COMO CONHECEU A BEERGAM"
                  value={user?.details?.found_beergam ?? null}
                  canBeAlter={true}
                  onChange={() => {}}
                  isEditing={editing}
                  selectOptions={Object.keys(ComoConheceu).map((key) => ({
                    value: key,
                    label: ComoConheceu[key as keyof typeof ComoConheceu],
                  }))}
                />
                <CreateFields
                  label="FATURAMENTO POSTAL"
                  value={user?.details?.profit_range ?? null}
                  canBeAlter={true}
                  onChange={() => {}}
                  selectOptions={Object.keys(ProfitRange).map((key) => ({
                    value: key,
                    label: ProfitRange[key as keyof typeof ProfitRange],
                  }))}
                  isEditing={editing}
                />
                <CreateFields
                  label="PIN"
                  value={user?.pin ?? null}
                  canBeAlter={false}
                  onChange={() => {}}
                  isEditing={editing}
                  hint="O PIN é usado para acessar o sistema de colaboradores."
                />
              </>
            )}
          </>
        );
      case "Dados Financeiros":
        return <></>;
      default:
        return null;
    }
  }
  if (!user)
    return <div className="flex flex-col gap-4">Nenhum usuário encontrado</div>;

  const [isEditing, setIsEditing] = useReducer(
    (
      state: typeof editingInitialState,
      action:
        | Partial<typeof editingInitialState>
        | keyof typeof editingInitialState
    ) => {
      if (typeof action === "string") {
        return { ...state, [action]: !state[action] };
      }
      return { ...state, ...action };
    },
    editingInitialState
  );
  return (
    <>
      <CreateFieldsSections sectionTitle="Dados Pessoais">
        {GenerateFieldsBySection("Dados Pessoais", isEditing["Dados Pessoais"])}
      </CreateFieldsSections>
      <CreateFieldsSections sectionTitle="Dados Financeiros">
        {GenerateFieldsBySection(
          "Dados Financeiros",
          isEditing["Dados Financeiros"]
        )}
      </CreateFieldsSections>
    </>
  );
}

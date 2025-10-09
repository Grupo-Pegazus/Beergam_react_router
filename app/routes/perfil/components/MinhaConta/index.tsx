import React, { useReducer } from "react";
import type { IBaseUser } from "~/features/user/typings/BaseUser";
import {
  CalcProfitProduct,
  CalcTax,
  ComoConheceu,
  CurrentBilling,
  NumberOfEmployees,
  ProfitRange,
  Segment,
  type IUser,
} from "~/features/user/typings/User";
import Svg from "~/src/assets/svgs";
import { Fields } from "~/src/components/utils/_fields";
import Hint from "~/src/components/utils/Hint";
const EditingContext = React.createContext<boolean>(false);
interface MinhaContaProps {
  user: IUser | IBaseUser | undefined;
}
export default function MinhaConta({ user }: MinhaContaProps) {
  const editingInitialState = {
    "Dados Pessoais": false,
    "Dados Financeiros": false,
    "Informações Básicas": false,
  };
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
  function CreateFields({
    //Função que cria os campos do formulário com algumas configurações por padrão, lógica de edição, etc.
    label,
    value,
    canBeAlter = false,
    onChange,
    placeholder,
    selectOptions = null,
    hint = null,
    type = "text",
  }: {
    label: string;
    value: string | number | boolean | null;
    canBeAlter: boolean;
    onChange: (value: string) => void;
    placeholder?: string;
    selectOptions?: Array<{ value: string | null; label: string }> | null;
    hint?: string | null;
    type?: "text" | "number" | "checkbox";
  }) {
    const isEditing = React.useContext(EditingContext);
    if (value == null && selectOptions != null) {
      console.log("value == null && selectOptions != null");
      selectOptions = [
        ...selectOptions,
        { value: null, label: "Selecione uma opção" },
      ];
    }
    const inputClasses =
      type === "checkbox" ? "" : type === "number" ? "!w-36" : "!w-2/3";
    return (
      <Fields.wrapper>
        <div className="flex justify-between items-center gap-2">
          <Fields.label text={label} />
          {hint && (
            <Hint message={hint} anchorSelect={label.toLocaleLowerCase()} />
          )}
        </div>
        {value ? (
          isEditing && canBeAlter ? (
            selectOptions ? (
              <Fields.select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                options={selectOptions}
                tailWindClasses="!w-2/3"
              />
            ) : (
              <Fields.input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                tailWindClasses={inputClasses}
                hasError={false}
                type={type}
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
              tailWindClasses="!w-2/3"
            />
          ) : (
            <Fields.input
              value={""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              tailWindClasses={inputClasses}
              hasError={false}
              type={type}
            />
          )
        ) : (
          <p>Você ainda não preencheu este campo.</p>
        )}
      </Fields.wrapper>
    );
  }

  function CreateFieldsSections({
    children,
    sectionTitle,
  }: {
    children: React.ReactNode;
    sectionTitle: keyof typeof editingInitialState;
  }) {
    return (
      <EditingContext.Provider value={isEditing[sectionTitle]}>
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-beergam-blue-primary uppercase !font-bold">
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
          <div className="grid grid-cols-3 gap-4">{children}</div>
        </div>
      </EditingContext.Provider>
    );
  }

  function GenerateFieldsBySection( //Função que gera os campos se baseando nas sessões
    sectionTitle: keyof typeof editingInitialState
  ) {
    function GenerateSubSections({
      subSectionTitle,
      children,
    }: {
      subSectionTitle: string;
      children: React.ReactNode;
    }) {
      return (
        <div className="col-span-3 flex flex-col gap-4">
          <h4 className="text-beergam-blue-primary font-bold uppercase">
            {subSectionTitle}
          </h4>
          <div className="grid grid-cols-3 gap-4">{children}</div>
        </div>
      );
    }
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
                />
                <CreateFields
                  label="CÓDIGO DE INDICAÇÃO"
                  value={user?.details?.personal_reference_code ?? ""}
                  canBeAlter={false}
                  onChange={() => {}}
                  hint="Compartilhe seu código de indicação para convidar novos usuários ao Beergam."
                />
                <CreateFields
                  label="COMO CONHECEU A BEERGAM"
                  value={user?.details?.found_beergam ?? null}
                  canBeAlter={true}
                  onChange={() => {}}
                  selectOptions={Object.keys(ComoConheceu).map((key) => ({
                    value: key,
                    label: ComoConheceu[key as keyof typeof ComoConheceu],
                  }))}
                />
                <CreateFields
                  label="FATURAMENTO MENSAL"
                  value={user?.details?.profit_range ?? null}
                  canBeAlter={true}
                  onChange={() => {}}
                  selectOptions={Object.keys(ProfitRange).map((key) => ({
                    value: key,
                    label: ProfitRange[key as keyof typeof ProfitRange],
                  }))}
                />
                <CreateFields
                  label="PIN"
                  value={user?.pin ?? null}
                  canBeAlter={false}
                  onChange={() => {}}
                  hint="O PIN é usado para acessar o sistema de colaboradores."
                />
              </>
            )}
          </>
        );
      case "Dados Financeiros":
        return (
          <>
            {"details" in user && (
              <>
                <CreateFields
                  label="CÁLCULO DE LUCRO DO PRODUTO"
                  value={user?.details?.calc_profit_product ?? null}
                  canBeAlter={true}
                  onChange={() => {}}
                  hint="O cálculo de lucro do produto mostra quanto você realmente ganha por venda, subtraindo do preço todos os custos (produto, frete, taxas, impostos e embalagem)."
                  selectOptions={Object.keys(CalcProfitProduct).map((key) => ({
                    value: key,
                    label:
                      CalcProfitProduct[key as keyof typeof CalcProfitProduct],
                  }))}
                />
                <CreateFields
                  label="CÁLCULO DE IMPOSTO"
                  value={user?.details?.calc_tax ?? null}
                  canBeAlter={true}
                  onChange={() => {}}
                  hint="São diferentes formas de calcular a base tributária antes de aplicar a alíquota do imposto. "
                  selectOptions={Object.keys(CalcTax).map((key) => ({
                    value: key,
                    label: CalcTax[key as keyof typeof CalcTax],
                  }))}
                />
                <CreateFields
                  label="PORCENTAGEM FIXA DE IMPOSTO"
                  value={user?.details?.tax_percent_fixed ?? null}
                  canBeAlter={true}
                  onChange={() => {}}
                  hint="São diferentes formas de calcular a base tributária antes de aplicar a alíquota do imposto. "
                  type="number"
                />
                <CreateFields
                  label="NÚMERO DE FUNCIONÁRIOS"
                  value={user?.details?.number_of_employees ?? null}
                  canBeAlter={true}
                  onChange={() => {}}
                  selectOptions={Object.keys(NumberOfEmployees).map((key) => ({
                    value: key,
                    label:
                      NumberOfEmployees[key as keyof typeof NumberOfEmployees],
                  }))}
                />
                <CreateFields
                  label="FATURADOR ATUAL"
                  value={user?.details?.current_billing ?? null}
                  canBeAlter={true}
                  onChange={() => {}}
                  selectOptions={Object.keys(CurrentBilling).map((key) => ({
                    value: key,
                    label: CurrentBilling[key as keyof typeof CurrentBilling],
                  }))}
                />
                <CreateFields
                  label="EMITE NOTA FISCAL NO FLEX"
                  value={user?.details?.sells_shopee ?? false}
                  canBeAlter={true}
                  onChange={() => {}}
                  type="checkbox"
                />
                <GenerateSubSections subSectionTitle="VENDAS EM PLATAFORMAS">
                  <CreateFields
                    label="VENDAS NO MELI"
                    value={user?.details?.sells_meli ?? null}
                    canBeAlter={true}
                    onChange={() => {}}
                    type="number"
                  />

                  <CreateFields
                    label="VENDAS NO SHOPEE"
                    value={user?.details?.sells_shopee ?? null}
                    canBeAlter={true}
                    onChange={() => {}}
                    type="number"
                  />
                  <CreateFields
                    label="VENDAS NO AMAZON"
                    value={user?.details?.sells_amazon ?? null}
                    canBeAlter={true}
                    onChange={() => {}}
                    type="number"
                  />
                  <CreateFields
                    label="VENDAS NO SHEIN"
                    value={user?.details?.sells_shein ?? null}
                    canBeAlter={true}
                    onChange={() => {}}
                    type="number"
                  />
                  <CreateFields
                    label="VENDAS NO SITE PRÓPRIO"
                    value={user?.details?.sells_own_site ?? null}
                    canBeAlter={true}
                    onChange={() => {}}
                    type="number"
                  />
                </GenerateSubSections>
              </>
            )}
          </>
        );
      case "Informações Básicas":
        return (
          "details" in user && (
            <>
              <CreateFields
                label="REDE SOCIAL"
                value={null}
                canBeAlter={true}
                onChange={() => {}}
              />
              <CreateFields
                label="TELEFONE SECUNDÁRIO"
                value={null}
                canBeAlter={true}
                onChange={() => {}}
              />
              <GenerateSubSections subSectionTitle="Dados coorporativos">
                <CreateFields
                  label="SITE COORPORATIVO"
                  value={null}
                  canBeAlter={true}
                  onChange={() => {}}
                />
                <CreateFields
                  label="DATA DE FUNDAÇÃO"
                  value={null}
                  canBeAlter={true}
                  onChange={() => {}}
                />
                <CreateFields
                  label="SEGMENTO"
                  value={null}
                  canBeAlter={true}
                  onChange={() => {}}
                  selectOptions={Object.keys(Segment).map((key) => ({
                    value: key,
                    label: Segment[key as keyof typeof Segment],
                  }))}
                />
              </GenerateSubSections>
              <GenerateSubSections subSectionTitle="Endereço completo">
                <CreateFields
                  label="CEP"
                  value={null}
                  canBeAlter={true}
                  onChange={() => {}}
                />
                <CreateFields
                  label="Bairro"
                  value={null}
                  canBeAlter={true}
                  onChange={() => {}}
                />
                <CreateFields
                  label="Cidade"
                  value={null}
                  canBeAlter={true}
                  onChange={() => {}}
                />
                <CreateFields
                  label="Estado"
                  value={null}
                  canBeAlter={true}
                  onChange={() => {}}
                />
                <CreateFields
                  label="Rua"
                  value={null}
                  canBeAlter={true}
                  onChange={() => {}}
                />
                <CreateFields
                  label="Número"
                  value={null}
                  canBeAlter={true}
                  onChange={() => {}}
                />
                <CreateFields
                  label="Complemento"
                  value={null}
                  canBeAlter={true}
                  onChange={() => {}}
                />
              </GenerateSubSections>
            </>
          )
        );
      default:
        return null;
    }
  }
  if (!user)
    return <div className="flex flex-col gap-4">Nenhum usuário encontrado</div>;

  return (
    <div className="w-full flex flex-col gap-4 mt-4">
      <CreateFieldsSections sectionTitle="Dados Pessoais">
        {GenerateFieldsBySection("Dados Pessoais")}
      </CreateFieldsSections>
      <CreateFieldsSections sectionTitle="Dados Financeiros">
        {GenerateFieldsBySection("Dados Financeiros")}
      </CreateFieldsSections>
      <CreateFieldsSections sectionTitle="Informações Básicas">
        {GenerateFieldsBySection("Informações Básicas")}
      </CreateFieldsSections>
    </div>
  );
}

import { Paper, Switch } from "@mui/material";
import dayjs from "dayjs";
import React, { useContext, useEffect, useMemo, useReducer } from "react";
import { useDispatch } from "react-redux";
import { useFetcher } from "react-router";
import { Tooltip } from "react-tooltip";
import { z } from "zod";
import { updateUserInfo } from "~/features/user/redux";
import type { IColab } from "~/features/user/typings/Colab";
import {
  CalcProfitProduct,
  CalcTax,
  CurrentBilling,
  isAtributeUser,
  isAtributeUserDetails,
  NumberOfEmployees,
  ProfitRange,
  Segment,
  UserSchema,
  type IUser,
  type IUserDetails,
} from "~/features/user/typings/User";
import {
  FormatCalcProfitProduct,
  FormatCalcTax,
  FormatCurrentBilling,
  FormatNumberOfEmployees,
  FormatProfitRange,
  FormatSegment,
  isMaster,
} from "~/features/user/utils";
import Svg from "~/src/assets/svgs/_index";
import { Fields } from "~/src/components/utils/_fields";
import type { InputProps } from "~/src/components/utils/_fields/input";
import { FilterDatePicker } from "~/src/components/filters";
import { deepEqual, getObjectDifferences } from "../../utils";
interface SessionsState {
  [key: string]: boolean;
}

const editingInitialState = {
  "Dados Pessoais": false,
  "Dados Financeiros": false,
  "Dados Coorporativos": false,
};

interface ElementWrapperProps {
  canBeAlter: boolean;
  value: string | number | null | undefined;
  inputName: keyof IUser | keyof IUserDetails;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
  editedUserError: ReturnType<typeof z.treeifyError<IUser>> | null;
  label: string;
}

const ElementSectionContext = React.createContext<{ isEditing: boolean }>({
  //Criando o contexto para os componentes filhos conseguirem tem o contexto de edição
  isEditing: false,
});

function ElementWrapper({
  canBeAlter,
  value,
  inputName,
  onChange,
  children,
  editedUserError,
  label,
}: ElementWrapperProps) {
  function sanitizeValue(value: string | number) {
    // Verifica se o valor existe como chave no enum ProfitRange
    if (typeof value != "string") {
      return value;
    }
    if (value in ProfitRange) {
      return FormatProfitRange(value as ProfitRange);
    }
    if (value in NumberOfEmployees) {
      return FormatNumberOfEmployees(value as NumberOfEmployees);
    }
    if (value in CalcProfitProduct) {
      return FormatCalcProfitProduct(value as CalcProfitProduct);
    }
    if (value in CalcTax) {
      return FormatCalcTax(value as CalcTax);
    }
    if (value in CurrentBilling) {
      return FormatCurrentBilling(value as CurrentBilling);
    }
    if (value in Segment) {
      return FormatSegment(value as Segment);
    }
    // if (value in ComoConheceu) {
    //   return FormatComoConheceu(value as ComoConheceu);
    // }
    return value ?? "";
  }
  const { isEditing } = useContext(ElementSectionContext);
  const isUserAttr = isAtributeUser(inputName as keyof IUser);
  const isDetailsAttr = isAtributeUserDetails(inputName as keyof IUserDetails);
  const attributeError = isUserAttr
    ? editedUserError?.properties?.[inputName as keyof IUser]?.errors?.[0]
    : isDetailsAttr
      ? editedUserError?.properties?.details?.properties?.[
          inputName as keyof IUserDetails
        ]?.errors?.[0]
      : undefined;
  const access = canBeAlter && isEditing;
  return (
    <div className="max-w-96">
      <Fields.label text={label} />
      {!isEditing && !value && (
        <p className="text-beergam-gray">Campo não preenchido.</p>
      )}
      {access &&
        React.cloneElement(children as React.ReactElement<InputProps>, {
          //Clonando o elemento filho para adicionar as props necessárias
          value: value ?? "",
          defaultValue: value ?? "",
          name: inputName as string,
          dataTooltipId: `${inputName}-tooltip`,
          error: attributeError,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e);
          },
        })}

      {!access && (
        <p className={`${attributeError && "text-beergam-red"}`}>
          {sanitizeValue(value ?? "")}
        </p>
      )}
    </div>
  );
}

function ElementSection({
  sectionTitle,
  children,
  editingState,
  setEditingState,
}: {
  sectionTitle: keyof typeof editingInitialState;
  children: React.ReactNode;
  editingState: SessionsState;
  setEditingState: React.Dispatch<{
    type: "update";
    payload: string | number | null;
  }>;
}) {
  const editingValue = editingState[sectionTitle];
  return (
    <section>
      <div className="flex gap-4 items-center mb-4">
        <h2 className="text-beergam-blue-primary">{sectionTitle as string}</h2>
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full bg-beergam-blue-primary text-beergam-white hover:bg-beergam-orange"
          onClick={() =>
            setEditingState({ type: "update", payload: sectionTitle })
          }
        >
          {editingValue ? (
            <Svg.arrow_uturn_left width={18} height={18} />
          ) : (
            <Svg.pencil width={18} height={18} />
          )}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ElementSectionContext.Provider value={{ isEditing: editingValue }}>
          {children}
        </ElementSectionContext.Provider>
      </div>
    </section>
  );
}
interface FieldErrors {
  [key: string]: Array<Record<string, string>>;
}

export default function MinhaConta<T extends IUser | IColab>({
  user,
}: {
  user: T;
}) {
  const dispatch = useDispatch();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      e.target.name === "notify_newsletter" ||
      e.target.name === "invoice_in_flex"
    ) {
      console.log("e.target.name", e.target.name);
      console.log("e.target.checked", e.target.checked);
      setEditedUser({
        type: "update",
        payload: {
          details: {
            ...editedUser.details,
            [e.target.name]: e.target.checked,
          },
        } as Partial<T>,
      });
    } else {
      if (isAtributeUser(e.target.name as keyof IUser)) {
        setEditedUser({
          type: "update",
          payload: { [e.target.name]: e.target.value } as Partial<T>,
        });
      } else if (isAtributeUserDetails(e.target.name as keyof IUserDetails)) {
        setEditedUser({
          type: "update",
          payload: {
            details: { ...editedUser.details, [e.target.name]: e.target.value },
          } as Partial<T>,
        });
      }
    }
  };
  const fetcher = useFetcher();
  const [editedUser, setEditedUser] = useReducer(
    (
      state: T,
      action:
        | { type: "update"; payload: Partial<T> }
        | { type: "reset"; payload?: undefined }
    ) => {
      switch (action.type) {
        case "update":
          if (!state) return state;
          return { ...state, ...action.payload };
        case "reset":
          return user;
        default:
          return state;
      }
    },
    user
  );

  const [sessions, setSession] = useReducer(
    (
      state: SessionsState,
      action:
        | { type: "update"; payload: string | number | null }
        | { type: "reset"; payload?: undefined }
    ) => {
      switch (action.type) {
        case "update":
          if (!state) return state;
          return {
            ...state,
            [action.payload as string]: !state[action.payload as string],
          };
        case "reset":
          return editingInitialState;
        default:
          return state;
      }
    },
    editingInitialState
  );
  const [fieldErrors, setFieldErrors] = useReducer(
    (state: FieldErrors, action: { type: "update"; payload: FieldErrors }) => {
      switch (action.type) {
        case "update":
          return { ...state, ...action.payload };
        default:
          return state;
      }
    },
    fetcher.data?.error_fields ?? {}
  );
  console.log("fieldErrors", fieldErrors);
  const editedUserValidation = UserSchema.safeParse(editedUser);
  const editedUserError = editedUserValidation.error
    ? z.treeifyError(editedUserValidation.error)
    : null;
  const infoDifferences = getObjectDifferences(user, editedUser, [
    "created_at",
    "updated_at",
  ]);
  const fetchData = () => {
    if (fetcher.state === "submitting") return;
    if (Object.keys(infoDifferences).length === 0 || editedUserError) return;
    const dataToSubmit = { ...infoDifferences };
    fetcher.submit(
      JSON.stringify({ action: "Minha Conta", data: { ...dataToSubmit } }),
      {
        method: "post",
        encType: "application/json",
      }
    );
  };
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        console.log("atualizando o usuario");
        const userData = UserSchema.safeParse(fetcher.data.data);
        dispatch(
          updateUserInfo({ user: userData.data as IUser, shouldEncrypt: true })
        );
        setSession({ type: "reset" });
      } else {
        if (fetcher.data.error_fields) {
          setFieldErrors({
            type: "update",
            payload: fetcher.data.error_fields,
          });
        }
      }
    }
  }, [fetcher.state]);
  useEffect(() => {
    setEditedUser({ type: "reset" });
  }, [user]);
  const usersAreEqual = useMemo(() => {
    if (!user || !editedUser) return false;

    // Comparação rápida primeiro
    if (user === editedUser) return true;

    // Comparação profunda apenas se necessário
    return deepEqual(user, editedUser);
  }, [user, editedUser]);
  return (
    <div className="flex flex-col gap-4">
      {isMaster(user) &&
        isMaster(editedUser) && ( //Definindo o tipo de informação que será editada para o TypeScript não encher mais o saco
          <>
            <ElementSection
              sectionTitle="Dados Pessoais"
              editingState={sessions}
              setEditingState={setSession}
            >
              <ElementWrapper
                canBeAlter={false}
                value={editedUser.name}
                inputName="name"
                label="NOME"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.input />
              </ElementWrapper>
              <ElementWrapper
                canBeAlter={false}
                value={editedUser.details?.email ?? ""}
                inputName="email"
                label="EMAIL"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.input />
              </ElementWrapper>
              <ElementWrapper
                canBeAlter={user.details.cpf ? false : true}
                value={editedUser.details.cpf ?? ""}
                inputName="cpf"
                label="CPF"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.input />
              </ElementWrapper>
              <ElementWrapper
                canBeAlter={user.details.cnpj ? false : true}
                value={editedUser.details.cnpj ?? ""}
                inputName="cnpj"
                label="CNPJ"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.input />
              </ElementWrapper>
              <ElementWrapper
                canBeAlter={false}
                value={editedUser.details.phone ?? ""}
                inputName="phone"
                label="WHATSAPP"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.input />
              </ElementWrapper>
              <ElementWrapper
                canBeAlter={true}
                value={editedUser.details.secondary_phone ?? ""}
                inputName="secondary_phone"
                label="TELEFONE SECUNDÁRIO"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.input />
              </ElementWrapper>
              <ElementWrapper
                canBeAlter={true}
                value={editedUser.details.profit_range}
                inputName="profit_range"
                label="FATURAMENTO MENSAL"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.select
                  options={Object.keys(ProfitRange).map((key) => ({
                    value: key,
                    label: ProfitRange[key as keyof typeof ProfitRange],
                  }))}
                />
              </ElementWrapper>
              <ElementWrapper
                canBeAlter={false}
                value={editedUser.details.personal_reference_code ?? ""}
                inputName="personal_reference_code"
                label="CÓDIGO DE INDICAÇÃO"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.input />
              </ElementWrapper>
              <ElementWrapper
                canBeAlter={false}
                value={editedUser.pin ?? ""}
                inputName="pin"
                label="PIN"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.input />
              </ElementWrapper>
              <ElementWrapper
                canBeAlter={false}
                value={dayjs(editedUser.created_at).format("DD/MM/YYYY") ?? ""}
                inputName="created_at"
                label="DATA DE REGISTRO"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.input />
              </ElementWrapper>
            </ElementSection>
            <ElementSection
              sectionTitle="Dados Financeiros"
              editingState={sessions}
              setEditingState={setSession}
            >
              <ElementWrapper
                canBeAlter={true}
                value={editedUser.details.calc_profit_product}
                inputName="calc_profit_product"
                label="CÁLCULO DE LUCRO DO PRODUTO"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.select
                  options={Object.keys(CalcProfitProduct).map((key) => ({
                    value: key,
                    label: FormatCalcProfitProduct(key as CalcProfitProduct),
                  }))}
                />
              </ElementWrapper>
              <ElementWrapper
                canBeAlter={true}
                value={editedUser.details.calc_tax}
                inputName="calc_tax"
                label="CÁLCULO DE IMPOSTO"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.select
                  options={Object.keys(CalcTax).map((key) => ({
                    value: key,
                    label: FormatCalcTax(key as CalcTax),
                  }))}
                />
              </ElementWrapper>
              <ElementWrapper
                canBeAlter={true}
                value={editedUser.details.tax_percent_fixed ?? ""}
                inputName="tax_percent_fixed"
                label="CÁLCULO FIXO DE IMPOSTO"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.input />
              </ElementWrapper>
              <ElementWrapper
                canBeAlter={true}
                value={editedUser.details.number_of_employees}
                inputName="number_of_employees"
                label="NÚMERO DE EMPREGADOS"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.select
                  options={Object.keys(NumberOfEmployees).map((key) => ({
                    value: key,
                    label: FormatNumberOfEmployees(key as NumberOfEmployees),
                  }))}
                />
              </ElementWrapper>
              <ElementWrapper
                canBeAlter={true}
                value={editedUser.details.current_billing}
                inputName="current_billing"
                label="FATURAMENTO MENSAL"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.select
                  options={Object.keys(CurrentBilling).map((key) => ({
                    value: key,
                    label: FormatCurrentBilling(key as CurrentBilling),
                  }))}
                />
              </ElementWrapper>
              <ElementWrapper
                canBeAlter={true}
                value={editedUser.details.invoice_in_flex ? "Sim" : "Não"}
                inputName="invoice_in_flex"
                label="EMITE NOTA FISCAL EM FLEX"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Switch
                  checked={editedUser.details.invoice_in_flex ?? false}
                  onChange={handleChange}
                />
              </ElementWrapper>
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-beergam-blue-primary mb-4 font-bold!">
                  Vendas em Marketplaces
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <ElementWrapper
                    canBeAlter={true}
                    value={editedUser.details.sells_meli ?? ""}
                    inputName="sells_meli"
                    label="MERCADO LIVRE"
                    onChange={handleChange}
                    editedUserError={editedUserError}
                  >
                    <Fields.input />
                  </ElementWrapper>
                  <ElementWrapper
                    canBeAlter={true}
                    value={editedUser.details.sells_shopee ?? ""}
                    inputName="sells_shopee"
                    label="SHOPEE"
                    onChange={handleChange}
                    editedUserError={editedUserError}
                  >
                    <Fields.input />
                  </ElementWrapper>
                  <ElementWrapper
                    canBeAlter={true}
                    value={editedUser.details.sells_amazon ?? ""}
                    inputName="sells_amazon"
                    label="AMAZON"
                    onChange={handleChange}
                    editedUserError={editedUserError}
                  >
                    <Fields.input />
                  </ElementWrapper>
                  <ElementWrapper
                    canBeAlter={true}
                    value={editedUser.details.sells_shein ?? ""}
                    inputName="sells_shein"
                    label="SHEIN"
                    onChange={handleChange}
                    editedUserError={editedUserError}
                  >
                    <Fields.input />
                  </ElementWrapper>
                  <ElementWrapper
                    canBeAlter={true}
                    value={editedUser.details.sells_own_site ?? ""}
                    inputName="sells_own_site"
                    label="SITE PRÓPRIO"
                    onChange={handleChange}
                    editedUserError={editedUserError}
                  >
                    <Fields.input />
                  </ElementWrapper>
                </div>
              </div>
            </ElementSection>
            <ElementSection
              sectionTitle="Dados Coorporativos"
              editingState={sessions}
              setEditingState={setSession}
            >
              <ElementWrapper
                canBeAlter={true}
                value={editedUser.details.social_media ?? ""}
                inputName="social_media"
                label="REDE SOCIAL"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.input />
              </ElementWrapper>
              <ElementWrapper
                canBeAlter={true}
                value={editedUser.details.website ?? ""}
                inputName="website"
                label="SITE COORPORATIVO"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.input />
              </ElementWrapper>
              <ElementWrapper
                canBeAlter={true}
                value={
                  editedUser.details.foundation_date
                    ? dayjs(editedUser.details.foundation_date).format(
                        "DD/MM/YYYY"
                      )
                    : null
                }
                inputName="foundation_date"
                label="DATA DE FUNDAÇÃO"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <FilterDatePicker
                  label="DATA DE FUNDAÇÃO"
                  value={editedUser.details.foundation_date ?? ""}
                  onChange={(value) => handleChange({
                    target: {
                      name: "foundation_date",
                      value: (value ?? undefined) as string,
                    },
                  } as React.ChangeEvent<HTMLInputElement>)}
                />
              </ElementWrapper>
              <ElementWrapper
                canBeAlter={true}
                value={editedUser.details.segment}
                inputName="segment"
                label="SEGMENTO"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.select
                  options={Object.keys(Segment).map((key) => ({
                    value: key,
                    label: FormatSegment(key as Segment),
                  }))}
                />
              </ElementWrapper>
            </ElementSection>
            <div
              className={`sticky w-full md:bottom-0 bottom-16 left-0 right-0 flex justify-end lg:justify-center items-center ${
                usersAreEqual
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100 pointer-events-auto"
              }`}
            >
              <Paper className="flex w-full lg:w-2/3 justify-between items-center">
                <p className="font-bold hidden lg:inline-block text-beergam-blue-primary">
                  Deseja salvar suas alterações?
                </p>
                <div className="flex gap-4 w-full justify-center items-center lg:w-auto">
                  <button
                    className="text-beergam-white bg-beergam-blue-primary p-2 rounded-2xl"
                    onClick={() => setEditedUser({ type: "reset" })}
                    type="button"
                  >
                    <p>Redefinir</p>
                  </button>
                  <button
                    data-tooltip-id="salvar-alteracoes"
                    className={`${editedUserError ? "bg-beergam-blue-primary/40 cursor-not-allowed!" : "bg-beergam-blue-primary hover:bg-beergam-orange"} font-bold! text-beergam-white p-2 rounded-2xl`}
                    onClick={() => fetchData()}
                  >
                    <p>Salvar alterações</p>
                  </button>
                  {editedUserError && (
                    <Tooltip
                      id="salvar-alteracoes"
                      content="Você possui erros pendentes no formulário."
                    />
                  )}
                </div>
              </Paper>
            </div>
          </>
        )}
    </div>
  );
}

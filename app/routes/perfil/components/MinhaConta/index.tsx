// import { Paper } from "@mui/material";
// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useReducer,
//   useRef,
// } from "react";
// import { Form, useSubmit } from "react-router";
// import { Tooltip } from "react-tooltip";
// import { z } from "zod";
// import type { IColab } from "~/features/user/typings/Colab";
// import {
//   isAtributeUser,
//   isAtributeUserDetails,
//   UserSchema,
//   type IUser,
//   type IUserDetails,
// } from "~/features/user/typings/User";
// import { isMaster } from "~/features/user/utils";
// import Svg from "~/src/assets/svgs";
// import { Fields } from "~/src/components/utils/_fields";
// import Hint from "~/src/components/utils/Hint";
// import { deepEqual, getObjectDifferences, HandleSubmit } from "../../utils";
// const production = import.meta.env.PROD;
// const EditingContext = React.createContext<boolean>(false);
// interface MinhaContaProps<T extends IUser | IColab> {
//   user: T;
// }
// export default function MinhaConta<T extends IUser | IColab>({
//   user,
// }: MinhaContaProps<T>) {
//   const [editedUser, setEditedUser] = useReducer(
//     (
//       state: T,
//       action:
//         | { type: "update"; payload: Partial<T> }
//         | { type: "reset"; payload?: undefined }
//     ) => {
//       switch (action.type) {
//         case "update":
//           if (!state) return state;
//           return { ...state, ...action.payload };
//         case "reset":
//           return user;
//         default:
//           return state;
//       }
//     },
//     user
//   );
//   const submit = useSubmit();
//   const editedUserValidation = UserSchema.safeParse(editedUser);
//   const editedUserError = editedUserValidation.error
//     ? z.treeifyError(editedUserValidation.error)
//     : null;
//   const usersAreEqual = useMemo(() => {
//     if (!user || !editedUser) return false;

//     // Comparação rápida primeiro
//     if (user === editedUser) return true;

//     // Comparação profunda apenas se necessário
//     return deepEqual(user, editedUser);
//   }, [user, editedUser]);
//   useEffect(() => {
//     setEditedUser({ type: "reset" });
//     console.log("mudei o user");
//   }, [user]);
//   const editingInitialState = {
//     "Dados Pessoais": false,
//     "Dados Financeiros": false,
//     "Informações Básicas": false,
//   };
//   const [isEditing, setIsEditing] = useReducer(
//     (
//       state: typeof editingInitialState,
//       action:
//         | Partial<typeof editingInitialState>
//         | keyof typeof editingInitialState
//     ) => {
//       if (typeof action === "string") {
//         return { ...state, [action]: !state[action] };
//       }
//       return { ...state, ...action };
//     },
//     editingInitialState
//   );
//   const editUserInformation = useCallback((payload: Partial<T>) => {
//     setEditedUser({ type: "update", payload });
//   }, []);
//   const handleUserInfoChange = useCallback(
//     (
//       value: string | null | boolean,
//       target: string | { details: { key: keyof IUserDetails } }
//     ) => {
//       if (!editedUser || !target) {
//         return;
//       }
//       if (typeof target == "string") {
//         if (value == "") {
//           value = null;
//         }
//         editUserInformation({ [target]: value } as Partial<T>);
//       }
//       if (typeof target == "object" && "details" in target && target.details) {
//         if (!("details" in editedUser)) {
//           return;
//         }
//         if (value == "") {
//           value = null;
//         }
//         editUserInformation({
//           details: {
//             ...editedUser?.details,
//             [target.details.key]: value,
//           },
//         } as Partial<T>);
//       }
//     },
//     [editUserInformation, editedUser]
//   );
//   const CreateFieldsWrapper = useCallback(
//     ({ children }: { children: React.ReactNode }) => {
//       return (
//         <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4`}>
//           {children}
//         </div>
//       );
//     },
//     []
//   );
//   // const CreateFields = useCallback(
//   //   ({
//   //     //Função que cria os campos do formulário com algumas configurações por padrão, lógica de edição, etc.
//   //     label,
//   //     value,
//   //     canBeAlter = false,
//   //     onChange,
//   //     placeholder,
//   //     selectOptions = null,
//   //     hint = null,
//   //     type = "text",
//   //     error = null,
//   //     dataTooltipId = undefined,
//   //   }: {
//   //     label: string;
//   //     value: string | number | boolean | null;
//   //     canBeAlter: boolean;
//   //     onChange?: (value: string | null) => void;
//   //     placeholder?: string;
//   //     selectOptions?: Array<{
//   //       value: string | null;
//   //       label: string;
//   //       disabled?: boolean;
//   //     }> | null;
//   //     hint?: string | null;
//   //     type?: "text" | "number";
//   //     error?: { errors: string[] } | null;
//   //     dataTooltipId?: string | undefined;
//   //   }) => {
//   //     const isEditing = React.useContext(EditingContext);
//   //     if (selectOptions != null) {
//   //       selectOptions = [
//   //         ...selectOptions,
//   //         { value: null, label: "Selecione uma opção", disabled: true },
//   //       ];
//   //     }
//   //     const inputClasses =
//   //       type === "number" && isEditing ? "!w-22 lg:!w-36" : "!w-full lg:!w-2/3";
//   //     return (
//   //       <Fields.wrapper>
//   //         <div className="flex justify-between items-center gap-2">
//   //           <Fields.label text={label} />
//   //           {hint && (
//   //             <Hint message={hint} anchorSelect={label.toLocaleLowerCase()} />
//   //           )}
//   //         </div>
//   //         {value ? (
//   //           isEditing && canBeAlter ? (
//   //             selectOptions ? (
//   //               <Fields.select
//   //                 value={value as string | null}
//   //                 onChange={(e) => onChange?.(e.target.value)}
//   //                 options={selectOptions}
//   //                 tailWindClasses="!w-2/3"
//   //               />
//   //             ) : (
//   //               <Fields.input
//   //                 value={value as string | number}
//   //                 onChange={(e) => onChange?.(e.target.value)}
//   //                 placeholder={placeholder}
//   //                 error={error?.errors?.[0]}
//   //                 type={type}
//   //                 dataTooltipId={dataTooltipId}
//   //                 wrapperSize={inputClasses}
//   //               />
//   //             )
//   //           ) : selectOptions ? (
//   //             <p>
//   //               {selectOptions.find((option) => option.value === value)?.label}
//   //             </p>
//   //           ) : (
//   //             <p
//   //               className={`${error?.errors.length && error?.errors.length > 0 ? "text-red-500" : ""}`}
//   //             >
//   //               {value}
//   //             </p>
//   //           )
//   //         ) : canBeAlter && isEditing ? (
//   //           selectOptions ? (
//   //             <Fields.select
//   //               value={""}
//   //               onChange={(e) => {
//   //                 console.log("e", e);
//   //                 onChange?.(e.target.value);
//   //               }}
//   //               options={selectOptions}
//   //               tailWindClasses="!w-2/3"
//   //             />
//   //           ) : (
//   //             <Fields.input
//   //               value={""}
//   //               onChange={(e) => {
//   //                 console.log("e", e);
//   //                 onChange?.(e.target.value);
//   //               }}
//   //               placeholder={placeholder}
//   //               error={error?.errors?.[0]}
//   //               type={type}
//   //               dataTooltipId={dataTooltipId}
//   //               wrapperSize={inputClasses}
//   //             />
//   //           )
//   //         ) : (
//   //           <p>Você ainda não preencheu este campo.</p>
//   //         )}
//   //       </Fields.wrapper>
//   //     );
//   //   },
//   //   []
//   // );
//   interface CreateFieldsProps {
//     value: string | number | boolean | null;
//     label: string;
//     canBeAlter: boolean;
//     hint?: string;
//     children: React.ReactNode;
//     name: keyof IUser | keyof IUserDetails;
//   }
//   const CreateFields = useCallback(
//     ({ value, label, canBeAlter, hint, children, name }: CreateFieldsProps) => {
//       const isDetailedAttribute = isAtributeUserDetails(name);
//       const isUserAttribute = isAtributeUser(name);
//       // const error = isUserAttribute
//       //   ? editedUserError?.properties?.[
//       //       name as keyof typeof editedUserError.properties
//       //     ]?.errors?.[0]
//       //   : isDetailedAttribute
//       //     ? editedUserError?.properties?.details?.properties?.[
//       //         name as keyof typeof editedUserError.properties.details.properties
//       //       ]?.errors?.[0]
//       //     : null;
//       const error = useMemo(() => {
//         return editedUserError?.properties?.name?.errors?.[0];
//       }, [editedUserError]);
//       return (
//         <div>
//           <Fields.label text={label} />
//           {hint && (
//             <Hint message={hint} anchorSelect={label.toLocaleLowerCase()} />
//           )}
//           {<p>error: {JSON.stringify(error)}</p>}
//           {canBeAlter &&
//             React.isValidElement(children) &&
//             React.cloneElement(children as React.ReactElement<unknown>, {
//               value,
//               name,
//               error,
//               dataTooltipId: `${name}-input`,
//               onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
//                 if (isUserAttribute) {
//                   handleUserInfoChange(e.target.value, name as string);
//                 }
//                 if (isDetailedAttribute) {
//                   handleUserInfoChange(e.target.value, {
//                     details: { key: name as keyof IUserDetails },
//                   });
//                 }
//               },
//             })}
//           {!canBeAlter && <p>{value}</p>}
//         </div>
//       );
//     },
//     []
//   );
//   const GenerateSubSections = useCallback(
//     ({
//       subSectionTitle,
//       children,
//     }: {
//       subSectionTitle: string;
//       children: React.ReactNode;
//     }) => {
//       return (
//         <div
//           className={`w-full flex flex-col gap-4 h-fit col-span-1 lg:col-span-2`}
//         >
//           <h4 className="text-beergam-blue-primary font-bold uppercase">
//             {subSectionTitle}
//           </h4>
//           <CreateFieldsWrapper>{children}</CreateFieldsWrapper>
//         </div>
//       );
//     },
//     []
//   );
//   const CreateFieldsSections = useCallback(
//     ({
//       children,
//       sectionTitle,
//     }: {
//       children: React.ReactNode;
//       sectionTitle: keyof typeof editingInitialState;
//     }) => {
//       const handleToggleEdit = useCallback(() => {
//         setIsEditing({ [sectionTitle]: !isEditing[sectionTitle] });
//       }, [sectionTitle, isEditing]);
//       const containerRef = useRef<HTMLDivElement>(null);

//       const editingValue = useMemo(
//         () => isEditing[sectionTitle],
//         [isEditing, sectionTitle]
//       );
//       useEffect(() => {
//         // Verifica se está em um computador (tela > 1024px como critério comum para desktop)
//         if (
//           editingValue &&
//           typeof window !== "undefined" &&
//           window.matchMedia &&
//           window.matchMedia("(min-width: 1024px)").matches
//         ) {
//           containerRef.current?.scrollIntoView({
//             behavior: "smooth",
//             block: "end",
//           });
//         }
//       }, [editingValue]);
//       return (
//         <EditingContext.Provider value={editingValue}>
//           <div ref={containerRef} className="flex flex-col gap-4 mb-4">
//             <div className="flex items-center gap-4">
//               <h3 className="text-beergam-blue-primary uppercase !font-bold">
//                 {sectionTitle}
//               </h3>
//               <button onClick={handleToggleEdit}>
//                 <div className="flex justify-center items-center gap-2 p-4 pt-1 pb-1 rounded-xl bg-beergam-blue-primary hover:bg-beergam-orange text-beergam-white">
//                   <p className="hidden lg:block">Editar {sectionTitle}</p>
//                   {editingValue ? (
//                     <Svg.eye width={17} height={17} tailWindClasses="" />
//                   ) : (
//                     <Svg.pencil width={17} height={17} />
//                   )}
//                 </div>
//               </button>
//             </div>
//             <CreateFieldsWrapper>{children}</CreateFieldsWrapper>
//           </div>
//         </EditingContext.Provider>
//       );
//     },
//     [isEditing]
//   );
//   const GenerateFieldsBySection = useCallback(
//     (
//       //Função que gera os campos se baseando nas sessões
//       sectionTitle: keyof typeof editingInitialState
//     ) => {
//       if (!editedUser || !user) return null;
//       if (isMaster(editedUser) && isMaster(user)) {
//         // switch (sectionTitle) {
//         //   case "Dados Pessoais":
//         //     return (
//         //       <>
//         //         <CreateFields
//         //           label="NOME / RAZÃO SOCIAL"
//         //           value={user?.name ?? ""}
//         //           canBeAlter={false}
//         //           error={editedUserError?.properties?.name}
//         //         />
//         //         <>
//         //           <CreateFields
//         //             label="EMAIL"
//         //             value={user?.details?.email ?? ""}
//         //             canBeAlter={false}
//         //             error={
//         //               editedUserError?.properties?.details?.properties?.email
//         //             }
//         //           />
//         //           <CreateFields
//         //             label="TELEFONE"
//         //             value={user?.details?.phone ?? ""}
//         //             canBeAlter={false}
//         //             error={
//         //               editedUserError?.properties?.details?.properties?.phone
//         //             }
//         //           />
//         //           <CreateFields
//         //             label="CPF"
//         //             value={editedUser?.details?.cpf ?? null}
//         //             canBeAlter={
//         //               user?.details?.cpf == null ||
//         //               user?.details?.cpf == undefined
//         //             }
//         //             placeholder="Digite seu CPF"
//         //             onChange={(value) =>
//         //               handleUserInfoChange(value, { details: { key: "cpf" } })
//         //             }
//         //             error={
//         //               editedUserError?.properties?.details?.properties?.cpf
//         //             }
//         //             dataTooltipId="cpf-input"
//         //           />
//         //           <CreateFields
//         //             label="CNPJ"
//         //             value={editedUser?.details?.cnpj ?? null}
//         //             canBeAlter={
//         //               user?.details?.cnpj == null ||
//         //               user?.details?.cnpj == undefined
//         //             }
//         //             onChange={(value) =>
//         //               handleUserInfoChange(value, { details: { key: "cnpj" } })
//         //             }
//         //             placeholder="Digite seu CNPJ"
//         //             error={
//         //               editedUserError?.properties?.details?.properties?.cnpj
//         //             }
//         //             dataTooltipId="cnpj-input"
//         //           />
//         //           <CreateFields
//         //             label="CÓDIGO DE INDICAÇÃO"
//         //             value={user?.details?.personal_reference_code ?? ""}
//         //             canBeAlter={false}
//         //             hint="Compartilhe seu código de indicação para convidar novos usuários ao Beergam."
//         //             error={
//         //               editedUserError?.properties?.details?.properties
//         //                 ?.personal_reference_code
//         //             }
//         //           />
//         //           <CreateFields
//         //             label="COMO CONHECEU A BEERGAM"
//         //             value={editedUser?.details?.found_beergam ?? null}
//         //             canBeAlter={false}
//         //             onChange={(value) =>
//         //               handleUserInfoChange(value, {
//         //                 details: { key: "found_beergam" },
//         //               })
//         //             }
//         //             selectOptions={Object.keys(ComoConheceu).map((key) => ({
//         //               value: key,
//         //               label: ComoConheceu[key as keyof typeof ComoConheceu],
//         //             }))}
//         //             error={
//         //               editedUserError?.properties?.details?.properties
//         //                 ?.found_beergam
//         //             }
//         //           />
//         //           <CreateFields
//         //             label="FATURAMENTO MENSAL"
//         //             value={editedUser?.details?.profit_range ?? null}
//         //             canBeAlter={true}
//         //             onChange={(value) =>
//         //               handleUserInfoChange(value, {
//         //                 details: { key: "profit_range" },
//         //               })
//         //             }
//         //             selectOptions={Object.keys(ProfitRange).map((key) => ({
//         //               value: key,
//         //               label: ProfitRange[key as keyof typeof ProfitRange],
//         //             }))}
//         //             error={
//         //               editedUserError?.properties?.details?.properties
//         //                 ?.profit_range
//         //             }
//         //           />
//         //           <CreateFields
//         //             label="PIN"
//         //             value={user?.pin ?? null}
//         //             canBeAlter={false}
//         //             onChange={() => {}}
//         //             hint="O PIN é usado para acessar o sistema de colaboradores."
//         //             error={editedUserError?.properties?.pin}
//         //           />
//         //         </>
//         //       </>
//         //     );
//         //   case "Dados Financeiros":
//         //     return (
//         //       <>
//         //         {"details" in editedUser && (
//         //           <>
//         //             <CreateFields
//         //               label="CÁLCULO DE LUCRO DO PRODUTO"
//         //               value={editedUser?.details?.calc_profit_product ?? null}
//         //               canBeAlter={true}
//         //               onChange={(value) =>
//         //                 handleUserInfoChange(value, {
//         //                   details: { key: "calc_profit_product" },
//         //                 })
//         //               }
//         //               hint="O cálculo de lucro do produto mostra quanto você realmente ganha por venda, subtraindo do preço todos os custos (produto, frete, taxas, impostos e embalagem)."
//         //               selectOptions={Object.keys(CalcProfitProduct).map(
//         //                 (key) => ({
//         //                   value: key,
//         //                   label:
//         //                     CalcProfitProduct[
//         //                       key as keyof typeof CalcProfitProduct
//         //                     ],
//         //                 })
//         //               )}
//         //             />
//         //             <CreateFields
//         //               label="CÁLCULO DE IMPOSTO"
//         //               value={editedUser?.details?.calc_tax ?? null}
//         //               canBeAlter={true}
//         //               onChange={(value) =>
//         //                 handleUserInfoChange(value, {
//         //                   details: { key: "calc_tax" },
//         //                 })
//         //               }
//         //               hint="São diferentes formas de calcular a base tributária antes de aplicar a alíquota do imposto. "
//         //               selectOptions={Object.keys(CalcTax).map((key) => ({
//         //                 value: key,
//         //                 label: CalcTax[key as keyof typeof CalcTax],
//         //               }))}
//         //             />
//         //             <CreateFields
//         //               label="PORCENTAGEM FIXA DE IMPOSTO"
//         //               value={editedUser?.details?.tax_percent_fixed ?? null}
//         //               canBeAlter={true}
//         //               onChange={(value) =>
//         //                 handleUserInfoChange(value, {
//         //                   details: { key: "tax_percent_fixed" },
//         //                 })
//         //               }
//         //               hint="São diferentes formas de calcular a base tributária antes de aplicar a alíquota do imposto. "
//         //               type="number"
//         //               dataTooltipId="porcentagem-fixa-imposto"
//         //               error={
//         //                 editedUserError?.properties?.details?.properties
//         //                   ?.tax_percent_fixed
//         //               }
//         //             />
//         //             <CreateFields
//         //               label="NÚMERO DE FUNCIONÁRIOS"
//         //               value={editedUser?.details?.number_of_employees ?? null}
//         //               canBeAlter={true}
//         //               onChange={(value) =>
//         //                 handleUserInfoChange(value, {
//         //                   details: { key: "number_of_employees" },
//         //                 })
//         //               }
//         //               selectOptions={Object.keys(NumberOfEmployees).map(
//         //                 (key) => ({
//         //                   value: key,
//         //                   label:
//         //                     NumberOfEmployees[
//         //                       key as keyof typeof NumberOfEmployees
//         //                     ],
//         //                 })
//         //               )}
//         //               error={
//         //                 editedUserError?.properties?.details?.properties
//         //                   ?.number_of_employees
//         //               }
//         //               dataTooltipId="numero-de-funcionarios"
//         //             />
//         //             <CreateFields
//         //               label="FATURADOR ATUAL"
//         //               value={editedUser?.details?.current_billing ?? null}
//         //               canBeAlter={true}
//         //               onChange={(value) =>
//         //                 handleUserInfoChange(value, {
//         //                   details: { key: "current_billing" },
//         //                 })
//         //               }
//         //               selectOptions={Object.keys(CurrentBilling).map((key) => ({
//         //                 value: key,
//         //                 label:
//         //                   CurrentBilling[key as keyof typeof CurrentBilling],
//         //               }))}
//         //               error={
//         //                 editedUserError?.properties?.details?.properties
//         //                   ?.current_billing
//         //               }
//         //               dataTooltipId="faturador-atual"
//         //             />
//         //             <div>
//         //               <Fields.label text="EMITE NOTA FISCAL NO FLEX" />
//         //               <Switch
//         //                 checked={
//         //                   editedUser?.details?.notify_newsletter ?? false
//         //                 }
//         //                 onChange={(e) => {
//         //                   handleUserInfoChange(e.target.checked, {
//         //                     details: { key: "notify_newsletter" },
//         //                   });
//         //                 }}
//         //               />
//         //             </div>
//         //             <GenerateSubSections subSectionTitle="VENDAS EM PLATAFORMAS">
//         //               <CreateFields
//         //                 label="VENDAS NO MELI"
//         //                 value={editedUser?.details?.sells_meli ?? null}
//         //                 canBeAlter={true}
//         //                 onChange={(value) =>
//         //                   handleUserInfoChange(value, {
//         //                     details: { key: "sells_meli" },
//         //                   })
//         //                 }
//         //                 type="number"
//         //                 error={
//         //                   editedUserError?.properties?.details?.properties
//         //                     ?.sells_meli
//         //                 }
//         //                 dataTooltipId="vendas-no-meli"
//         //               />

//         //               <CreateFields
//         //                 label="VENDAS NO SHOPEE"
//         //                 value={editedUser?.details?.sells_shopee ?? null}
//         //                 canBeAlter={true}
//         //                 onChange={(value) =>
//         //                   handleUserInfoChange(value, {
//         //                     details: { key: "sells_shopee" },
//         //                   })
//         //                 }
//         //                 type="number"
//         //                 error={
//         //                   editedUserError?.properties?.details?.properties
//         //                     ?.sells_shopee
//         //                 }
//         //                 dataTooltipId="vendas-no-shopee"
//         //               />
//         //               <CreateFields
//         //                 label="VENDAS NO AMAZON"
//         //                 value={editedUser?.details?.sells_amazon ?? null}
//         //                 canBeAlter={true}
//         //                 onChange={(value) =>
//         //                   handleUserInfoChange(value, {
//         //                     details: { key: "sells_amazon" },
//         //                   })
//         //                 }
//         //                 type="number"
//         //                 error={
//         //                   editedUserError?.properties?.details?.properties
//         //                     ?.sells_amazon
//         //                 }
//         //                 dataTooltipId="vendas-no-amazon"
//         //               />
//         //               <CreateFields
//         //                 label="VENDAS NO SHEIN"
//         //                 value={editedUser?.details?.sells_shein ?? null}
//         //                 canBeAlter={true}
//         //                 onChange={(value) =>
//         //                   handleUserInfoChange(value, {
//         //                     details: { key: "sells_shein" },
//         //                   })
//         //                 }
//         //                 type="number"
//         //                 error={
//         //                   editedUserError?.properties?.details?.properties
//         //                     ?.sells_shein
//         //                 }
//         //                 dataTooltipId="vendas-no-shein"
//         //               />
//         //               <CreateFields
//         //                 label="VENDAS NO SITE PRÓPRIO"
//         //                 value={editedUser?.details?.sells_own_site ?? null}
//         //                 canBeAlter={true}
//         //                 onChange={(value) =>
//         //                   handleUserInfoChange(value, {
//         //                     details: { key: "sells_own_site" },
//         //                   })
//         //                 }
//         //                 type="number"
//         //                 error={
//         //                   editedUserError?.properties?.details?.properties
//         //                     ?.sells_own_site
//         //                 }
//         //                 dataTooltipId="vendas-no-site-proprio"
//         //               />
//         //             </GenerateSubSections>
//         //           </>
//         //         )}
//         //       </>
//         //     );
//         //   case "Informações Básicas":
//         //     return (
//         //       "details" in editedUser && (
//         //         <>
//         //           <CreateFields
//         //             label="REDE SOCIAL"
//         //             value={editedUser?.details?.social_media ?? null}
//         //             canBeAlter={true}
//         //             onChange={(value) =>
//         //               handleUserInfoChange(value, {
//         //                 details: { key: "social_media" },
//         //               })
//         //             }
//         //           />
//         //           <CreateFields
//         //             label="TELEFONE SECUNDÁRIO"
//         //             value={editedUser?.details?.secondary_phone ?? null}
//         //             canBeAlter={true}
//         //             onChange={(value) =>
//         //               handleUserInfoChange(value, {
//         //                 details: { key: "secondary_phone" },
//         //               })
//         //             }
//         //             error={
//         //               editedUserError?.properties?.details?.properties
//         //                 ?.secondary_phone
//         //             }
//         //             dataTooltipId="telefone-secundario"
//         //           />
//         //           <GenerateSubSections subSectionTitle="Dados coorporativos">
//         //             <CreateFields
//         //               label="SITE COORPORATIVO"
//         //               value={editedUser?.details?.website ?? null}
//         //               canBeAlter={true}
//         //               onChange={(value) =>
//         //                 handleUserInfoChange(value, {
//         //                   details: { key: "website" },
//         //                 })
//         //               }
//         //               error={
//         //                 editedUserError?.properties?.details?.properties
//         //                   ?.website
//         //               }
//         //               dataTooltipId="site-coorporativo"
//         //             />
//         //             {editedUser?.details?.foundation_date ? (
//         //               <BasicDatePicker
//         //                 value={dayjs(
//         //                   editedUser?.details?.foundation_date
//         //                 ).toDate()}
//         //                 onChange={(date) =>
//         //                   handleUserInfoChange(dayjs(date).toISOString(), {
//         //                     details: { key: "foundation_date" },
//         //                   })
//         //                 }
//         //               />
//         //             ) : (
//         //               <p>Você ainda não preencheu este campo.</p>
//         //             )}
//         //             <CreateFields
//         //               label="SEGMENTO"
//         //               value={editedUser?.details?.segment ?? null}
//         //               canBeAlter={true}
//         //               onChange={(value) =>
//         //                 handleUserInfoChange(value, {
//         //                   details: { key: "segment" },
//         //                 })
//         //               }
//         //               selectOptions={Object.keys(Segment).map((key) => ({
//         //                 value: key,
//         //                 label: Segment[key as keyof typeof Segment],
//         //               }))}
//         //               error={
//         //                 editedUserError?.properties?.details?.properties
//         //                   ?.segment
//         //               }
//         //               dataTooltipId="segmento"
//         //             />
//         //           </GenerateSubSections>
//         //           {/* <GenerateSubSections subSectionTitle="Endereço completo">
//         //             <CreateFields
//         //               label="CEP"
//         //               value={null}
//         //               canBeAlter={true}
//         //               onChange={() => {}}
//         //             />
//         //             <CreateFields
//         //               label="Bairro"
//         //               value={null}
//         //               canBeAlter={true}
//         //               onChange={() => {}}
//         //             />
//         //             <CreateFields
//         //               label="Cidade"
//         //               value={null}
//         //               canBeAlter={true}
//         //               onChange={() => {}}
//         //             />
//         //             <CreateFields
//         //               label="Estado"
//         //               value={null}
//         //               canBeAlter={true}
//         //               onChange={() => {}}
//         //             />
//         //             <CreateFields
//         //               label="Rua"
//         //               value={null}
//         //               canBeAlter={true}
//         //               onChange={() => {}}
//         //             />
//         //             <CreateFields
//         //               label="Número"
//         //               value={null}
//         //               canBeAlter={true}
//         //               onChange={() => {}}
//         //             />
//         //             <CreateFields
//         //               label="Complemento"
//         //               value={null}
//         //               canBeAlter={true}
//         //               onChange={() => {}}
//         //             />
//         //           </GenerateSubSections> */}
//         //         </>
//         //       )
//         //     );
//         //   default:
//         //     return null;
//         // }
//         switch (sectionTitle) {
//           case "Dados Pessoais":
//             return (
//               <>
//                 {/* <CreateFields
//                   label="NOME"
//                   value={editedUser?.details?.name ?? null}
//                 /> */}
//                 <CreateFields
//                   label="NOME"
//                   value={editedUser?.name ?? null}
//                   name="name"
//                   canBeAlter={true}
//                 >
//                   <Fields.input
//                     error={editedUserError?.properties?.name?.errors?.[0]}
//                   />
//                 </CreateFields>
//                 <CreateFields
//                   label="EMAIL"
//                   value={editedUser?.details?.email ?? null}
//                   name="email"
//                   canBeAlter={true}
//                 >
//                   <Fields.input />
//                 </CreateFields>
//               </>
//             );
//         }
//       }
//     },
//     [editedUser, user, editUserInformation]
//   );

//   // Memoizar as seções para evitar re-renderizações desnecessárias
//   const dadosPessoaisSection = useMemo(
//     () => GenerateFieldsBySection("Dados Pessoais"),
//     [GenerateFieldsBySection]
//   );

//   const dadosFinanceirosSection = useMemo(
//     () => GenerateFieldsBySection("Dados Financeiros"),
//     [GenerateFieldsBySection]
//   );

//   const informacoesBasicasSection = useMemo(
//     () => GenerateFieldsBySection("Informações Básicas"),
//     [GenerateFieldsBySection]
//   );

//   if (!editedUser)
//     return <div className="flex flex-col gap-4">Nenhum usuário encontrado</div>;

//   return (
//     <Form
//       onSubmit={(e) => {
//         console.log("dando submit no bgl jão");
//         e.preventDefault();
//         if (!editedUserValidation.success) {
//           console.log("editedUserValidation invalido", editedUserValidation);
//           return;
//         }
//         const data = getObjectDifferences(user, editedUser);
//         HandleSubmit({ action: "Minha Conta", data: { ...data } }, submit);
//       }}
//       method="post"
//       className="w-full flex flex-col gap-4 mt-4 relative"
//     >
//       {!production && (
//         <>
//           <p>error: {JSON.stringify(editedUserError)}</p>
//           <p>editedUser: {JSON.stringify(editedUser)}</p>
//         </>
//       )}
//       <CreateFieldsSections sectionTitle="Dados Pessoais">
//         {dadosPessoaisSection}
//       </CreateFieldsSections>
//       <CreateFieldsSections sectionTitle="Dados Financeiros">
//         {dadosFinanceirosSection}
//       </CreateFieldsSections>
//       <CreateFieldsSections sectionTitle="Informações Básicas">
//         {informacoesBasicasSection}
//       </CreateFieldsSections>
//       <div
//         className={`sticky w-full bottom-0 left-0 right-0 flex justify-end lg:justify-center items-center ${
//           usersAreEqual
//             ? "opacity-0 pointer-events-none"
//             : "opacity-100 pointer-events-auto"
//         }`}
//       >
//         <Paper className="flex w-full lg:w-2/3 justify-between items-center">
//           <p className="font-bold hidden lg:inline-block text-beergam-blue-primary">
//             Deseja salvar suas alterações?
//           </p>
//           <div className="flex gap-4 w-full justify-center items-center lg:w-auto">
//             <button
//               className="text-beergam-white bg-beergam-blue-primary p-2 rounded-2xl"
//               onClick={() => setEditedUser({ type: "reset" })}
//               type="button"
//             >
//               <p>Redefinir</p>
//             </button>
//             <button
//               type="submit"
//               data-tooltip-id="salvar-alteracoes"
//               className={`${editedUserError ? "bg-beergam-blue-primary/40 !cursor-not-allowed" : "bg-beergam-blue-primary hover:bg-beergam-orange"} !font-bold text-beergam-white p-2 rounded-2xl`}
//               onClick={() => console.log("eba")}
//             >
//               <p>Salvar alterações</p>
//             </button>
//             {editedUserError && (
//               <Tooltip
//                 id="salvar-alteracoes"
//                 content="Você possui erros pendentes no formulário."
//               />
//             )}
//           </div>
//         </Paper>
//       </div>
//     </Form>
//   );
// }
import { Switch } from "@mui/material";
import dayjs from "dayjs";
import React, { useContext, useEffect, useReducer } from "react";
import { useDispatch } from "react-redux";
import { useFetcher } from "react-router";
import { z } from "zod";
import { updateUserInfo } from "~/features/auth/redux";
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
import Svg from "~/src/assets/svgs";
import { Fields } from "~/src/components/utils/_fields";
import type { InputProps } from "~/src/components/utils/_fields/input";
import BasicDatePicker from "~/src/components/utils/BasicDatePicker";
import { getObjectDifferences } from "../../utils";
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
  value: string | number | null;
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
    <div>
      <Fields.label text={label} />
      {!isEditing && !value && (
        <p className="text-beergam-gray">Campo não preenchido.</p>
      )}
      {access &&
        React.cloneElement(children as React.ReactElement<InputProps>, {
          //Clonando o elemento filho para adicionar as props necessárias
          defaultValue: value ?? "",
          name: inputName as string,
          dataTooltipId: `${inputName}-tooltip`,
          error: attributeError,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e);
          },
        })}

      {!access && (
        <p className={`${attributeError && "text-beergam-red"}`}>{value}</p>
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
      action: { type: "update"; payload: string | number | null }
    ) => {
      switch (action.type) {
        case "update":
          if (!state) return state;
          return {
            ...state,
            [action.payload as string]: !state[action.payload as string],
          };
        default:
          return state;
      }
    },
    editingInitialState
  );
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
    if (Object.keys(infoDifferences).length === 0) return;
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
        dispatch(updateUserInfo(fetcher.data.data));
      }
    }
  }, [fetcher.state]);
  useEffect(() => {
    setEditedUser({ type: "reset" });
  }, [user]);
  return (
    <div className="flex flex-col gap-4">
      <button onClick={() => fetchData()}>Teste do Fecther</button>
      <p>fetcher.data : {JSON.stringify(fetcher.data)}</p>
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
                value={FormatProfitRange(
                  editedUser.details.profit_range as ProfitRange
                )}
                inputName="profit_range"
                label="FATURAMENTO MENSAL"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.select
                  value={editedUser.details.profit_range ?? ""}
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
                value={
                  FormatCalcProfitProduct(
                    editedUser.details.calc_profit_product as CalcProfitProduct
                  ) ?? ""
                }
                inputName="calc_profit_product"
                label="CÁLCULO DE LUCRO DO PRODUTO"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.select
                  value={editedUser.details.calc_profit_product ?? ""}
                  options={Object.keys(CalcProfitProduct).map((key) => ({
                    value: key,
                    label: FormatCalcProfitProduct(key as CalcProfitProduct),
                  }))}
                />
              </ElementWrapper>
              <ElementWrapper
                canBeAlter={true}
                value={
                  FormatCalcTax(editedUser.details.calc_tax as CalcTax) ?? ""
                }
                inputName="calc_tax"
                label="CÁLCULO DE IMPOSTO"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.select
                  value={editedUser.details.calc_tax ?? ""}
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
                value={
                  FormatNumberOfEmployees(
                    editedUser.details.number_of_employees as NumberOfEmployees
                  ) ?? ""
                }
                inputName="number_of_employees"
                label="NÚMERO DE EMPREGADOS"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.select
                  value={editedUser.details.number_of_employees ?? ""}
                  options={Object.keys(NumberOfEmployees).map((key) => ({
                    value: key,
                    label: FormatNumberOfEmployees(key as NumberOfEmployees),
                  }))}
                />
              </ElementWrapper>
              <ElementWrapper
                canBeAlter={true}
                value={
                  FormatCurrentBilling(
                    editedUser.details.current_billing as CurrentBilling
                  ) ?? ""
                }
                inputName="current_billing"
                label="FATURAMENTO MENSAL"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.select
                  value={editedUser.details.current_billing ?? ""}
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
                <h3 className="text-beergam-blue-primary mb-4 !font-bold">
                  Vendas em Marketplaces
                </h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
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
                  dayjs(editedUser.details.foundation_date).format(
                    "DD/MM/YYYY"
                  ) ?? ""
                }
                inputName="foundation_date"
                label="DATA DE FUNDAÇÃO"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <BasicDatePicker />
              </ElementWrapper>
              <ElementWrapper
                canBeAlter={true}
                value={FormatSegment(editedUser.details.segment as Segment)}
                inputName="segment"
                label="SEGMENTO"
                onChange={handleChange}
                editedUserError={editedUserError}
              >
                <Fields.select
                  value={editedUser.details.segment ?? ""}
                  options={Object.keys(Segment).map((key) => ({
                    value: key,
                    label: FormatSegment(key as Segment),
                  }))}
                />
              </ElementWrapper>
            </ElementSection>
          </>
        )}
    </div>
  );
}

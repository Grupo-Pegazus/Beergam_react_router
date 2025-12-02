import { Fields } from "~/src/components/utils/_fields";
import type { InputProps } from "~/src/components/utils/_fields/input";
// export default function UserFields({
//   canAlter,
//   value,
//   label,
//   onChange,
//   type = "input",
//   clipboard = false,
//   hint,
//   options,
//   error,
//   errorMessage,
//   dataTooltipId,
// }: {
//   canAlter: boolean;
//   value: string | null | undefined;
//   label: string;
//   type?: "input" | "text";
//   onChange?: (
//     e:
//       | React.ChangeEvent<HTMLInputElement>
//       | React.ChangeEvent<HTMLSelectElement>
//   ) => void;
//   clipboard?: boolean;
//   hint?: string;
//   options?: { value: string; label: string }[];
//   error?: boolean;
//   errorMessage?: string;
//   dataTooltipId?: string;
// }) {
//   let optionsList = options ?? [];
//   if (options && (value === null || value === undefined || value === "")) {
//     optionsList = [
//       { value: null as unknown as string, label: "Selecione um valor" },
//       ...options,
//     ];
//   }
//   return (
//     <Fields.wrapper className="w-full!">
//       <div className="flex items-center gap-1">
//         <Fields.label text={label} />
//         {hint && (
//           <Hint
//             message={hint}
//             anchorSelect={label.toLocaleLowerCase() + "-tooltip"}
//           />
//         )}
//       </div>
//       {type === "input" && !options && (
//         <Fields.input
//           value={value ?? ""}
//           placeholder="Campo não preenchido."
//           onChange={onChange}
//           disabled={!canAlter}
//           clipboard={clipboard}
//           error={error ? errorMessage : undefined}
//           dataTooltipId={dataTooltipId}
//         />
//       )}
//       {type === "input" && options && (
//         <Fields.select
//           value={value ?? ""}
//           options={optionsList}
//           onChange={(e) => onChange?.(e)}
//           disabled={!canAlter}
//         />
//       )}
//       {type === "text" && (
//         <div className="flex items-center gap-2">
//           <p className="text-beergam-blue-primary">
//             {value ?? "Campo não preenchido."}
//           </p>
//           {clipboard && (
//             <CopyButton
//               textToCopy={value ?? ""}
//               iconSize="h-3.5 w-3.5 md:h-4 md:w-4"
//               ariaLabel="Copiar"
//             />
//           )}
//         </div>
//       )}
//     </Fields.wrapper>
//   );
// }
interface UserFieldsProps extends InputProps {
  label: string;
  hint?: string;
  access?: boolean;
  name: string;
  canAlter: boolean;
  nullable?: boolean;
  options?: { value: string; label: string }[];
}
export default function UserFields({
  label,
  name,
  error,
  onChange,
  canAlter,
  options,
  value,
  nullable = false,
  ...props
}: UserFieldsProps) {
  const selectValue = value
    ? typeof value === "string"
      ? value
      : String(value)
    : null;

  // Se não tiver options, adiciona a option "Selecione um campo"
  const listedOption = nullable
    ? [{ value: "", label: "Selecione um campo" }, ...(options || [])]
    : options;
  return (
    <Fields.wrapper className="w-full!">
      <Fields.label text={label} />
      {options ? (
        <>
          <Fields.select
            name={name}
            value={selectValue}
            options={listedOption}
            onChange={(e) => {
              if (onChange) {
                // Cria um objeto compatível com o que o register espera
                const syntheticEvent = {
                  ...e,
                  target: {
                    value: e.target.value,
                    name: e.target.name,
                  },
                } as unknown as React.ChangeEvent<HTMLInputElement>;
                onChange(syntheticEvent);
              }
            }}
            disabled={canAlter ? false : true}
            error={error ? { message: error, error: true } : undefined}
          />
        </>
      ) : (
        <Fields.input
          name={name}
          disabled={canAlter ? false : true}
          onChange={onChange}
          error={error}
          dataTooltipId={`${name}-input`}
          value={value}
          {...props}
        />
      )}
    </Fields.wrapper>
  );
}

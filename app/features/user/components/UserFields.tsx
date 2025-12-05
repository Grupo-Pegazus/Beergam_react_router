import { Fields } from "~/src/components/utils/_fields";
import type { InputProps } from "~/src/components/utils/_fields/input";
import Hint from "~/src/components/utils/Hint";

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
  hint,
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
      <div className="flex items-center gap-1">
        <Fields.label text={label} />
        {hint && (
          <Hint
            message={hint}
            anchorSelect={label.toLocaleLowerCase() + "-tooltip"}
          />
        )}
      </div>
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
            widthType="full"
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

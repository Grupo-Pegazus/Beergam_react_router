import CopyButton from "~/src/components/ui/CopyButton";
import { Fields } from "~/src/components/utils/_fields";
import Hint from "~/src/components/utils/Hint";

export default function UserFields({
  canAlter,
  value,
  label,
  onChange,
  type = "input",
  clipboard = false,
  hint,
}: {
  canAlter: boolean;
  value: string | null | undefined;
  label: string;
  type?: "input" | "text";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clipboard?: boolean;
  hint?: string;
}) {
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
      {type === "input" && (
        <Fields.input
          value={value ?? ""}
          placeholder="Campo não preenchido."
          onChange={onChange}
          disabled={!canAlter}
          clipboard={clipboard}
        />
      )}
      {type === "text" && (
        <div className="flex items-center gap-2">
          <p className="text-beergam-blue-primary">
            {value ?? "Campo não preenchido."}
          </p>
          {clipboard && (
            <CopyButton
              textToCopy={value ?? ""}
              iconSize="h-3.5 w-3.5 md:h-4 md:w-4"
              ariaLabel="Copiar"
            />
          )}
        </div>
      )}
    </Fields.wrapper>
  );
}

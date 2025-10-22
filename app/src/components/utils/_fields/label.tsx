import React from "react";
import Hint from "../Hint";

interface LabelProps {
  text: string;
  required?: boolean;
  info?: string;
  styleLabel?: React.CSSProperties;
  tailWindClasses?: string;
  hint?: string;
}

function Label({
  text,
  required,
  info,
  styleLabel,
  tailWindClasses,
  hint,
}: LabelProps) {
  return (
    <div className={`flex items-center gap-2`}>
      <label
        className={`font-medium text-sm text-beergam-gray ${tailWindClasses || ""} sm:text-base relative inline-flex items-center gap-2`}
        style={{ ...styleLabel, textTransform: "inherit" }}
      >
        {text}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {hint && (
        <Hint
          message={hint}
          anchorSelect={text.toLocaleLowerCase() + "-tooltip"}
        />
      )}
      {info && <p className="text-xs text-[#858585]">*{info}</p>}
    </div>
  );
}

export default Label;

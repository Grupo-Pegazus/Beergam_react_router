import React from "react";

interface LabelProps {
  text: string;
  required?: boolean;
  info?: string;
  styleLabel?: React.CSSProperties;
  tailWindClasses?: string;
}

function Label({
  text,
  required,
  info,
  styleLabel,
  tailWindClasses,
}: LabelProps) {
  return (
    <div className={`flex items-start gap-4`}>
      <label
        className={`font-medium text-sm text-beergam-gray ${tailWindClasses || ""} sm:text-base`}
        style={{ ...styleLabel, textTransform: "inherit" }}
      >
        {text}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {info && <p className="text-xs text-[#858585]">*{info}</p>}
    </div>
  );
}

export default Label;

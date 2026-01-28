import React from "react";

interface LabelTextProps {
  label: string;
  text: string;
  style?: React.CSSProperties;
  styleLabel?: React.CSSProperties;
  styleValue?: React.CSSProperties;
}

function LabelText({
  label,
  text,
  style,
  styleLabel,
  styleValue,
}: LabelTextProps) {
  return (
    <div className="flex gap-[0.3rem] mb-[5px]" style={style}>
      <p className="text-sm font-semibold text-beergam-typography-primary" style={styleLabel}>
        {label}:
      </p>
      <p className="text-sm font-medium text-beergam-typography-primary" style={styleValue}>{text}</p>
    </div>
  );
}

export default LabelText;

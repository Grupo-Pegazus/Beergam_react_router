import React from "react";

interface InputWrapperProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export default function Wrapper({
  children,
  style,
  className,
}: InputWrapperProps) {
  return (
    <div
      className={`w-full relative flex flex-col items-start gap-2 ${className || ""}`}
      style={style}
    >
      {children}
    </div>
  );
}

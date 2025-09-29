import React from "react";

interface InputWrapperProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  tailWindClasses?: string;
}

export default function Wrapper({
  children,
  style,
  className,
  tailWindClasses,
}: InputWrapperProps) {
  return (
    <div
      className={`w-full relative flex flex-col items-start gap-2 ${className || ""} ${tailWindClasses || ""}`}
      style={style}
    >
      {children}
    </div>
  );
}

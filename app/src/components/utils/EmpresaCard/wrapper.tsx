import React from "react";

interface WrapperProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

function Wrapper({ children, style }: WrapperProps) {
  return (
    <div
      className="relative my-8 py-10 px-5 flex flex-col gap-4 items-center justify-evenly text-center rounded-[15px] bg-white"
      style={style}
    >
      {children}
    </div>
  );
}

export default Wrapper;

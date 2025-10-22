import React from "react";

interface emBreveProps {
  style?: React.CSSProperties;
}

function emBreve({ style }: emBreveProps) {
  return (
    <span
      className="absolute top-2.5 left-2.5 text-xs py-1.5 px-2.5 rounded bg-gradient-to-r from-[#969696] to-[#D8D8D8] text-white"
      style={style}
    >
      Em breve
    </span>
  );
}

export default emBreve;

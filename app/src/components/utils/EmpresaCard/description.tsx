import React from "react";

interface DescriptionProps {
  description: string;
  style?: React.CSSProperties;
}

function Description({ description, style }: DescriptionProps) {
  return (
    <p className="opacity-70 leading-4" style={style}>
      {description}
    </p>
  );
}

export default Description;

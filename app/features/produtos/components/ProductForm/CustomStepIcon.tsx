import React from "react";
import type { StepIconProps } from "@mui/material/StepIcon";
import { styled } from "@mui/material/styles";
import Svg from "~/src/assets/svgs/_index";
import type { SvgBaseProps } from "~/src/assets/svgs/IconBase";

const StepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 40,
  height: 40,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundColor: theme.palette.primary.main,
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundColor: theme.palette.primary.main,
  }),
}));

// Mapeamento de ícones por índice do step
// Isso será preenchido dinamicamente baseado nos steps do formulário
let iconMap: Record<number, string | React.ReactNode> = {};

export function setStepIconMap(map: Record<number, string | React.ReactNode>) {
  iconMap = map;
}

export default function CustomStepIcon(props: StepIconProps) {
  const { active, completed, className, icon } = props;

  const renderIcon = () => {
    // Se completado, mostra check circle
    if (completed) {
      const CheckCircleIcon = Svg.check_circle;
      return React.createElement(CheckCircleIcon, {
        width: 24,
        height: 24,
        stroke: "#fff",
        fill: "none",
      } as SvgBaseProps);
    }

    // Busca o ícone customizado no mapa usando o número do step
    const stepNumber = Number(icon);
    const customIcon = iconMap[stepNumber];

    if (customIcon) {
      // Se for string, busca no Svg
      if (typeof customIcon === "string" && customIcon in Svg) {
        const IconComponent = Svg[customIcon as keyof typeof Svg];
        return React.createElement(IconComponent, {
          width: 24,
          height: 24,
          stroke: "#fff",
          fill: "none",
        } as SvgBaseProps);
      }

      // Se for elemento React, renderiza diretamente
      if (React.isValidElement(customIcon)) {
        return customIcon;
      }
    }

    // Fallback: número do step
    return <span style={{ fontSize: 18, fontWeight: 600 }}>{String(icon || "")}</span>;
  };

  return (
    <StepIconRoot ownerState={{ completed, active }} className={className}>
      {renderIcon()}
    </StepIconRoot>
  );
}

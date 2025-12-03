import type { SvgBaseProps } from "./IconBase";
import IconBase from "./IconBase";

export default function Hamburguer(svgProps: SvgBaseProps) {
  return (
    <IconBase fill="none" strokeWidth={1.5} stroke="currentColor" {...svgProps}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </IconBase>
  );
}

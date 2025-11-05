import type { SvgBaseProps } from "./IconBase";
import IconBase from "./IconBase";

export default function Chevron(props: SvgBaseProps) {
  return (
    <IconBase
      fill="none"
      strokeWidth={1.5}
      stroke="currentColor"
      tailWindClasses={["transition-transform duration-200", props.tailWindClasses || ""].join(" ")}
      {...props}
    >
      <path d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}
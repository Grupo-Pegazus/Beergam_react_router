import type { SvgBaseProps } from "./IconBase";
import IconBase from "./IconBase";

export default function ArrowUturnRight(props: SvgBaseProps) {
  return (
    <IconBase fill="none" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
      />
    </IconBase>
  );
}

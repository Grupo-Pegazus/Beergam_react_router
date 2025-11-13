import type { SvgBaseProps } from "./IconBase";
import IconBase from "./IconBase";

export default function DollyIcon(props: SvgBaseProps) {
  return (
    <IconBase
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 16v4m0 0h4m-4 0h4m3-5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-5 3a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-2-6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm7 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-7 3a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm14 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-4-6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </IconBase>
  );
}

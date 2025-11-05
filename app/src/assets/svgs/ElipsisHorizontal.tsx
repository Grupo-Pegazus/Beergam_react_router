import type { SvgBaseProps } from "./IconBase";
import IconBase from "./IconBase";

export default function ElipsisHorizontal(props: SvgBaseProps) {
  return (
    <IconBase strokeWidth={1.5} stroke="currentColor" fill="none" viewBox="0 0 24 24" {...props}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
        />
    </IconBase>
  );
}

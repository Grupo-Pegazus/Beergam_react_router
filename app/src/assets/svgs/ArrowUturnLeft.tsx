import IconBase, { type SvgBaseProps } from "./IconBase";

export default function ArrowUturnLeft(props: SvgBaseProps) {
  return (
    <IconBase fill="none" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
      />
    </IconBase>
  );
}

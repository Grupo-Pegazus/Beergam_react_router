import IconBase, { type SvgBaseProps } from "./IconBase";

export default function Minus(props: SvgBaseProps) {
  return (
    <IconBase fill="none" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </IconBase>
  );
}

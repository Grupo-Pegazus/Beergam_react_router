import IconBase, { type SvgBaseProps } from "./IconBase";

export default function MinusCircle(props: SvgBaseProps) {
  return (
    <IconBase fill="none" strokeWidth={1.5} stroke="currentColor" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</IconBase>

  );
}
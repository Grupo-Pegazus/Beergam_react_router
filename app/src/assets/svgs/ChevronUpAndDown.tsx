import IconBase, { type SvgBaseProps } from "./IconBase";
export default function ChevronUpAndDown(props: SvgBaseProps) {
  return (
      <IconBase fill="none" strokeWidth={1.5} stroke="currentColor" { ...props }>
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
</IconBase>

  );
}
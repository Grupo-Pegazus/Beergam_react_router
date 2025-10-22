import IconBase, { type SvgBaseProps } from "./IconBase";

export default function Check(props: SvgBaseProps) {
  return (
    <IconBase fill="none" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 12.75 6 6 9-13.5"
      />{" "}
    </IconBase>
  );
}

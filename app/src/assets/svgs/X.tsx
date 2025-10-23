import IconBase, { type SvgBaseProps } from "./IconBase";
export default function X(props: SvgBaseProps) {
  return (
    <IconBase
      fill="none"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </IconBase>
  );
}

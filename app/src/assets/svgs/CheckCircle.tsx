import IconBase, { type SvgBaseProps } from "./IconBase";

export default function CheckCircle(props: SvgBaseProps) {
  return (
    <IconBase
      fill="none"
      strokeWidth={1.5}
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </IconBase>
  );
}

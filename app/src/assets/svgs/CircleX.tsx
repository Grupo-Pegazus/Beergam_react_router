import IconBase, { type SvgBaseProps } from "./IconBase";
export default function CircleX(props: SvgBaseProps) {
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
        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </IconBase>
  );
}

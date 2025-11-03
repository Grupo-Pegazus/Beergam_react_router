import IconBase, { type SvgBaseProps } from "./IconBase";
export default function Line(props: SvgBaseProps) {
  return (
    <IconBase fill="none" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.01526 15.3939L4.3107 14.7046L10.3107 0.704556L10.6061 0.0151978L11.9849 0.606077L11.6894 1.29544L5.68942 15.2954L5.39398 15.9848L4.01526 15.3939Z"
      />
    </IconBase>
  );
}

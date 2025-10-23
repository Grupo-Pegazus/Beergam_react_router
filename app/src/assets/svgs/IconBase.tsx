export interface SvgBaseProps extends React.SVGProps<SVGSVGElement> {
  tailWindClasses?: string;
}
interface IconBaseProps extends SvgBaseProps {
  children: React.ReactNode;
}
export default function IconBase({
  tailWindClasses,
  strokeWidth,
  stroke,
  children,
  width,
  fill,
}: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={tailWindClasses}
      width={width}
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      stroke={stroke}
      fill={fill}
    >
      {children}
    </svg>
  );
}

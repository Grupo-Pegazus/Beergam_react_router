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
  height,
  viewBox = "0 0 24 24",
}: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={tailWindClasses}
      width={width}
      height={height}
      strokeWidth={strokeWidth}
      viewBox={viewBox}
      stroke={stroke}
      fill={fill}
    >
      {children}
    </svg>
  );
}

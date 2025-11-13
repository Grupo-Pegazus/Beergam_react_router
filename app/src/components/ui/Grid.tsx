import type { PropsWithChildren } from "react";

interface GridProps extends PropsWithChildren {
  cols?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
}

export default function Grid({
  cols = { base: 1, md: 2, lg: 3 },
  gap = 4,
  className,
  children,
}: GridProps) {
  const classes = [
    "grid",
    `gap-${gap}`,
    cols.base ? `grid-cols-${cols.base}` : "",
    cols.sm ? `sm:grid-cols-${cols.sm}` : "",
    cols.md ? `md:grid-cols-${cols.md}` : "",
    cols.lg ? `lg:grid-cols-${cols.lg}` : "",
    cols.xl ? `xl:grid-cols-${cols.xl}` : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}



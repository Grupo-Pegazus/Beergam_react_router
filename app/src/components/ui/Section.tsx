import type { ReactNode, RefObject } from "react";

interface SectionProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode | ReactNode[];
  titleClassName?: string;
  className?: string;
  ref?: RefObject<HTMLDivElement | null> | null;
  onClick?: () => void;
}

export default function Section({
  children,
  title = "",
  actions,
  titleClassName,
  className,
  ref,
  onClick,
}: SectionProps) {
  return (
    <section
      ref={ref}
      onClick={onClick}
      className={`w-full min-w-0 bg-beergam-section-background! flex flex-col gap-4 border border-black/10 rounded-2xl p-4 mb-4 shadow-sm  ${className} ${onClick ? "cursor-pointer hover:shadow-transparent hover:translate-y-[2px]" : ""}`}
    >
      <div
        className={`flex flex-col md:flex-row items-center justify-between min-w-0`}
      >
        {title && (
          <h3
            className={`text-lg md:text-xl font-semibold text-beergam-typography-primary truncate ${titleClassName}`}
          >
            {title}
          </h3>
        )}
        {actions ? (
          <div
            className={`grid relative z-1000 md:flex gap-4 md:mt-0 mt-4`}
            onClick={(e) => e.stopPropagation()}
          >
            {actions}
          </div>
        ) : null}
      </div>
      <div className="w-full min-w-0 overflow-visible">{children}</div>
    </section>
  );
}

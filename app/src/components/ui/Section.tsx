import type { ReactNode, RefObject } from "react";

interface SectionProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
  className?: string;
  ref?: RefObject<HTMLDivElement | null> | null;
}

export default function Section({
  children,
  title = "",
  actions,
  className,
  ref,
}: SectionProps) {
  return (
    <section
      ref={ref}
      className={`w-full min-w-0 flex flex-col gap-4 border border-black/10 rounded-2xl p-4 mb-4 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between min-w-0">
        {title && (
          <h3 className="text-lg md:text-xl font-semibold text-beergam-blue-primary truncate">
            {title}
          </h3>
        )}
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      <div className="w-full min-w-0 overflow-visible">{children}</div>
    </section>
  );
}

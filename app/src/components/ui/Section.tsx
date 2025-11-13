import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  title: string;
  actions?: ReactNode;
}

export default function Section({ 
  children,
  title,
  actions,
 }: SectionProps) {
  return (
    <section className="w-full flex flex-col gap-4 border border-black/10 rounded-2xl p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg md:text-xl font-semibold text-beergam-blue-primary">{title}</h3>
        {actions ? actions : null}
      </div>
      {children}
    </section>
  );
}



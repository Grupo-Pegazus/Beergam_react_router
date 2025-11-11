import type { PropsWithChildren } from "react";

 export default function ScheduleOverlay({
  open,
  onClose,
  children,
}: PropsWithChildren<{ open: boolean; onClose: () => void }>) {
  if (!open) return null;
   return (
     <div className="fixed inset-0 z-1000">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        role="button"
        aria-label="Fechar overlay"
      />
      <div className="absolute inset-0 p-4 flex items-center justify-center">
        <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-black/10 p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}



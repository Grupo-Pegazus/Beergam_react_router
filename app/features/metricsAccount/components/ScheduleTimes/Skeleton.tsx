export default function ScheduleTimesSkeleton() {
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-beergam-section-background p-4 shadow-sm animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-beergam-mui-paper" />
          <div className="h-4 w-40 bg-beergam-mui-paper rounded" />
        </div>
        <div className="h-6 w-24 bg-beergam-mui-paper rounded" />
      </div>
    </div>
  );
}



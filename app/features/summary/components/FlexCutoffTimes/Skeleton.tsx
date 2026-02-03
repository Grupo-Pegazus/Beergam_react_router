export default function FlexCutoffTimesSkeleton() {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200" />
          <div className="h-4 w-40 bg-slate-200 rounded" />
        </div>
        <div className="h-6 w-24 bg-slate-200 rounded" />
      </div>
    </div>
  );
}

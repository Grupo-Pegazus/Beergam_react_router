import MainCards from "~/src/components/ui/MainCards";

export default function LowStockProductsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((index) => (
        <MainCards key={index} className="flex h-full flex-col gap-3 p-4">
          <div className="flex items-start gap-3">
            <div className="h-16 w-16 rounded-lg bg-slate-200 animate-pulse" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded animate-pulse" />
              <div className="h-3 bg-slate-200 rounded w-2/3 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse" />
          </div>
        </MainCards>
      ))}
    </div>
  );
}


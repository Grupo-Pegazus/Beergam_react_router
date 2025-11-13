import StatCard from "~/src/components/ui/StatCard";
import Svg from "~/src/assets/svgs/_index";
import { Skeleton } from "@mui/material";

export default function TopAnunciosVendidosSkeleton() {
  return (
    <StatCard
      icon={<Svg.star tailWindClasses="w-5 h-5 text-amber-600" />}
      title="Top 5 Anúncios Mais Vendidos"
      color="amber"
      variant="soft"
    >
      <div className="mt-4 space-y-3">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-xl border border-black/10 bg-white"
          >
            <div className="flex items-center gap-3 flex-1">
              <Skeleton variant="circular" width={32} height={32} />
              <div className="flex-1">
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="text" width="60%" height={16} className="mt-1" />
              </div>
            </div>
            <Skeleton variant="rectangular" width={48} height={48} className="rounded-lg" />
          </div>
        ))}
      </div>
    </StatCard>
  );
}



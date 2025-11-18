import { Skeleton } from "@mui/material";
import Grid from "~/src/components/ui/Grid";
import StatCard from "~/src/components/ui/StatCard";

export default function MetricasCardsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton variant="text" width={200} height={24} className="mb-3" />
        <Grid cols={{ base: 1, lg: 4 }}>
          {[1, 2, 3, 4].map((i) => (
            <StatCard
              key={i}
              icon={<Skeleton variant="circular" width={20} height={20} />}
              title={<Skeleton variant="text" width={120} height={20} />}
              value={<Skeleton variant="text" width={60} height={32} />}
              variant="soft"
              color="slate"
            />
          ))}
        </Grid>
      </div>
      <div>
        <Skeleton variant="text" width={150} height={24} className="mb-3" />
        <Grid cols={{ base: 1, md: 3 }}>
          {[1, 2, 3].map((i) => (
            <StatCard
              key={i}
              icon={<Skeleton variant="circular" width={20} height={20} />}
              title={<Skeleton variant="text" width={180} height={20} />}
              value={<Skeleton variant="text" width={100} height={32} />}
              variant="soft"
              color="slate"
            />
          ))}
        </Grid>
      </div>
    </div>
  );
}


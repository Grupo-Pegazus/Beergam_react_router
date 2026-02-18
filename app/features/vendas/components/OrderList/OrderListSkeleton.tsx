import { Divider, Skeleton, Stack } from "@mui/material";
import MainCards from "~/src/components/ui/MainCards";

export default function OrderListSkeleton() {
  return (
    <Stack spacing={2}>
      {[1, 2, 3, 4, 5].map((i) => (
        <MainCards key={i} className="p-4">
          <div className="flex flex-col gap-2">
            {/* Header: ID, Data e Chips */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Skeleton variant="text" width={80} height={16} />
                  <Skeleton variant="circular" width={16} height={16} />
                </div>
                <Skeleton variant="text" width={120} height={16} />
                <Skeleton variant="rectangular" width={80} height={24} className="rounded-full" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton variant="circular" width={16} height={16} />
                <Skeleton variant="text" width={100} height={16} />
                <Skeleton variant="text" width={60} height={16} />
              </div>
            </div>

            {/* Divider */}
            <Divider />

            {/* Status Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton variant="rectangular" width={100} height={24} className="rounded-full" />
            </div>

            {/* Status do envio */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-1">
                <Skeleton variant="text" width={150} height={24} />
                <Skeleton variant="text" width={200} height={20} />
              </div>
            </div>

            {/* OrderItemCard Skeleton */}
            <div className="flex justify-between items-center gap-2 bg-beergam-mui-paper rounded-lg p-2 w-full">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Skeleton variant="rectangular" width={60} height={60} className="rounded-lg" />
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <Skeleton variant="text" width="80%" height={20} />
                  <Skeleton variant="text" width={120} height={16} />
                  <Skeleton variant="text" width={80} height={16} />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 w-[30%] bg-beergam-section-background p-2 rounded-lg shrink-0">
                <div className="flex items-center gap-2 w-full">
                  <Skeleton variant="rectangular" width="25%" height={50} className="rounded-lg" />
                  <Skeleton variant="rectangular" width="25%" height={50} className="rounded-lg" />
                  <Skeleton variant="rectangular" width="25%" height={50} className="rounded-lg" />
                  <Skeleton variant="rectangular" width="25%" height={50} className="rounded-lg" />
                </div>
                <div className="flex items-center gap-2 w-full">
                  <Skeleton variant="rectangular" width="50%" height={50} className="rounded-lg" />
                  <Skeleton variant="rectangular" width="50%" height={50} className="rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </MainCards>
      ))}
    </Stack>
  );
}


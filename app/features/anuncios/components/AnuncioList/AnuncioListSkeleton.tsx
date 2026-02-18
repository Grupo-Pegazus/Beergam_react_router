import { Skeleton, Stack } from "@mui/material";

export default function AnuncioListSkeleton() {
  return (
    <Stack spacing={2}>
      {[1, 2, 3].map((index) => (
        <div key={index} className="rounded-xl border border-black/5 dark:border-white/10 bg-beergam-section-background p-4">
          <div className="grid grid-cols-12 gap-4">
            {/* Coluna Esquerda */}
            <div className="col-span-12 md:col-span-5 flex gap-3">
              <Skeleton variant="rectangular" width={20} height={20} />
              <Skeleton variant="rectangular" width={64} height={64} className="rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="60%" height={16} />
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="text" width="40%" height={16} />
                <Skeleton variant="text" width="30%" height={14} />
              </div>
            </div>
            {/* Coluna do Meio */}
            <div className="col-span-12 md:col-span-4 space-y-3">
              <div>
                <Skeleton variant="text" width="50%" height={14} />
                <Skeleton variant="text" width="70%" height={18} />
                <Skeleton variant="text" width="60%" height={14} />
              </div>
              <div>
                <Skeleton variant="text" width="40%" height={24} />
                <Skeleton variant="rectangular" width="100%" height={80} className="rounded-lg mt-2" />
              </div>
            </div>
            {/* Coluna Direita */}
            <div className="col-span-12 md:col-span-3 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="space-y-1">
                  <Skeleton variant="text" width={100} height={14} />
                  <Skeleton variant="text" width={80} height={12} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="space-y-1">
                  <Skeleton variant="text" width={100} height={14} />
                  <Skeleton variant="text" width={120} height={12} />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <Skeleton variant="rectangular" width={80} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </Stack>
  );
}
